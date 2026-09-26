from typing import List, Dict, Any, Optional
from app.rag.vectorstore import get_vector_store, BusinessVectorStore


class RAGRetrievalService:
    """
    RAG Retrieval Pipeline.
    Extracts relevant regulatory and industry context chunks and
    formats them into structured reference context for LLM agents and UI exploration.
    """
    def __init__(self, vector_store: Optional[BusinessVectorStore] = None):
        self.vector_store = vector_store or get_vector_store()

    def retrieve_context(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 3,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top relevant knowledge chunks for a query.
        """
        return self.vector_store.search(
            query=query,
            top_k=top_k,
            category=category,
        )

    def assemble_prompt_context(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 3,
    ) -> str:
        """
        Formats retrieved knowledge into clean markdown context block for LLM prompts.
        """
        results = self.retrieve_context(query=query, category=category, top_k=top_k)
        if not results:
            return "No specific regulatory or industry document retrieved for this topic."

        context_lines = ["--- VERIFIED KNOWLEDGE BASE CONTEXT (RAG) ---"]
        for idx, item in enumerate(results, 1):
            context_lines.append(
                f"[{idx}] Title: {item['title']} (Category: {item['category']} | Source: {item['source']})\n"
                f"Excerpt: {item['text']}\n"
            )
        context_lines.append("--- END KNOWLEDGE CONTEXT ---")
        return "\n".join(context_lines)


_rag_retrieval_instance: Optional[RAGRetrievalService] = None


def get_rag_retrieval_service() -> RAGRetrievalService:
    global _rag_retrieval_instance
    if _rag_retrieval_instance is None:
        _rag_retrieval_instance = RAGRetrievalService()
    return _rag_retrieval_instance
