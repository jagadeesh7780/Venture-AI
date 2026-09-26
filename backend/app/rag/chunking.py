import re
from typing import List, Dict, Any


def chunk_document(
    doc: Dict[str, Any],
    chunk_size: int = 400,
    chunk_overlap: int = 50,
) -> List[Dict[str, Any]]:
    """
    Chunks a single document into smaller passages while preserving
    document metadata (doc_id, title, category, date, license, source).
    """
    content = doc.get("content", "").strip()
    if not content:
        return []

    # Split content by paragraphs or double newlines
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", content) if p.strip()]
    chunks = []
    current_chunk = ""
    chunk_index = 0

    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 1 <= chunk_size:
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph
        else:
            if current_chunk:
                chunks.append({
                    "chunk_id": f"{doc.get('doc_id')}_chunk_{chunk_index}",
                    "doc_id": doc.get("doc_id"),
                    "title": doc.get("title"),
                    "category": doc.get("category"),
                    "date": doc.get("date"),
                    "license": doc.get("license"),
                    "source": doc.get("source"),
                    "text": current_chunk,
                    "chunk_index": chunk_index,
                })
                chunk_index += 1
            # If paragraph itself is larger than chunk_size, split by sentences
            if len(paragraph) > chunk_size:
                sentences = re.split(r"(?<=[.!?])\s+", paragraph)
                sub_chunk = ""
                for s in sentences:
                    if len(sub_chunk) + len(s) + 1 <= chunk_size:
                        sub_chunk = (sub_chunk + " " + s).strip()
                    else:
                        if sub_chunk:
                            chunks.append({
                                "chunk_id": f"{doc.get('doc_id')}_chunk_{chunk_index}",
                                "doc_id": doc.get("doc_id"),
                                "title": doc.get("title"),
                                "category": doc.get("category"),
                                "date": doc.get("date"),
                                "license": doc.get("license"),
                                "source": doc.get("source"),
                                "text": sub_chunk,
                                "chunk_index": chunk_index,
                            })
                            chunk_index += 1
                        sub_chunk = s
                current_chunk = sub_chunk
            else:
                current_chunk = paragraph

    if current_chunk:
        chunks.append({
            "chunk_id": f"{doc.get('doc_id')}_chunk_{chunk_index}",
            "doc_id": doc.get("doc_id"),
            "title": doc.get("title"),
            "category": doc.get("category"),
            "date": doc.get("date"),
            "license": doc.get("license"),
            "source": doc.get("source"),
            "text": current_chunk,
            "chunk_index": chunk_index,
        })

    return chunks


def chunk_all_documents(documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Chunks a collection of documents into indexed passages with full metadata.
    """
    all_chunks = []
    for doc in documents:
        all_chunks.extend(chunk_document(doc))
    return all_chunks
