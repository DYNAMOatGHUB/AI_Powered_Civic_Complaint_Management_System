from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Officer, Department
from schemas import UserRegister, OfficerRegister, LoginRequest, Token
from api.deps import create_access_token, get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_mobile = db.query(User).filter(User.mobile_number == user_data.mobile_number).first()
    if existing_mobile:
        raise HTTPException(status_code=400, detail="Mobile number is already registered")
        
    if user_data.username:
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username is already taken")

    hashed_pwd = get_password_hash(user_data.password)
    user = User(
        mobile_number=user_data.mobile_number,
        username=user_data.username,
        hashed_password=hashed_pwd,
        name=user_data.name,
        email=user_data.email
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        data={"sub": user.mobile_number, "role": "citizen"}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "citizen",
        "mobile_number": user.mobile_number,
        "username": user.username,
        "name": user.name,
        "email": user.email
    }

@router.post("/register-officer", response_model=Token)
def register_officer(officer_data: OfficerRegister, db: Session = Depends(get_db)):
    existing = db.query(Officer).filter(Officer.mobile_number == officer_data.mobile_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Officer with this mobile number is already registered")

    dept = None
    if officer_data.department_name:
        clean_dept = officer_data.department_name.strip()
        dept = db.query(Department).filter(Department.name.ilike(clean_dept)).first()
        if not dept:
            dept = db.query(Department).filter(Department.name.ilike(f"%{clean_dept}%")).first()
        if not dept:
            dept = Department(name=clean_dept.title())
            db.add(dept)
            db.commit()
            db.refresh(dept)

    hashed_pwd = get_password_hash(officer_data.password)
    officer = Officer(
        mobile_number=officer_data.mobile_number,
        name=officer_data.name,
        username=officer_data.name,
        email=officer_data.email or f"{officer_data.mobile_number}@coimbatorecorp.gov.in",
        role=officer_data.role or "ward_officer",
        department_id=dept.id if dept else None,
        hashed_password=hashed_pwd
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)

    access_token = create_access_token(
        data={"sub": officer.mobile_number, "role": officer.role}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": officer.role,
        "mobile_number": officer.mobile_number,
        "username": officer.name,
        "name": officer.name,
        "email": officer.email,
        "department_name": dept.name if dept else None,
        "department_id": dept.id if dept else None,
        "ward_name": officer_data.ward_name or "Ward 1 — RS Puram"
    }

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    if login_data.role == "citizen":
        user = db.query(User).filter(User.mobile_number == login_data.mobile_number).first()
    else:
        user = db.query(Officer).filter(Officer.mobile_number == login_data.mobile_number).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect mobile number or password")

    role = login_data.role if login_data.role == "citizen" else user.role
    access_token = create_access_token(
        data={"sub": user.mobile_number, "role": role}
    )

    dept_name = None
    if hasattr(user, 'department_id') and user.department_id:
        dept = db.query(Department).filter(Department.id == user.department_id).first()
        if dept:
            dept_name = dept.name

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "mobile_number": user.mobile_number,
        "username": user.username or getattr(user, 'name', None),
        "name": getattr(user, 'name', None) or user.username,
        "email": getattr(user, 'email', None),
        "department_name": dept_name,
        "department_id": getattr(user, 'department_id', None)
    }
