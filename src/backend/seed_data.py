import json
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Ward, Department

# Coimbatore Wards Boundaries (GeoJSON Polygons for RS Puram, Gandhipuram, Peelamedu)
RS_PURAM_GEOJSON = json.dumps({
    "type": "Polygon",
    "coordinates": [[
        [76.9450, 11.0050],
        [76.9580, 11.0050],
        [76.9580, 11.0180],
        [76.9450, 11.0180],
        [76.9450, 11.0050]
    ]]
})

GANDHIPURAM_GEOJSON = json.dumps({
    "type": "Polygon",
    "coordinates": [[
        [76.9600, 11.0150],
        [76.9750, 11.0150],
        [76.9750, 11.0280],
        [76.9600, 11.0280],
        [76.9600, 11.0150]
    ]]
})

PEELAMEDU_GEOJSON = json.dumps({
    "type": "Polygon",
    "coordinates": [[
        [77.0000, 11.0200],
        [77.0200, 11.0200],
        [77.0200, 11.0350],
        [77.0000, 11.0350],
        [77.0000, 11.0200]
    ]]
})

def run_auto_migrations():
    """
    Auto-migrates new columns on existing PostgreSQL database tables.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_severity_score INTEGER DEFAULT 7;"))
            conn.execute(text("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_hazard_type VARCHAR DEFAULT 'Public Hazard';"))
            conn.execute(text("ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_explanation TEXT DEFAULT 'Verified civic issue.';"))
            conn.commit()
    except Exception as e:
        print(f"Auto-migration notice: {e}")

def seed_db():
    """
    Initializes PostgreSQL tables, executes auto-migrations, and seeds metadata.
    """
    Base.metadata.create_all(bind=engine)
    run_auto_migrations()
    
    db: Session = SessionLocal()

    # Seed Official Municipal Departments
    departments = ["Roads & Highways", "Water Supply", "Sanitation", "Street Lighting", "Electricity", "Drainage"]
    for dept_name in departments:
        if not db.query(Department).filter(Department.name == dept_name).first():
            db.add(Department(name=dept_name))
    db.commit()

    # Seed Initial Coimbatore Pilot Wards
    wards_data = [
        {"ward_number": "Ward 1", "name": "RS Puram", "geojson_boundary": RS_PURAM_GEOJSON, "centroid_lat": 11.0115, "centroid_lng": 76.9515},
        {"ward_number": "Ward 2", "name": "Gandhipuram", "geojson_boundary": GANDHIPURAM_GEOJSON, "centroid_lat": 11.0215, "centroid_lng": 76.9675},
        {"ward_number": "Ward 3", "name": "Peelamedu", "geojson_boundary": PEELAMEDU_GEOJSON, "centroid_lat": 11.0275, "centroid_lng": 77.0100},
    ]

    for w_data in wards_data:
        if not db.query(Ward).filter(Ward.ward_number == w_data["ward_number"]).first():
            db.add(Ward(**w_data))
    db.commit()

    # Seed Officers
    from api.deps import get_password_hash
    from models import Officer
    officers_data = [
        {"mobile_number": "9988776655", "name": "Sathish Kumar", "email": "sathish@municipality.gov.in", "role": "ward_officer", "department_name": "Electricity", "hashed_password": get_password_hash("officer123")},
        {"mobile_number": "9988776656", "name": "Ramesh Kannan", "email": "ramesh.water@municipality.gov.in", "role": "ward_officer", "department_name": "Water Supply", "hashed_password": get_password_hash("officer123")},
        {"mobile_number": "9988776657", "name": "Priya Rajan", "email": "priya.roads@municipality.gov.in", "role": "ward_officer", "department_name": "Roads & Highways", "hashed_password": get_password_hash("officer123")},
        {"mobile_number": "9988776658", "name": "Karthik Raja", "email": "karthik.sanitation@municipality.gov.in", "role": "ward_officer", "department_name": "Sanitation", "hashed_password": get_password_hash("officer123")},
    ]

    for o_data in officers_data:
        if not db.query(Officer).filter(Officer.mobile_number == o_data["mobile_number"]).first():
            dept = db.query(Department).filter(Department.name == o_data["department_name"]).first()
            if dept:
                db.add(Officer(
                    mobile_number=o_data["mobile_number"],
                    name=o_data["name"],
                    email=o_data["email"],
                    role=o_data["role"],
                    department_id=dept.id,
                    hashed_password=o_data["hashed_password"]
                ))
    db.commit()
    db.close()

def reset_and_seed_db():
    Base.metadata.drop_all(bind=engine)
    seed_db()

if __name__ == "__main__":
    seed_db()
