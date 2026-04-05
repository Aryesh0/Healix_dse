from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token
from models.ward import WardCreate

router = APIRouter(prefix="/api/wards", tags=["Wards"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("")
async def get_wards(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    wards = await db["wards"].find({}, {"_id": 0}).to_list(length=200)
    return {"success": True, "data": wards}


@router.post("")
async def add_ward(
    ward: WardCreate,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can add wards")

    if ward.occupied > ward.totalBeds:
        raise HTTPException(status_code=400, detail="Occupied beds cannot exceed total beds")

    db = get_db()
    if await db["wards"].find_one({"name": ward.name}):
        raise HTTPException(status_code=409, detail="Ward already exists")

    doc = ward.model_dump()
    await db["wards"].insert_one(doc)
    return {"success": True, "data": doc}


@router.patch("/{ward_name}/occupancy")
async def update_occupancy(
    ward_name: str,
    delta: int,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") not in ("ADMIN", "RECEPTIONIST", "DOCTOR"):
        raise HTTPException(status_code=403, detail="Forbidden")

    db = get_db()
    ward = await db["wards"].find_one({"name": ward_name})
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    total_beds = int(ward.get("totalBeds", 0))
    new_occupied = int(ward.get("occupied", 0)) + int(delta)
    if new_occupied < 0 or new_occupied > total_beds:
        raise HTTPException(status_code=400, detail="Invalid occupancy change")

    await db["wards"].update_one(
        {"name": ward_name}, {"$set": {"occupied": new_occupied}}
    )
    ward.update({"occupied": new_occupied})
    ward.pop("_id", None)
    return {"success": True, "data": ward}
