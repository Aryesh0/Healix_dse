import random
import string
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from database import get_db
from auth.jwt import decode_token
from models.inventory import InventoryItemCreate

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


def _require_auth(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


def _status_from_stock(stock: int, low_threshold: int) -> str:
    if stock <= 0:
        return "Out of Stock"
    if stock <= low_threshold:
        return "Low Stock"
    return "In Stock"


@router.get("")
async def get_inventory(authorization: Optional[str] = Header(None)):
    _require_auth(authorization)
    db = get_db()
    items = await db["inventory"].find({}, {"_id": 0}).to_list(length=500)
    return {"success": True, "data": items}


@router.post("")
async def add_item(
    item: InventoryItemCreate,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can add inventory")

    db = get_db()
    item_id = "MED-" + "".join(random.choices(string.digits, k=2))
    doc = {
        "id": item_id,
        "name": item.name,
        "category": item.category,
        "unit": item.unit,
        "stock": item.stock,
        "lowStockThreshold": item.lowStockThreshold or 50,
    }
    doc["status"] = _status_from_stock(doc["stock"], doc["lowStockThreshold"])
    await db["inventory"].insert_one(doc)
    return {"success": True, "data": doc}


@router.patch("/{item_id}/stock")
async def update_stock(
    item_id: str,
    delta: int,
    authorization: Optional[str] = Header(None),
):
    payload = _require_auth(authorization)
    if payload.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can update stock")

    db = get_db()
    item = await db["inventory"].find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    new_stock = max(0, int(item.get("stock", 0)) + int(delta))
    low_threshold = int(item.get("lowStockThreshold", 50))
    status = _status_from_stock(new_stock, low_threshold)

    await db["inventory"].update_one(
        {"id": item_id},
        {"$set": {"stock": new_stock, "status": status}},
    )
    item.update({"stock": new_stock, "status": status})
    item.pop("_id", None)
    return {"success": True, "data": item}
