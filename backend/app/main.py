from contextlib import asynccontextmanager
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base
from app.routes import api_router
# Import models to ensure they are registered with Base.metadata for table creation
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan:
    Executes startup and shutdown tasks.
    On startup: automatically creates PostgreSQL tables (users, businesses) if they do not exist.
    """
    try:
        # Create all tables in PostgreSQL
        Base.metadata.create_all(bind=engine)
        print("[Database] Database tables (users, businesses) verified/created successfully.")
    except Exception as e:
        print(f"[Database Warning] Could not connect or create tables on startup: {e}")
        print("[Database Warning] Ensure database is running and credentials in .env are correct.")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI Business Digital Twin (Step 1: Argon2/JWT Authentication, PostgreSQL Storage, and App Shell).",
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

# Mount API Routers (e.g. /api/auth/register, /api/auth/login, /api/auth/me, /api/businesses)
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health Check"])
def root():
    """
    Root health check endpoint.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "phase": "Step 1: Authentication & 3D App Shell",
        "docs_url": "/docs",
    }
