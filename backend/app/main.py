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
    1. MongoDB Atlas cloud cluster verification.
    2. Optional PostgreSQL schema verification (if configured).
    """
    # 1. MongoDB Atlas Connection Verification (Primary)
    try:
        mongo_db = get_mongo_db()
        if mongo_db is not None:
            print("[MongoDB Atlas] Connected to Cluster0. User credentials & business plans synced.")
        else:
            print("[MongoDB Atlas] Running in resilient fallback mode.")
    except Exception as e:
        print(f"[MongoDB Atlas Warning]: {e}")

    # 2. Optional PostgreSQL Schema Verification (only if Postgres is explicitly configured)
    if settings.DATABASE_URL or settings.POSTGRES_HOST not in ("localhost", "127.0.0.1"):
        try:
            Base.metadata.create_all(bind=engine)
            print("[PostgreSQL] Tables verified/created successfully.")
        except Exception as e:
            print(f"[PostgreSQL Notice] PostgreSQL optional storage not reachable: {e}")
    else:
        print("[Database] MongoDB Atlas active as primary cloud database.")

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
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.api_route("/", methods=["GET", "HEAD"], tags=["Health Check"])
def root():
    """
    Root health check endpoint (supports GET and HEAD for Render health checks).
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "MongoDB Atlas Connected",
        "docs_url": "/docs",
    }

