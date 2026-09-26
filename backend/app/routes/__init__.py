from fastapi import APIRouter
from app.routes.auth import router as auth_router
from app.routes.businesses import router as businesses_router
from app.routes.analysis import router as analysis_router
from app.routes.rag import router as rag_router
from app.routes.pipeline import router as pipeline_router
from app.routes.dataset import router as dataset_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(businesses_router)
api_router.include_router(analysis_router)
api_router.include_router(rag_router)
api_router.include_router(pipeline_router)
api_router.include_router(dataset_router)

__all__ = ["api_router"]

