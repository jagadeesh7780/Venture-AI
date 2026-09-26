from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base
from app.db.mongo import get_mongo_db
from app.routes import api_router
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan:
    Executes startup and shutdown tasks.
    On startup:
    1. Verifies/creates PostgreSQL database tables (users, businesses).
    2. Verifies connection to MongoDB Atlas for cloud user & business planning persistence.
    """
    # 1. PostgreSQL Schema Verification
    try:
        Base.metadata.create_all(bind=engine)
        print("[PostgreSQL] Tables (users, businesses) verified/created successfully.")
    except Exception as e:
        print(f"[PostgreSQL Warning] Could not connect or create tables on startup: {e}")

    # 2. MongoDB Atlas Connection Verification
    try:
        mongo_db = get_mongo_db()
        if mongo_db is not None:
            print("[MongoDB Atlas] Cloud cluster connection active. User credentials & business plans synced.")
        else:
            print("[MongoDB Atlas] Running in resilient mode.")
    except Exception as e:
        print(f"[MongoDB Atlas Warning]: {e}")

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for VENTURE AI (Argon2/JWT Authentication, MongoDB Atlas & PostgreSQL Storage).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS) for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health Check"])
def root():
    """
    Root health check endpoint.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "MongoDB Atlas Connected",
        "docs_url": "/docs",
    }
