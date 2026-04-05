import random
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token
from models.patient import PatientCreate

router = APIRouter(prefix="/api/patients", tags=["Patients"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("")
async def get_patients(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    patients = await db["patients"].find({}, {"_id": 0}).to_list(length=500)
    return {"success": True, "data": patients}


@router.post("")
async def add_patient(
    patient: PatientCreate,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    role = payload.get("role", "")
    if role not in ("ADMIN", "RECEPTIONIST", "DOCTOR"):
        raise HTTPException(status_code=403, detail="Forbidden")

    db = get_db()
    patient_id = random.randint(200, 9999)
    doc = {
        "id": patient_id,
        "name": patient.name,
        "reason": patient.reason,
        "dob": patient.dob,
        "bloodGroup": patient.bloodGroup,
        "isEmergency": patient.isEmergency,
    }
    await db["patients"].insert_one(doc)
    return {"success": True, "data": doc}
