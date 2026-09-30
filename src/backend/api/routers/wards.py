import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Ward

router = APIRouter(prefix="/wards", tags=["wards"])

@router.get("/")
def get_wards(db: Session = Depends(get_db)):
    wards = db.query(Ward).all()
    result = []
    for w in wards:
        result.append({
            "id": w.id,
            "ward_number": w.ward_number,
            "name": w.name,
            "centroid_lat": w.centroid_lat,
            "centroid_lng": w.centroid_lng,
            "geojson_boundary": json.loads(w.geojson_boundary) if w.geojson_boundary else None
        })
    return result

@router.get("/search")
def search_ward(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    clean_q = query.strip()
    ward = db.query(Ward).filter(
        (Ward.name.ilike(f"%{clean_q}%")) | (Ward.ward_number.ilike(f"%{clean_q}%"))
    ).first()
    
    if not ward:
        # Search by partial name match
        ward = db.query(Ward).filter(Ward.name.ilike(f"%{clean_q[:3]}%")).first()
        
    if not ward:
        ward = db.query(Ward).first()
        
    if not ward:
        raise HTTPException(status_code=404, detail="No wards found")
        
    return {
        "id": ward.id,
        "ward_number": ward.ward_number,
        "name": ward.name,
        "centroid_lat": ward.centroid_lat,
        "centroid_lng": ward.centroid_lng,
        "geojson_boundary": json.loads(ward.geojson_boundary) if ward.geojson_boundary else None
    }
