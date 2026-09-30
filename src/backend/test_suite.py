import os
import json
import pytest
from datetime import timedelta
from fastapi.testclient import TestClient

from main import app
from database import engine, SessionLocal
from models import Base
from models import User, Officer, Department, Ward, Complaint
from api.deps import get_password_hash, verify_password, create_access_token
from services.ai_service import calculate_haversine_distance, detect_semantic_duplicate

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Ensure departments exist
    if not db.query(Department).first():
        db.add(Department(id=1, name="Roads & Highways"))
        db.add(Department(id=2, name="Street Lighting"))
        db.add(Department(id=3, name="Water Supply"))
        db.commit()
    if not db.query(User).filter(User.mobile_number == "9876543210").first():
        db.add(User(mobile_number="9876543210", hashed_password="pwd", name="Test Citizen"))
    if not db.query(Officer).filter(Officer.mobile_number == "9876543211").first():
        db.add(Officer(mobile_number="9876543211", hashed_password="pwd", name="Test Officer", role="ward_officer", department_id=1))
    db.commit()
    db.close()

# TEST 1: Password Hashing & Verification Security
def test_password_hashing_security():
    password = "SecurePassword123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert "$" in hashed
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

# TEST 2: JWT Creation, Expiration & Tampering
def test_jwt_token_validation():
    token = create_access_token(data={"sub": "9876543210", "role": "citizen"})
    assert token is not None

    # Test expired token
    expired_token = create_access_token(data={"sub": "9876543210", "role": "citizen"}, expires_delta=timedelta(seconds=-10))
    res = client.get("/admin/dashboard", headers={"Authorization": f"Bearer {expired_token}"})
    assert res.status_code in [401, 403]

    # Test tampered token
    tampered_token = token[:-5] + "XXXXX"
    res2 = client.get("/admin/dashboard", headers={"Authorization": f"Bearer {tampered_token}"})
    assert res2.status_code in [401, 403]

# TEST 3: Citizen → Officer Forbidden Role Access (HTTP 403)
def test_citizen_forbidden_from_officer_admin_apis():
    citizen_token = create_access_token(data={"sub": "9876543210", "role": "citizen"})
    res = client.get("/admin/dashboard", headers={"Authorization": f"Bearer {citizen_token}"})
    assert res.status_code == 403
    assert "Forbidden" in res.json()["detail"]

# TEST 4: Haversine 200m Geographic Proximity Formula
def test_haversine_200m_radius():
    # RS Puram Centroid vs point 100 meters away
    lat1, lng1 = 11.0115, 76.9515
    lat2, lng2 = 11.0120, 76.9518 # ~80 meters away
    lat3, lng3 = 11.0250, 76.9700 # ~1800 meters away (outside 200m)

    dist_near = calculate_haversine_distance(lat1, lng1, lat2, lng2)
    dist_far = calculate_haversine_distance(lat1, lng1, lat3, lng3)

    assert dist_near <= 200.0
    assert dist_far > 200.0

# TEST 5: AI Duplicate Cases (200m Radius + Semantic Match)
def test_ai_duplicate_200m_cases():
    nearby_complaints = [
        {
            "id": 1,
            "category": "Street Lights",
            "description": "Street light is not working on main street",
            "lat": 11.0115,
            "lng": 76.9515,
            "street": "RS Puram",
            "vote_count": 3
        }
    ]

    # Case A: Same issue within 200m -> DUPLICATE
    res_dup = detect_semantic_duplicate("Broken street lamp dark at night", 11.0118, 76.9517, nearby_complaints)
    assert res_dup["is_duplicate"] is True

    # Case B: Outside 200m -> NOT DUPLICATE
    res_far = detect_semantic_duplicate("Broken street lamp dark at night", 11.0300, 76.9700, nearby_complaints)
    assert res_far["is_duplicate"] is False
    assert "200m" in res_far["reason"]

    # Case C: Different issue within 200m -> NOT DUPLICATE
    res_diff = detect_semantic_duplicate("Road is flooded with water", 11.0118, 76.9517, nearby_complaints)
    assert res_diff["is_duplicate"] is False

