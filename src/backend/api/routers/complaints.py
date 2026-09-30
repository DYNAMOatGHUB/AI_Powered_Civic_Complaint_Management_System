from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Complaint, Ward, User
from api.deps import get_current_user, get_optional_current_user, get_password_hash
from services.ai_service import (
    analyze_complaint, 
    detect_semantic_duplicate, 
    validate_photo_with_gemini, 
    get_department_for_complaint
)
from services.cloudinary_service import upload_image

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.get("/", response_model=List[dict])
def get_complaints(
    ward_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    
    if current_user and hasattr(current_user, 'department_id') and current_user.department_id is not None:
        query = query.filter(Complaint.department_id == current_user.department_id)
    
    if ward_id:
        query = query.filter(Complaint.ward_id == ward_id)
    if category:
        query = query.filter(Complaint.category == category)
    if status:
        query = query.filter(Complaint.status == status)

    # Requirement 8: Priority-First Queue Ranking Order (AI Severity > Upvotes > Waiting Time)
    complaints = query.order_by(
        Complaint.ai_severity_score.desc(),
        Complaint.vote_count.desc(),
        Complaint.created_at.asc()
    ).all()

    results = []
    for c in complaints:
        results.append({
            "id": c.id,
            "name": c.name,
            "street": c.street,
            "description": c.description,
            "mobile_number": c.mobile_number,
            "communication_address": c.communication_address,
            "category": c.category,
            "gender": c.gender,
            "email": c.email,
            "ward_id": c.ward_id,
            "location_lat": c.location_lat,
            "location_lng": c.location_lng,
            "pincode": c.pincode,
            "landmark": c.landmark,
            "photo_url": c.photo_url,
            "status": c.status,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "vote_count": c.vote_count,
            "ai_severity_score": c.ai_severity_score,
            "ai_hazard_type": c.ai_hazard_type,
            "ai_explanation": c.ai_explanation
        })
    return results

@router.post("/precheck-duplicate")
def precheck_duplicate(
    ward_id: int = Query(...),
    category: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Step 1 Pre-Check endpoint: Returns existing open complaints in the target ward
    so citizens can review and upvote before submitting a duplicate.
    """
    open_complaints = db.query(Complaint).filter(
        Complaint.ward_id == ward_id,
        Complaint.category == category,
        Complaint.status.in_(["Open", "In Progress", "Overdue"])
    ).order_by(Complaint.vote_count.desc()).limit(5).all()

    return [
        {
            "id": c.id,
            "category": c.category,
            "street": c.street,
            "description": c.description,
            "vote_count": c.vote_count,
            "status": c.status
        }
        for c in open_complaints
    ]

@router.post("/create")
async def create_complaint(
    name: str = Form(...),
    street: str = Form(...),
    description: str = Form(...),
    mobile_number: str = Form(...),
    communication_address: str = Form(...),
    category: str = Form(...),
    gender: str = Form(...),
    email: str = Form(...),
    ward_id: int = Form(...),
    location_lat: float = Form(...),
    location_lng: float = Form(...),
    pincode: Optional[str] = Form(None),
    landmark: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    # Requirement 5: Strict Backend Pin Location Validation
    if not location_lat or not location_lng or location_lat == 0.0 or location_lng == 0.0:
        raise HTTPException(
            status_code=400,
            detail="Location coordinates are required. Please mark the complaint location on the map before submitting."
        )

    # Automatically resolve user
    user_id = None
    if current_user:
        user_id = current_user.id
    else:
        existing_user = db.query(User).filter(User.mobile_number == mobile_number).first()
        if not existing_user:
            try:
                existing_user = User(
                    mobile_number=mobile_number,
                    name=name,
                    email=email,
                    hashed_password=get_password_hash("citizen123")
                )
                db.add(existing_user)
                db.commit()
                db.refresh(existing_user)
            except Exception:
                db.rollback()
                existing_user = db.query(User).first()
        if existing_user:
            user_id = existing_user.id

    # Fetch open complaints in the ward for 200m Haversine & Semantic AI duplicate check
    open_nearby = db.query(Complaint).filter(
        Complaint.ward_id == ward_id,
        Complaint.status.in_(["Open", "In Progress", "Overdue"])
    ).all()
    
    nearby_list = [
        {
            "id": c.id,
            "category": c.category,
            "description": c.description,
            "street": c.street,
            "lat": c.location_lat,
            "lng": c.location_lng,
            "vote_count": c.vote_count
        }
        for c in open_nearby
    ]
    
    # Requirements 6 & 7: 200m Proximity + Semantic AI Duplicate Check
    if nearby_list:
        try:
            dup_result = detect_semantic_duplicate(description, location_lat, location_lng, nearby_list)
            if dup_result.get("is_duplicate"):
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": "Your related complaint has already been raised by someone. Please upvote the existing complaint instead.",
                        "existing_complaint_id": dup_result.get("existing_complaint_id"),
                        "existing_complaint_votes": dup_result.get("existing_complaint_votes", 1),
                        "existing_complaint_location": dup_result.get("existing_complaint_location", street),
                        "reason": dup_result.get("reason")
                    }
                )
        except HTTPException:
            raise
        except Exception as dup_err:
            print(f"Duplicate precheck warning: {dup_err}")

    photo_url = None
    if photo:
        photo_bytes = await photo.read()
        if len(photo_bytes) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Photo size must be under 2 MB.")
            
        try:
            vision_result = validate_photo_with_gemini(photo_bytes, category, description)
            if not vision_result.get("is_valid"):
                raise HTTPException(
                    status_code=400,
                    detail=f"Photo validation failed: {vision_result.get('reason', 'Image does not match the issue description/category')}"
                )
        except HTTPException:
            raise
        except Exception as vis_err:
            print(f"Vision validation warning: {vis_err}")
            
        photo_url = upload_image(photo_bytes)

    dept_id = get_department_for_complaint(category, description, db)
    
    # Analyze severity and hazard type using Gemini AI (For Officer Portal Prioritization)
    ai_evaluation = analyze_complaint(category, description)
    ai_severity = ai_evaluation.get("severity_score", 8)
    ai_hazard = ai_evaluation.get("hazard_type", "Municipal Safety Risk")
    ai_expl = ai_evaluation.get("explanation", "Evaluated by AI Engine.")

    complaint = Complaint(
        created_by=user_id,
        ward_id=ward_id,
        department_id=dept_id,
        name=name,
        street=street,
        description=description,
        mobile_number=mobile_number,
        communication_address=communication_address,
        category=category,
        gender=gender,
        email=email,
        location_lat=location_lat,
        location_lng=location_lng,
        pincode=pincode,
        landmark=landmark,
        photo_url=photo_url,
        ai_severity_score=ai_severity,
        ai_hazard_type=ai_hazard,
        ai_explanation=ai_expl,
        status="Open",
        vote_count=1
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "id": complaint.id,
        "complaint_id": f"CID-{complaint.id}",
        "name": complaint.name,
        "street": complaint.street,
        "description": complaint.description,
        "category": complaint.category,
        "status": complaint.status,
        "created_at": complaint.created_at.isoformat() if complaint.created_at else None,
        "vote_count": complaint.vote_count,
        "message": f"Complaint CID-{complaint.id} registered successfully! You can track its status using Complaint ID CID-{complaint.id}."
    }

@router.post("/{complaint_id}/upvote")
def upvote_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    complaint.vote_count += 1
    db.commit()
    db.refresh(complaint)
    
    return {"id": complaint.id, "vote_count": complaint.vote_count, "message": "Upvoted successfully"}
