from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import json
from typing import List, Optional

# Local imports
from core.llm import llm_manager
from core.rag import rag_manager
from core.database import db_manager
from core.signal_utils import generate_iq_data, compute_fft, ofdm_tx
from core.hls_advisor import hls_advisor

app = FastAPI(title="DarakLab Copilot API")
print(f"Backend initialized with chat model: {llm_manager.chat_model}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "DarakLab Copilot Backend is running", "status": "online"}

@app.post("/chat")
async def chat(payload: dict):
    messages = payload.get("messages", [])
    response = llm_manager.chat(messages)
    return response

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), category: str = Form("general")):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore") # Simplification for now
    
    metadata = {"filename": file.filename, "category": category}
    doc_id = rag_manager.add_document(text, metadata)
    
    return {"status": "success", "id": doc_id, "filename": file.filename}

@app.get("/experiments")
async def get_experiments():
    return db_manager.get_experiments()

@app.post("/experiments")
async def add_experiment(data: dict):
    exp_id = db_manager.add_experiment(data)
    return {"status": "success", "id": exp_id}

@app.get("/signals/iq")
async def get_iq():
    i, q = generate_iq_data()
    return {"i": i, "q": q}

@app.post("/signals/fft")
async def get_fft(payload: dict):
    i = payload.get("i", [])
    q = payload.get("q", [])
    spectrum, freqs = compute_fft(i, q)
    return {"spectrum": spectrum, "freqs": freqs}

@app.post("/hls/analyze")
async def analyze_hls(payload: dict):
    code = payload.get("code", "")
    suggestions = hls_advisor.suggest_optimizations(code)
    return {"suggestions": suggestions}

@app.post("/hls/parse-report")
async def parse_hls_report(file: UploadFile = File(...)):
    content = await file.read()
    report_text = content.decode("utf-8", errors="ignore")
    metrics = hls_advisor.parse_synthesis_report(report_text)
    return {"metrics": metrics}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
