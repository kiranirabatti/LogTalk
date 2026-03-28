"""LogTalk FastAPI application — log intelligence API."""

from __future__ import annotations

import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from intelligence import analyze_logs
from models import (
    DemoTriggerResponse,
    ErrorResponse,
    HealthResponse,
    LogAnalysis,
    PasteRequest,
    WebhookPayload,
)
from parser import parse_logs

load_dotenv()

ALLOWED_EXTENSIONS = {".log", ".txt", ".json"}
MAX_UPLOAD_SIZE = 1_048_576  # 1 MB

app = FastAPI(
    title="LogTalk API",
    description="AI-powered log intelligence — Developer View meets CEO View",
    version="0.1.0",
)

# CORS — restrict to ALLOWED_ORIGINS in production, allow localhost for dev
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse()


@app.post(
    "/api/analyze/paste",
    response_model=LogAnalysis,
    responses={422: {"model": ErrorResponse}},
)
async def analyze_paste(request: PasteRequest) -> LogAnalysis:
    parsed = parse_logs(request.logs, source="paste")
    result = await analyze_logs(parsed)
    return result


@app.post(
    "/api/analyze/upload",
    response_model=LogAnalysis,
    responses={413: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
async def analyze_upload(file: UploadFile) -> LogAnalysis:
    # Validate extension
    filename = file.filename or ""
    ext = ("." + filename.rsplit(".", 1)[-1]).lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read in memory — never write to disk (security.md)
    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 1 MB limit")

    raw_text = content.decode("utf-8", errors="replace")
    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="Uploaded file is empty")

    parsed = parse_logs(raw_text, source="upload")
    result = await analyze_logs(parsed)
    return result


@app.post(
    "/api/logs/ingest",
    response_model=LogAnalysis,
    responses={422: {"model": ErrorResponse}},
)
async def ingest_webhook(payload: WebhookPayload) -> LogAnalysis:
    parsed = parse_logs(payload.logs, source="webhook")
    result = await analyze_logs(parsed)
    return result


@app.get("/api/demo/trigger", response_model=DemoTriggerResponse)
async def demo_trigger() -> DemoTriggerResponse:
    """Trigger the sandbox to emit a demo error event."""
    sandbox_url = os.getenv("SANDBOX_URL", "http://localhost:4000")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{sandbox_url}/trigger")
            resp.raise_for_status()
            return DemoTriggerResponse(status="triggered", message="Sandbox error event sent")
    except httpx.HTTPError:
        return DemoTriggerResponse(
            status="unavailable", message="Sandbox is not running"
        )
