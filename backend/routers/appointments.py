import random
import string
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token
from models.appointment import AppointmentCreate

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("")
async def get_appointments(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    appointments = await db["appointments"].find({}, {"_id": 0}).to_list(length=500)
    return {"success": True, "data": appointments}


@router.post("")
async def create_appointment(
    apt: AppointmentCreate,
    authorization: Optional[str] = Header(None),
):
    _require_auth(authorization)
    db = get_db()
    apt_id = "APT-" + "".join(random.choices(string.digits, k=4))
    doc = {
        "id": apt_id,
        "patientName": apt.patientName,
        "doctor": apt.doctor,
        "date": apt.date,
        "time": apt.time,
        "type": apt.type,
        "status": apt.status,
    }
    await db["appointments"].insert_one(doc)
    return {"success": True, "data": doc}


@router.patch("/{apt_id}/cancel")
async def cancel_appointment(
    apt_id: str,
    authorization: Optional[str] = Header(None),
):
    _require_auth(authorization)
    db = get_db()
    result = await db["appointments"].update_one(
        {"id": apt_id}, {"$set": {"status": "Cancelled"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"success": True, "message": "Appointment cancelled"}
