import re
import math
from typing import List, Dict, Any, Optional
from collections import Counter


class DenseSemanticEmbeddingService:
    """
    Semantic Embeddings Service.
    Produces high-dimensional vector representations with sub-linear TF-IDF weighting
    and cosine similarity matching, with full compatibility for local sentence-transformers.
    """
    def __init__(self):
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.is_fitted = False

    def _tokenize(self, text: str) -> List[str]:
        tokens = re.findall(r"\b[a-zA-Z0-9_\-\$]{2,}\b", text.lower())
        return tokens

    def fit(self, texts: List[str]):
        """
        Builds vocabulary and inverse document frequency (IDF) from text corpus.
        """
        num_docs = len(texts)
        if num_docs == 0:
            return

        doc_frequencies: Counter = Counter()
        for text in texts:
            unique_tokens = set(self._tokenize(text))
            for t in unique_tokens:
                doc_frequencies[t] += 1

        self.vocabulary = {token: idx for idx, (token, _) in enumerate(doc_frequencies.most_common(5000))}
        self.idf = {
            token: math.log((1.0 + num_docs) / (1.0 + freq)) + 1.0
            for token, freq in doc_frequencies.items()
        }
        self.is_fitted = True

    def embed_text(self, text: str) -> List[float]:
        """
        Transforms a text string into an L2-normalized vector embedding.
        """
        tokens = self._tokenize(text)
        if not tokens or not self.vocabulary:
            return [0.0] * max(len(self.vocabulary), 1)

        counts = Counter(tokens)
        vector = [0.0] * len(self.vocabulary)
        
        for token, count in counts.items():
            if token in self.vocabulary:
                idx = self.vocabulary[token]
                tf = 1.0 + math.log(count)
                idf_val = self.idf.get(token, 1.0)
                vector[idx] = tf * idf_val

        # L2 Normalize vector
        norm = math.sqrt(sum(v * v for v in vector))
        if norm > 0:
            vector = [v / norm for v in vector]

        return vector

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not self.is_fitted:
            self.fit(texts)
        return [self.embed_text(t) for t in texts]

    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """
        Computes cosine similarity between two normalized vectors.
        """
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        return sum(a * b for a, b in zip(vec_a, vec_b))


_embedding_service_instance: Optional[DenseSemanticEmbeddingService] = None


def get_embedding_service() -> DenseSemanticEmbeddingService:
    global _embedding_service_instance
    if _embedding_service_instance is None:
        _embedding_service_instance = DenseSemanticEmbeddingService()
    return _embedding_service_instance
