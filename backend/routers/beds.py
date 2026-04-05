from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token

router = APIRouter(prefix="/api/beds", tags=["Beds"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("/summary")
async def get_beds_summary(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    beds = await db["beds"].find_one({"type": "ward"}, {"_id": 0})
    if not beds:
        beds = {"type": "ward", "total": 0, "available": 0}
    total = int(beds.get("total", 0))
    available = int(beds.get("available", 0))
    occupied = max(0, total - available)
    return {"success": True, "data": {"total": total, "available": available, "occupied": occupied}}


@router.patch("/adjust")
async def adjust_beds(
    delta: int,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") not in ("ADMIN", "RECEPTIONIST", "DOCTOR"):
        raise HTTPException(status_code=403, detail="Forbidden")

    db = get_db()
    beds = await db["beds"].find_one({"type": "ward"})
    if not beds:
        raise HTTPException(status_code=404, detail="Beds inventory not found")

    total = int(beds.get("total", 0))
    available = int(beds.get("available", 0)) + int(delta)
    if available < 0 or available > total:
        raise HTTPException(status_code=400, detail="Invalid bed adjustment")

    await db["beds"].update_one({"type": "ward"}, {"$set": {"available": available}})
    return {"success": True, "data": {"total": total, "available": available, "occupied": total - available}}
