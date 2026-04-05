from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import connect_db, close_db, get_db
from auth.password import hash_password
from routers import auth, patients, appointments, doctors, queue, inventory, wards, beds


# ──────────────────────────────────────────────
# Startup / Shutdown lifecycle
# ──────────────────────────────────────────────
async def seed_database():
    """Seed initial demo data into MongoDB if collections are empty."""
    db = get_db()

    # ── Seed demo users ──────────────────────────────────────────────────
    users_col = db["users"]
    if await users_col.count_documents({}) == 0:
        demo_users = [
            {
                "username": "superadmin",
                "email": "admin@healix.com",
                "fullName": "Super Admin",
                "phone": "9000000001",
                "role": "ADMIN",
                "password": hash_password("Admin@1234"),
                "linkedId": "ADM-0001",
                "specialization": "",
                "dateOfBirth": "",
                "gender": "MALE",
                "bloodGroup": "O+",
                "address": "Healix HQ",
            },
            {
                "username": "doctor_demo",
                "email": "doctor@healix.com",
                "fullName": "Dr. Aryesh",
                "phone": "9000000002",
                "role": "DOCTOR",
                "password": hash_password("Doctor@123"),
                "linkedId": "DOC-1001",
                "specialization": "Neurologist",
                "dateOfBirth": "1985-06-15",
                "gender": "MALE",
                "bloodGroup": "A+",
                "address": "Healix Medical Tower",
            },
            {
                "username": "receptionist_demo",
                "email": "reception@healix.com",
                "fullName": "Priya Sharma",
                "phone": "9000000003",
                "role": "RECEPTIONIST",
                "password": hash_password("Recep@123"),
                "linkedId": "RCP-2001",
                "specialization": "",
                "dateOfBirth": "",
                "gender": "FEMALE",
                "bloodGroup": "B+",
                "address": "Healix Front Desk",
            },
            {
                "username": "patient_demo",
                "email": "patient@healix.com",
                "fullName": "Alice Walker",
                "phone": "9000000004",
                "role": "PATIENT",
                "password": hash_password("Patient@123"),
                "linkedId": "PAT-3001",
                "specialization": "",
                "dateOfBirth": "1990-05-12",
                "gender": "FEMALE",
                "bloodGroup": "O+",
                "address": "12 Main Street, Mumbai",
            },
        ]
        await users_col.insert_many(demo_users)
        print("✅ Seeded demo users")

    # ── Seed doctors ─────────────────────────────────────────────────────
    doctors_col = db["doctors"]
    if await doctors_col.count_documents({}) == 0:
        demo_doctors = [
            {
                "id": "D1",
                "name": "Dr. Aryesh",
                "specialty": "Neurologist",
                "phone": "9000000002",
                "email": "doctor@healix.com",
                "days": ["Monday", "Wednesday", "Friday"],
                "hours": "09:00 - 15:00",
            },
            {
                "id": "D2",
                "name": "Dr. Smith",
                "specialty": "Cardiologist",
                "phone": "9000000010",
                "email": "smith@healix.com",
                "days": ["Tuesday", "Thursday"],
                "hours": "10:00 - 16:00",
            },
            {
                "id": "D3",
                "name": "Dr. Meera Nair",
                "specialty": "Pediatrician",
                "phone": "9000000011",
                "email": "meera@healix.com",
                "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "hours": "08:00 - 14:00",
            },
            {
                "id": "D4",
                "name": "Dr. Rajesh Kumar",
                "specialty": "Orthopedic",
                "phone": "9000000012",
                "email": "rajesh@healix.com",
                "days": ["Wednesday", "Friday"],
                "hours": "12:00 - 18:00",
            },
        ]
        await doctors_col.insert_many(demo_doctors)
        print("✅ Seeded demo doctors")

    # ── Seed patients ─────────────────────────────────────────────────────
    patients_col = db["patients"]
    if await patients_col.count_documents({}) == 0:
        demo_patients = [
            {"id": 101, "name": "Alice Walker", "reason": "Headache", "dob": "1990-05-12", "bloodGroup": "O+"},
            {"id": 85,  "name": "Bob Smith",    "reason": "Chest pain", "dob": "1985-11-20", "bloodGroup": "A+"},
            {"id": 120, "name": "Charlie Davis","reason": "Fever", "dob": "2000-01-30", "bloodGroup": "B+"},
            {"id": 55,  "name": "Deepa Pillai", "reason": "Back pain", "dob": "1978-03-22", "bloodGroup": "AB+"},
            {"id": 200, "name": "Riya Sen",      "reason": "Skin rash", "dob": "1995-07-14", "bloodGroup": "O-"},
        ]
        await patients_col.insert_many(demo_patients)
        print("✅ Seeded demo patients")

    # ── Seed appointments ─────────────────────────────────────────────────
    apts_col = db["appointments"]
    if await apts_col.count_documents({}) == 0:
        demo_apts = [
            {"id": "APT-1001", "patientName": "Alice Walker", "doctor": "Dr. Aryesh",      "date": "2026-04-10", "time": "10:00", "status": "Scheduled",  "type": "Consultation"},
            {"id": "APT-1002", "patientName": "Bob Smith",    "doctor": "Dr. Smith",       "date": "2026-04-12", "time": "14:30", "status": "Scheduled",  "type": "Follow-up"},
            {"id": "APT-1003", "patientName": "Charlie Davis","doctor": "Dr. Meera Nair",  "date": "2026-04-08", "time": "09:00", "status": "Completed",  "type": "Consultation"},
            {"id": "APT-1004", "patientName": "Deepa Pillai", "doctor": "Dr. Rajesh Kumar","date": "2026-04-15", "time": "12:00", "status": "Scheduled",  "type": "Follow-up"},
        ]
        await apts_col.insert_many(demo_apts)
        print("✅ Seeded demo appointments")

    # ── Seed beds ─────────────────────────────────────────────────────────
    beds_col = db["beds"]
    if await beds_col.count_documents({}) == 0:
        await beds_col.insert_one({"type": "ward", "total": 25, "available": 25})
        print("✅ Seeded bed inventory")

    # ── Seed wards ────────────────────────────────────────────────────────
    wards_col = db["wards"]
    if await wards_col.count_documents({}) == 0:
        demo_wards = [
            {"name": "General Ward A", "totalBeds": 20, "occupied": 18, "color": "blue"},
            {"name": "General Ward B", "totalBeds": 20, "occupied": 12, "color": "blue"},
            {"name": "ICU", "totalBeds": 10, "occupied": 9, "color": "red"},
            {"name": "Maternity", "totalBeds": 15, "occupied": 15, "color": "pink"},
            {"name": "Pediatrics", "totalBeds": 15, "occupied": 5, "color": "orange"},
        ]
        await wards_col.insert_many(demo_wards)
        print("✅ Seeded wards")

    # ── Seed inventory ────────────────────────────────────────────────────
    inv_col = db["inventory"]
    if await inv_col.count_documents({}) == 0:
        demo_inventory = [
            {"id": "MED-01", "name": "Amoxicillin 500mg", "category": "Antibiotic", "stock": 1200, "unit": "Tablets", "lowStockThreshold": 50, "status": "In Stock"},
            {"id": "MED-02", "name": "Ibuprofen 400mg", "category": "Painkiller", "stock": 45, "unit": "Tablets", "lowStockThreshold": 50, "status": "Low Stock"},
            {"id": "MED-03", "name": "Saline Solution 500ml", "category": "IV Fluid", "stock": 0, "unit": "Bottles", "lowStockThreshold": 50, "status": "Out of Stock"},
            {"id": "MED-04", "name": "Omeprazole 20mg", "category": "Antacid", "stock": 350, "unit": "Capsules", "lowStockThreshold": 50, "status": "In Stock"},
        ]
        await inv_col.insert_many(demo_inventory)
        print("✅ Seeded pharmacy inventory")

    print("🏥 Healix database ready.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await seed_database()
    yield
    await close_db()


# ──────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────
app = FastAPI(
    title="Healix Hospital Management API",
    description="Python/FastAPI backend for the Healix Hospital Management System",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS — allow React dev server (Vite default port 5173) and production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ──────────────────────────
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(doctors.router)
app.include_router(queue.router)
app.include_router(inventory.router)
app.include_router(wards.router)
app.include_router(beds.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app": "Healix Hospital Management API",
        "version": "2.0.0 (Python/FastAPI)",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
