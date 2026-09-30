from database import SessionLocal
from models import User, Officer

db = SessionLocal()
u = User(mobile_number="9876543210", hashed_password="pwd", full_name="Test")
db.add(u)
o = Officer(mobile_number="9876543211", hashed_password="pwd", role="ward_officer", department_id=1)
db.add(o)
try:
    db.commit()
except Exception as e:
    pass # Probably already exists
