from typing import Optional
from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    patientName: str
    doctor: str
    date: str
    time: str
    type: Optional[str] = "Consultation"
    status: Optional[str] = "Scheduled"


class Appointment(AppointmentCreate):
    id: str
