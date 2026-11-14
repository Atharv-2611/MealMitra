from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.profile import router as profile_router
from app.routes.donations import router as donations_router

app = FastAPI(
    title="MealMitra API",
    description="Food Donation and Operational Relief Platform",
    version="1.0.0"
)

# Configure CORS for local development and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(profile_router, prefix="/api/profile", tags=["Restaurant Profile"])
app.include_router(donations_router, prefix="/api/donations", tags=["Donations"])


@app.get("/")
def home():
    return {
        "message": "Welcome to MealMitra API",
        "status": "Running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
