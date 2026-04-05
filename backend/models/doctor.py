from typing import List, Optional
from pydantic import BaseModel


class DoctorCreate(BaseModel):
    name: str
    specialty: str
    phone: Optional[str] = ""
    email: Optional[str] = ""
    days: Optional[List[str]] = ["Monday", "Wednesday", "Friday"]
    hours: Optional[str] = "09:00 - 17:00"


class Doctor(DoctorCreate):
    id: str
