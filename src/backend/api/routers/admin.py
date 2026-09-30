from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from models import Complaint, ComplaintEscalation, OfficerPerformanceFlag, Officer
from api.deps import get_current_officer

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard")
def officer_dashboard(
    ward_id: Optional[int] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    current_officer: Officer = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if ward_id:
        query = query.filter(Complaint.ward_id == ward_id)
    if category:
        query = query.filter(Complaint.category == category)
    if status:
        query = query.filter(Complaint.status == status)

    complaints = query.all()
    now = datetime.utcnow()

    for c in complaints:
        if c.status in ["Open", "In Progress"]:
            if c.escalation_due_at and now > c.escalation_due_at:
                c.status = "Overdue"
                esc = db.query(ComplaintEscalation).filter(ComplaintEscalation.complaint_id == c.id).first()
                if not esc:
                    new_esc = ComplaintEscalation(
                        complaint_id=c.id,
                        reason="14-day SLA Hard Limit Expired Unresolved",
                        escalated_to_role="higher_officer"
                    )
                    db.add(new_esc)
                    
                    if c.assigned_officer_id:
                        flag = db.query(OfficerPerformanceFlag).filter(
                            OfficerPerformanceFlag.officer_id == c.assigned_officer_id
                        ).first()
                        if not flag:
                            flag = OfficerPerformanceFlag(officer_id=c.assigned_officer_id)
                            db.add(flag)
                        flag.black_mark_count += 1
                        flag.escalated_count += 1

    db.commit()

    # Requirement 8: Severity-First Sorting
    sorted_complaints = sorted(
        complaints,
        key=lambda x: (x.ai_severity_score or 7, x.vote_count or 1, -x.created_at.timestamp() if x.created_at else 0),
        reverse=True
    )
    return sorted_complaints

@router.post("/complaints/{complaint_id}/respond")
def respond_to_complaint(
    complaint_id: int,
    action_plan: str = Body(..., embed=True),
    expected_resolution_time: Optional[str] = Body(None, embed=True),
    current_officer: Officer = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    # Requirement 9: Mandatory Dispatch & Response Field Validation
    if not action_plan or not action_plan.strip():
        raise HTTPException(status_code=400, detail="Dispatch action plan is required and cannot be empty or whitespace.")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = "In Progress"
    db.commit()

    return {"message": "Response submitted and dispatch recorded", "status": complaint.status}

@router.post("/complaints/{complaint_id}/complete")
def complete_complaint(
    complaint_id: int,
    evidence_notes: str = Body(..., embed=True),
    evidence_photo_url: Optional[str] = Body(None, embed=True),
    current_officer: Officer = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    # Requirement 9: Mandatory Response Notes Validation
    if not evidence_notes or not evidence_notes.strip():
        raise HTTPException(status_code=400, detail="Resolution response notes are required and cannot be empty.")

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = "Awaiting Verification"
    db.commit()

    return {"message": "Completion evidence submitted for citizen verification", "status": complaint.status}

@router.get("/performance-flags")
def get_performance_flags(
    current_officer: Officer = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    flags = db.query(OfficerPerformanceFlag).all()
    result = []
    for f in flags:
        officer = db.query(Officer).filter(Officer.id == f.officer_id).first()
        result.append({
            "officer_name": officer.name if officer else "Unknown",
            "black_mark_count": f.black_mark_count,
            "overdue_count": f.overdue_count,
            "escalated_count": f.escalated_count
        })
    return result
