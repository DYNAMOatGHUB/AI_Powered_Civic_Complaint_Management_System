from pydantic import BaseModel, field_validator
from typing import Optional
import re

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    mobile_number: str
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    department_name: Optional[str] = None
    department_id: Optional[int] = None
    ward_name: Optional[str] = None

class UserRegister(BaseModel):
    mobile_number: str
    password: str
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None

    @field_validator('mobile_number')
    @classmethod
    def validate_mobile_number(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r'^\d{10}$', v):
            raise ValueError('Mobile number must be exactly 10 numeric digits.')
        return v

class OfficerRegister(BaseModel):
    mobile_number: str
    password: str
    name: str
    department_name: Optional[str] = None
    ward_name: Optional[str] = None
    email: Optional[str] = None
    role: str = "ward_officer"

    @field_validator('mobile_number')
    @classmethod
    def validate_mobile_number(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r'^\d{10}$', v):
            raise ValueError('Mobile number must be exactly 10 numeric digits.')
        return v

class LoginRequest(BaseModel):
    mobile_number: str
    password: str
    role: str = "citizen"

    @field_validator('mobile_number')
    @classmethod
    def validate_mobile_number(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r'^\d{10}$', v):
            raise ValueError('Mobile number must be exactly 10 numeric digits.')
        return v
