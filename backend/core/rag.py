import chromadb
from chromadb.utils import embedding_functions
import os
import uuid

# Use a local embedding model
CHROMA_PATH = "data/chroma"

class RAGManager:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PATH)
        # Using default sentence-transformer model
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="lab_knowledge",
            embedding_function=self.embedding_fn
        )

    def add_document(self, text: str, metadata: dict):
        doc_id = str(uuid.uuid4())
        self.collection.add(
            documents=[text],
            metadatas=[metadata],
            ids=[doc_id]
        )
        return doc_id

    def query(self, query_text: str, n_results: int = 3):
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results

rag_manager = RAGManager()
