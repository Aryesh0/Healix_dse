import random
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from pydantic import BaseModel
from database import get_db
from auth.jwt import decode_token

router = APIRouter(prefix="/api/queue", tags=["Queue"])


class EnqueueRequest(BaseModel):
    name: str
    reason: str
    dob: Optional[str] = ""
    bloodGroup: Optional[str] = ""
    isEmergency: Optional[bool] = False


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("")
async def get_queue(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    # Items stored in order; sorted by isEmergency desc then position
    queue = await db["queue"].find({}, {"_id": 0}).sort("position", 1).to_list(length=200)
    return {"success": True, "data": queue}


@router.post("/enqueue")
async def enqueue_patient(
    req: EnqueueRequest,
    authorization: Optional[str] = Header(None),
):
    _require_auth(authorization)
    db = get_db()

    patient_id = random.randint(200, 9999)
    count = await db["queue"].count_documents({})

    # If emergency, position is 0 (front), else append at end
    position = 0 if req.isEmergency else count

    # If emergency, shift all others back by 1
    if req.isEmergency:
        await db["queue"].update_many({}, {"$inc": {"position": 1}})

    doc = {
        "id": patient_id,
        "name": req.name,
        "reason": req.reason,
        "dob": req.dob,
        "bloodGroup": req.bloodGroup,
        "isEmergency": req.isEmergency,
        "position": position,
    }
    await db["queue"].insert_one(doc)

    # Also add to patients collection
    patient_doc = {"id": patient_id, "name": req.name, "reason": req.reason, "dob": req.dob, "bloodGroup": req.bloodGroup}
    await db["patients"].insert_one(patient_doc)

    return {"success": True, "data": doc}


@router.post("/emergency")
async def emergency_enqueue(
    req: EnqueueRequest,
    authorization: Optional[str] = Header(None),
):
    req.isEmergency = True
    return await enqueue_patient(req, authorization)


@router.patch("/{patient_id}/prioritize")
async def prioritize_patient(
    patient_id: int,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") not in ("ADMIN", "DOCTOR", "RECEPTIONIST"):
        raise HTTPException(status_code=403, detail="Forbidden")

    db = get_db()
    patient = await db["queue"].find_one({"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not in queue")

    old_pos = patient["position"]
    # Shift everyone in front of old position forward
    await db["queue"].update_many({"position": {"$lt": old_pos}}, {"$inc": {"position": 1}})
    await db["queue"].update_one({"id": patient_id}, {"$set": {"position": 0, "isEmergency": True}})

    return {"success": True, "message": f"Patient {patient_id} moved to front"}


@router.delete("/dequeue")
async def dequeue_patient(authorization: Optional[str] = Header(None)):
    payload = _require_auth(authorization)
    if payload.get("role") not in ("ADMIN", "DOCTOR"):
        raise HTTPException(status_code=403, detail="Only doctors/admins can dequeue")

    db = get_db()
    # Get patient at position 0
    patient = await db["queue"].find_one({"position": 0}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Queue is empty")

    await db["queue"].delete_one({"id": patient["id"]})
    # Shift remaining positions
    await db["queue"].update_many({}, {"$inc": {"position": -1}})

    # Take a bed (decrement available)
    beds = await db["beds"].find_one({"type": "ward"})
    if beds and beds.get("available", 0) <= 0:
        raise HTTPException(status_code=409, detail="No beds available")
    await db["beds"].update_one({"type": "ward"}, {"$inc": {"available": -1}})

    return {"success": True, "data": patient}
