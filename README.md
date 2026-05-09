# DarakLab Copilot

A local-first AI Lab Assistant for FPGA/HLS/RFSoC research.

## Features
- **AI Chat**: Research mentor specializing in signal processing and FPGA.
- **RAG Knowledge Base**: Upload papers and notes for local retrieval.
- **HLS Assistant**: Parse synthesis reports and get pragma suggestions.
- **Signal Lab**: Visualize IQ and FFT data locally.
- **Experiment Logger**: SQLite-based tracking for lab results.
- **VSCode Extension**: Real-time code analysis and HLS optimization.

## Setup Instructions

### 1. Prerequisites
- **Ollama**: [Install Ollama](https://ollama.ai/) and pull models:
  ```bash
  ollama pull qwen2.5-coder:7b
  ollama pull llama3.1:8b
  ```
- **Python 3.9+**
- **Node.js 16+**

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. VSCode Extension
- Open the `extension` folder in VSCode.
- Run `npm install`.
- Press `F5` to start a new Extension Development Host window.
- Or package it using `vsce package`.

## Project Structure
- `backend/`: FastAPI server, RAG engine, SQLite database.
- `frontend/`: React dashboard with TailwindCSS.
- `extension/`: VSCode integration.
- `data/`: Local storage for ChromaDB and SQLite.

## Lab Context
Optimized for Intelligent and Reconfigurable Radar Signal Processing (Darak Lab).
- HLS Optimization (PIPELINE, UNROLL, ap_fixed)
- OFDM & Channel Estimation
- RFSoC & PYNQ Deployment
- hls4ml workflows
