import random
from fastapi import APIRouter, HTTPException
from database import get_db
from models.user import UserCreate, UserLogin, TokenResponse
from auth.password import hash_password, verify_password
from auth.jwt import create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
async def register(user: UserCreate):
    db = get_db()
    users_col = db["users"]

    # Check for duplicate username
    if await users_col.find_one({"username": user.username}):
        raise HTTPException(status_code=409, detail="Username already exists")

    # Check for duplicate email
    if await users_col.find_one({"email": user.email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    linked_id = f"{user.role[:3]}-{random.randint(1000, 9999)}"

    doc = {
        "username": user.username,
        "email": user.email,
        "fullName": user.fullName,
        "phone": user.phone,
        "role": user.role,
        "password": hash_password(user.password),
        "specialization": user.specialization,
        "dateOfBirth": user.dateOfBirth,
        "gender": user.gender,
        "bloodGroup": user.bloodGroup,
        "address": user.address,
        "linkedId": linked_id,
    }
    await users_col.insert_one(doc)

    # If Doctor, add to doctors collection
    if user.role == "DOCTOR" and user.specialization:
        doctors_col = db["doctors"]
        doc_name = f"Dr. {user.fullName or user.username}"
        if not await doctors_col.find_one({"name": doc_name}):
            await doctors_col.insert_one({
                "id": f"D{random.randint(100, 9999)}",
                "name": doc_name,
                "specialty": user.specialization,
                "phone": user.phone,
                "email": user.email,
                "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "hours": "09:00 - 17:00",
            })

    token = create_access_token({
        "sub": user.username,
        "role": user.role,
        "linkedId": linked_id,
    })

    return TokenResponse(
        success=True,
        data={
            "token": token,
            "username": user.username,
            "role": user.role,
            "linkedId": linked_id,
        },
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_db()
    users_col = db["users"]

    user = await users_col.find_one({"username": credentials.username})
    if not user or "password" not in user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({
        "sub": user["username"],
        "role": user["role"],
        "linkedId": user.get("linkedId", ""),
    })

    return TokenResponse(
        success=True,
        data={
            "token": token,
            "username": user["username"],
            "role": user["role"],
            "linkedId": user.get("linkedId", ""),
        },
    )
