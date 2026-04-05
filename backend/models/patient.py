from typing import Optional
from pydantic import BaseModel


class PatientCreate(BaseModel):
    name: str
    reason: str
    dob: Optional[str] = ""
    bloodGroup: Optional[str] = ""
    isEmergency: Optional[bool] = False


class Patient(PatientCreate):
    id: int
