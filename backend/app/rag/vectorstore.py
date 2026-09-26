from typing import List, Dict, Any, Optional
from app.rag.knowledge_docs import KNOWLEDGE_DOCUMENTS
from app.rag.chunking import chunk_all_documents
from app.rag.embeddings import get_embedding_service, DenseSemanticEmbeddingService


class BusinessVectorStore:
    """
    Vector Store for Business Knowledge Base.
    Indexes chunked regulatory and industry knowledge documents,
    computes dense semantic embeddings, and performs top-K semantic search.
    """
    def __init__(self, embedding_service: Optional[DenseSemanticEmbeddingService] = None):
        self.embedding_service = embedding_service or get_embedding_service()
        self.chunks: List[Dict[str, Any]] = []
        self.embeddings: List[List[float]] = []
        self._initialize_default_knowledge()

    def _initialize_default_knowledge(self):
        """
        Loads and indexes the pre-populated authoritative business documents.
        """
        self.chunks = chunk_all_documents(KNOWLEDGE_DOCUMENTS)
        texts = [chunk["text"] for chunk in self.chunks]
        self.embeddings = self.embedding_service.embed_documents(texts)
        print(f"[RAG VectorStore] Successfully indexed {len(self.chunks)} knowledge chunks from {len(KNOWLEDGE_DOCUMENTS)} documents.")

    def add_document(self, doc: Dict[str, Any]):
        """
        Adds and indexes a new document at runtime.
        """
        from app.rag.chunking import chunk_document
        new_chunks = chunk_document(doc)
        if not new_chunks:
            return
        
        self.chunks.extend(new_chunks)
        # Re-embed all chunks to update vocabulary
        texts = [chunk["text"] for chunk in self.chunks]
        self.embeddings = self.embedding_service.embed_documents(texts)

    def search(
        self,
        query: str,
        top_k: int = 4,
        category: Optional[str] = None,
        min_score: float = 0.05,
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic vector search against indexed knowledge chunks.
        """
        if not query.strip() or not self.chunks:
            return []

        query_vec = self.embedding_service.embed_text(query)
        scored_results = []

        for idx, chunk in enumerate(self.chunks):
            if category and chunk.get("category", "").lower() != category.lower():
                continue

            chunk_vec = self.embeddings[idx]
            sim_score = self.embedding_service.cosine_similarity(query_vec, chunk_vec)
            
            # Boost score if query keywords appear in title or category
            title_boost = 0.15 if any(w in chunk.get("title", "").lower() for w in query.lower().split()) else 0.0
            total_score = sim_score + title_boost

            if total_score >= min_score:
                scored_results.append({
                    "chunk_id": chunk["chunk_id"],
                    "doc_id": chunk["doc_id"],
                    "title": chunk["title"],
                    "category": chunk["category"],
                    "source": chunk["source"],
                    "date": chunk["date"],
                    "license": chunk["license"],
                    "text": chunk["text"],
                    "score": round(float(total_score), 4),
                })

        # Sort descending by score
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """
        Returns all source documents in knowledge base with metadata.
        """
        return [
            {
                "doc_id": doc["doc_id"],
                "title": doc["title"],
                "category": doc["category"],
                "date": doc["date"],
                "license": doc["license"],
                "source": doc["source"],
                "chunk_count": len([c for c in self.chunks if c["doc_id"] == doc["doc_id"]]),
            }
            for doc in KNOWLEDGE_DOCUMENTS
        ]


_vector_store_instance: Optional[BusinessVectorStore] = None


def get_vector_store() -> BusinessVectorStore:
    global _vector_store_instance
    if _vector_store_instance is None:
        _vector_store_instance = BusinessVectorStore()
    return _vector_store_instance
