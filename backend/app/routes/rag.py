from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, status, Depends
from pydantic import BaseModel
from app.rag.vectorstore import get_vector_store
from app.rag.retrieval import get_rag_retrieval_service
from app.routes.auth import get_current_active_user
from app.models.user import User

router = APIRouter(
    prefix="/rag",
    tags=["RAG & Knowledge Retrieval"],
)


class RAGQueryRequest(BaseModel):
    query: str
    category: Optional[str] = None
    top_k: int = 3


@router.get(
    "/search",
    summary="Semantic search against business knowledge base",
)
def search_knowledge_base(
    query: str = Query(..., description="Semantic search query"),
    category: Optional[str] = Query(None, description="Optional category filter"),
    top_k: int = Query(4, ge=1, le=10),
    current_user: User = Depends(get_current_active_user),
) -> Dict[str, Any]:
    """
    GET /api/rag/search
    Performs semantic vector search across business, MSME, GST, and industry documents.
    """
    rag_service = get_rag_retrieval_service()
    results = rag_service.retrieve_context(query=query, category=category, top_k=top_k)
    return {
        "query": query,
        "results_count": len(results),
        "results": results,
    }


@router.post(
    "/query",
    summary="Retrieve assembled context for LLM grounding",
)
def query_context(
    request: RAGQueryRequest,
    current_user: User = Depends(get_current_active_user),
) -> Dict[str, Any]:
    """
    POST /api/rag/query
    Retrieves and formats prompt context with verified source citations.
    """
    rag_service = get_rag_retrieval_service()
    results = rag_service.retrieve_context(
        query=request.query,
        category=request.category,
        top_k=request.top_k,
    )
    assembled = rag_service.assemble_prompt_context(
        query=request.query,
        category=request.category,
        top_k=request.top_k,
    )
    return {
        "query": request.query,
        "assembled_context": assembled,
        "source_chunks": results,
    }


@router.get(
    "/documents",
    summary="List all indexed knowledge base documents",
)
def list_documents(
    current_user: User = Depends(get_current_active_user),
) -> Dict[str, Any]:
    """
    GET /api/rag/documents
    Returns catalog of verified regulatory and benchmark documents.
    """
    vector_store = get_vector_store()
    docs = vector_store.get_all_documents()
    return {
        "total_documents": len(docs),
        "documents": docs,
    }
