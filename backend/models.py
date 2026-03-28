"""Pydantic models for LogTalk API — mirrors architecture.md contracts."""

from __future__ import annotations

from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


# ── Internal Log Schema ──────────────────────────────────────────────

class TimeRange(BaseModel):
    start: str | None = None
    end: str | None = None


class InternalLogSchema(BaseModel):
    source: Literal["paste", "upload", "webhook", "azure"]
    raw_lines: list[str]
    line_count: int
    detected_format: Literal["nginx", "apache", "json", "plaintext", "mixed"]
    time_range: TimeRange = Field(default_factory=TimeRange)
    error_count: int = 0
    warning_count: int = 0
    truncated: bool = False


# ── AI Response Schema ───────────────────────────────────────────────

class Severity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    unknown = "unknown"


class LogAnalysis(BaseModel):
    severity: Severity
    affected_users: int
    revenue_impact_inr: int
    revenue_reasoning: str
    technical_summary: str
    business_summary: str
    root_cause: str
    recommended_action: str
    started_at: str
    deployment_correlation: str
    analyzed_at: str  # added by backend, not Claude
    log_line_count: int  # added by backend


# ── Request / Response Models ────────────────────────────────────────

class PasteRequest(BaseModel):
    logs: str = Field(..., min_length=1, description="Raw log text to analyze")


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"


class WebhookPayload(BaseModel):
    source: str = "webhook"
    logs: str = Field(..., min_length=1, description="Log text from external source")
    metadata: dict[str, str] = Field(default_factory=dict)


class DemoTriggerResponse(BaseModel):
    status: str
    message: str


class ErrorResponse(BaseModel):
    error: str
    detail: str | None = None
