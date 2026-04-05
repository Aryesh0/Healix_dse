from typing import Optional
from pydantic import BaseModel, Field


class InventoryItemCreate(BaseModel):
    name: str
    category: str
    unit: str
    stock: int = Field(ge=0)
    lowStockThreshold: Optional[int] = Field(default=50, ge=0)


class InventoryItem(InventoryItemCreate):
    id: str
    status: str
