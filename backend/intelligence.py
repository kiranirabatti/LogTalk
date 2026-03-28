"""Claude AI integration — the core brain of LogTalk."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone

import anthropic

from models import InternalLogSchema, LogAnalysis, Severity, UsageStats

# Canonical system prompt from ai-layer.md — do not change without discussion
SYSTEM_PROMPT = """
You are a combined Senior SRE and Business Analyst.
Given raw application logs, output ONLY valid JSON — no preamble, no markdown fences.

Required fields:
{
  "severity": "critical | high | medium | low",
  "affected_users": <integer estimate>,
  "revenue_impact_inr": <integer estimate, 0 if unknown>,
  "revenue_reasoning": "<one sentence explaining the estimate>",
  "technical_summary": "<max 2 sentences, for developers>",
  "business_summary": "<max 2 sentences, no jargon, for CEO>",
  "root_cause": "<most likely cause, one sentence>",
  "recommended_action": "<single most important next step>",
  "started_at": "<ISO timestamp or 'unknown'>",
  "deployment_correlation": "<recent deploy that may have caused this, or 'none detected'>"
}

Rules:
- Every field must have a value. Never return null or omit fields.
- business_summary must be readable by a non-technical person.
- revenue_impact_inr must be an integer. Use 0 if you truly cannot estimate.
- Be direct. No hedging language.
"""

MODEL = "claude-sonnet-4-6"
MAX_RETRIES_ON_RATE_LIMIT = 1
RATE_LIMIT_WAIT_SECONDS = 2

# Required fields from the AI response (before backend-added fields)
REQUIRED_FIELDS = {
    "severity",
    "affected_users",
    "revenue_impact_inr",
    "revenue_reasoning",
    "technical_summary",
    "business_summary",
    "root_cause",
    "recommended_action",
    "started_at",
    "deployment_correlation",
}


def _strip_markdown_fences(text: str) -> str:
    """Remove markdown code fences that Claude sometimes adds despite instructions."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def _parse_ai_response(
    raw_text: str, log_line_count: int, usage: UsageStats | None = None,
) -> LogAnalysis:
    """Parse and validate Claude's JSON response into a LogAnalysis model."""
    cleaned = _strip_markdown_fences(raw_text)
    data = json.loads(cleaned)

    # Validate required fields
    missing = REQUIRED_FIELDS - set(data.keys())
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    # Normalize severity
    severity_raw = str(data["severity"]).lower().strip()
    try:
        severity = Severity(severity_raw)
    except ValueError:
        severity = Severity.unknown

    return LogAnalysis(
        severity=severity,
        affected_users=int(data.get("affected_users", 0)),
        revenue_impact_inr=int(data.get("revenue_impact_inr", 0)),
        revenue_reasoning=str(data.get("revenue_reasoning", "")),
        technical_summary=str(data.get("technical_summary", "")),
        business_summary=str(data.get("business_summary", "")),
        root_cause=str(data.get("root_cause", "")),
        recommended_action=str(data.get("recommended_action", "")),
        started_at=str(data.get("started_at", "unknown")),
        deployment_correlation=str(data.get("deployment_correlation", "none detected")),
        analyzed_at=datetime.now(timezone.utc).isoformat(),
        log_line_count=log_line_count,
        usage=usage or UsageStats(),
    )


def _build_error_analysis(message: str, log_line_count: int) -> LogAnalysis:
    """Return a structured error response instead of raising."""
    return LogAnalysis(
        severity=Severity.unknown,
        affected_users=0,
        revenue_impact_inr=0,
        revenue_reasoning="Analysis could not be completed.",
        technical_summary=message,
        business_summary="We were unable to analyze these logs. Please try again.",
        root_cause="Analysis error",
        recommended_action="Retry the analysis or check the logs manually.",
        started_at="unknown",
        deployment_correlation="none detected",
        analyzed_at=datetime.now(timezone.utc).isoformat(),
        log_line_count=log_line_count,
    )


async def analyze_logs(parsed: InternalLogSchema) -> LogAnalysis:
    """Send parsed logs to Claude and return structured analysis."""
    log_text = "\n".join(parsed.raw_lines)
    if parsed.truncated:
        log_text = "Note: logs truncated to most relevant sections.\n\n" + log_text

    client = anthropic.AsyncAnthropic()

    import asyncio

    for attempt in range(1 + MAX_RETRIES_ON_RATE_LIMIT):
        try:
            response = await client.messages.create(
                model=MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": log_text}],
            )
            raw_response = response.content[0].text
            usage = UsageStats(
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
                total_tokens=response.usage.input_tokens + response.usage.output_tokens,
                model=MODEL,
            )
            return _parse_ai_response(raw_response, parsed.line_count, usage)

        except anthropic.RateLimitError:
            if attempt < MAX_RETRIES_ON_RATE_LIMIT:
                await asyncio.sleep(RATE_LIMIT_WAIT_SECONDS)
                continue
            return _build_error_analysis(
                "Rate limit reached. Please try again in a moment.",
                parsed.line_count,
            )
        except anthropic.APITimeoutError:
            return _build_error_analysis(
                "AI analysis timed out. Please try again.",
                parsed.line_count,
            )
        except anthropic.APIError as e:
            return _build_error_analysis(
                f"AI service error: {e.message}",
                parsed.line_count,
            )
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            return _build_error_analysis(
                f"Failed to parse AI response: {e}",
                parsed.line_count,
            )

    return _build_error_analysis("Unexpected error during analysis.", parsed.line_count)
