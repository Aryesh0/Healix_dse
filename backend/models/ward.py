from pydantic import BaseModel, Field


class WardCreate(BaseModel):
    name: str
    totalBeds: int = Field(ge=0)
    occupied: int = Field(ge=0)
    color: str = "blue"


class Ward(WardCreate):
    pass
