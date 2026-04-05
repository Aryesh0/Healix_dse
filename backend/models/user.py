from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    fullName: str
    phone: Optional[str] = ""
    role: str  # PATIENT | DOCTOR | RECEPTIONIST | ADMIN
    # Doctor-specific
    specialization: Optional[str] = ""
    # Patient-specific
    dateOfBirth: Optional[str] = ""
    gender: Optional[str] = "MALE"
    bloodGroup: Optional[str] = "O+"
    address: Optional[str] = ""


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    success: bool
    data: dict