# TEST 6: Mandatory Map Pin Validation (HTTP 400 when coordinates missing)
def test_map_pin_coordinates_required():
    token = create_access_token(data={"sub": "9876543210", "role": "citizen"})
    form_data = {
        "name": "Test User",
        "street": "RS Puram",
        "description": "Test complaint",
        "mobile_number": "9876543210",
        "communication_address": "Door 1, RS Puram",
        "category": "Street Lights",
        "gender": "Male",
        "email": "test@example.com",
        "ward_id": 1,
        "location_lat": 0.0, # Missing pin
        "location_lng": 0.0
    }
    res = client.post("/complaints/create", data=form_data, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 400
    assert "coordinates are required" in res.json()["detail"]

# TEST 7: Mandatory Dispatch & Response Field Validation
def test_mandatory_dispatch_response_fields():
    officer_token = create_access_token(data={"sub": "9876543211", "role": "ward_officer"})
    
    # Reject empty whitespace action_plan
    res = client.post(
        "/admin/complaints/1/respond",
        json={"action_plan": "   "},
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert res.status_code == 400
    assert "action plan is required" in res.json()["detail"]

if __name__ == "__main__":
    pytest.main(["-v", __file__])

# TEST 8: Category to Sector Routing
def test_category_sector_routing():
    from services.ai_service import get_department_for_complaint
    db = SessionLocal()
    try:
        # Check explicit mappings
        assert get_department_for_complaint("Roads & Potholes", "description", db) is not None
        assert get_department_for_complaint("Street Lights", "description", db) is not None
        assert get_department_for_complaint("Water Supply & Leaks", "description", db) is not None
        assert get_department_for_complaint("Drainage & Sewage", "description", db) is not None
        assert get_department_for_complaint("Sanitation & Garbage", "description", db) is not None
        assert get_department_for_complaint("Electricity", "description", db) is not None

        # Check fallback (None)
        assert get_department_for_complaint("Corporation Issues", "description", db) is None
        assert get_department_for_complaint("Revenue Department", "description", db) is None
        assert get_department_for_complaint("Health & Hygiene", "description", db) is None
    finally:
        db.close()

# TEST 9: Officer Isolation
def test_officer_isolation():
    db = SessionLocal()
    try:
        dept_water = db.query(Department).filter(Department.name == "Water Supply").first()
        dept_roads = db.query(Department).filter(Department.name == "Roads & Highways").first()
        
        # Create test officer in Water Supply
        officer = Officer(mobile_number="9999999999", hashed_password="pwd", department_id=dept_water.id, role="department_officer")
        db.add(officer)
        db.commit()
        db.refresh(officer)
        
        token = create_access_token(data={"sub": officer.mobile_number, "role": "department_officer"})
        
        # Mock complaints
        c1 = Complaint(category="Water Supply & Leaks", department_id=dept_water.id, vote_count=1)
        c2 = Complaint(category="Roads & Potholes", department_id=dept_roads.id, vote_count=1)
        db.add(c1)
        db.add(c2)
        db.commit()
        
        # Officer fetches complaints
        res = client.get("/complaints/", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert len(data) > 0
        assert all(c["category"] == "Water Supply & Leaks" for c in data)
        assert not any(c["category"] == "Roads & Potholes" for c in data)
        
    finally:
        # Cleanup
        db.rollback()
        db.query(Complaint).filter(Complaint.category.in_(["Water Supply & Leaks", "Roads & Potholes"])).delete()
        db.query(Officer).filter(Officer.mobile_number == "9999999999").delete()
        db.commit()
        db.close()

# TEST 10: Criticality System
def test_criticality_ranking_system():
    from services.ai_service import analyze_complaint_severity_and_hazard
    
    # Case 2: Electrical safety vs Street light
    e_high = analyze_complaint_severity_and_hazard("Electricity", "Broken electrical pole / exposed electrical wiring in a public area")
    e_low = analyze_complaint_severity_and_hazard("Electricity", "Street light malfunction")
    
    assert e_high["severity_score"] > e_low["severity_score"]

# TEST 11: Officer Registration and Login Flow
def test_officer_registration_and_login():
    db = SessionLocal()
    test_mobile = "9080511576"
    try:
        # Cleanup any existing test officer
        db.query(Officer).filter(Officer.mobile_number == test_mobile).delete()
        db.commit()

        # Register officer
        reg_payload = {
            "mobile_number": test_mobile,
            "password": "password123",
            "name": "Rajesh Officer",
            "department_name": "Roads & Highways",
            "ward_name": "Ward 1 — RS Puram"
        }
        res = client.post("/auth/register-officer", json=reg_payload)
        assert res.status_code == 200
        token_data = res.json()
        assert token_data["role"] == "ward_officer"
        assert token_data["mobile_number"] == test_mobile
        assert "access_token" in token_data

        # Login officer
        login_res = client.post("/auth/login", json={
            "mobile_number": test_mobile,
            "password": "password123",
            "role": "ward_officer"
        })
        assert login_res.status_code == 200
        login_data = login_res.json()
        assert login_data["role"] == "ward_officer"
        assert "access_token" in login_data
    finally:
        db.query(Officer).filter(Officer.mobile_number == test_mobile).delete()
        db.commit()
        db.close()


