"""LogTalk FastAPI application — log intelligence API."""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from intelligence import analyze_logs
from models import ErrorResponse, HealthResponse, LogAnalysis, PasteRequest
from parser import parse_logs

load_dotenv()

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
