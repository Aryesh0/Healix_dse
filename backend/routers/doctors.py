import random
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token
from models.doctor import DoctorCreate

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("")
async def get_doctors(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    doctors = await db["doctors"].find({}, {"_id": 0}).to_list(length=200)
    return {"success": True, "data": doctors}


@router.post("")
async def add_doctor(
    doctor: DoctorCreate,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can add doctors")

    db = get_db()
    doc = {
        "id": f"D{random.randint(100, 9999)}",
        "name": doctor.name,
        "specialty": doctor.specialty,
        "phone": doctor.phone,
        "email": doctor.email,
        "days": doctor.days,
        "hours": doctor.hours,
    }
    await db["doctors"].insert_one(doc)
    return {"success": True, "data": doc}


@router.put("/{doctor_name}/availability")
async def update_availability(
    doctor_name: str,
    days: list,
    hours: str,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") not in ("ADMIN", "DOCTOR"):
        raise HTTPException(status_code=403, detail="Forbidden")

    db = get_db()
    result = await db["doctors"].update_one(
        {"name": doctor_name}, {"$set": {"days": days, "hours": hours}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"success": True, "message": "Availability updated"}
