"""Log normalization and PII stripping — all log inputs flow through here."""

from __future__ import annotations

import json
import re
from typing import Literal

from models import InternalLogSchema, TimeRange

# PII patterns from security.md — replace with [REDACTED]
PII_PATTERNS = [
    re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"),  # emails
    re.compile(r"\b\d{10}\b"),  # phone numbers
    re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"),  # IP addresses
]

# Token budget for Claude input (rough estimate: 1 token ≈ 4 chars)
MAX_TOKEN_CHARS = 4000 * 4

# Keywords that indicate important log lines to preserve during truncation
PRIORITY_KEYWORDS = re.compile(r"\b(ERROR|CRITICAL|FATAL)\b", re.IGNORECASE)


def strip_pii(text: str) -> str:
    """Redact PII patterns from text."""
    for pattern in PII_PATTERNS:
        text = pattern.sub("[REDACTED]", text)
    return text


def detect_format(lines: list[str]) -> Literal["nginx", "apache", "json", "plaintext", "mixed"]:
    """Detect log format from a sample of lines."""
    if not lines:
        return "plaintext"

    sample = lines[:20]
    json_count = 0
    nginx_count = 0
    apache_count = 0

    for line in sample:
        stripped = line.strip()
        if not stripped:
            continue
        # JSON detection
        if stripped.startswith("{"):
            try:
                json.loads(stripped)
                json_count += 1
                continue
            except (json.JSONDecodeError, ValueError):
                pass
        # Nginx combined log format
        if re.match(r'^[\d.]+\s+-\s+-\s+\[', stripped):
            nginx_count += 1
            continue
        # Apache common/combined log format
        if re.match(r'^[\d.]+\s+\S+\s+\S+\s+\[', stripped):
            apache_count += 1
            continue

    total = len([line for line in sample if line.strip()])
    if total == 0:
        return "plaintext"

    counts = {"json": json_count, "nginx": nginx_count, "apache": apache_count}
    best = max(counts, key=counts.get)

    if counts[best] == 0:
        return "plaintext"
    if counts[best] == total:
        return best
    if counts[best] > total * 0.5:
        return "mixed"
    return "plaintext"


def count_severity(lines: list[str]) -> tuple[int, int]:
    """Count error and warning lines."""
    errors = sum(1 for line in lines if re.search(r"\b(ERROR|CRITICAL|FATAL)\b", line, re.IGNORECASE))
    warnings = sum(1 for line in lines if re.search(r"\bWARN(ING)?\b", line, re.IGNORECASE))
    return errors, warnings


def truncate_lines(lines: list[str]) -> tuple[list[str], bool]:
    """Truncate logs to fit within token budget, preserving important lines."""
    full_text = "\n".join(lines)
    if len(full_text) <= MAX_TOKEN_CHARS:
        return lines, False

    # Keep priority lines (ERROR/CRITICAL/FATAL) + last 100 lines
    priority_lines = [line for line in lines if PRIORITY_KEYWORDS.search(line)]
    tail_lines = lines[-100:]

    # Merge, preserving order and deduplicating
    seen = set()
    merged: list[str] = []
    for line in lines:
        if line in priority_lines or line in tail_lines:
            if id(line) not in seen:
                seen.add(id(line))
                merged.append(line)

    # If still too long, trim from the top of merged
    while len("\n".join(merged)) > MAX_TOKEN_CHARS and len(merged) > 10:
        merged.pop(0)

    return merged, True


def parse_logs(
    raw_text: str,
    source: Literal["paste", "upload", "webhook", "azure"] = "paste",
) -> InternalLogSchema:
    """Normalize raw log text into the internal schema."""
    lines = raw_text.splitlines()

    # Strip PII from each line
    sanitized_lines = [strip_pii(line) for line in lines]

    # Detect format
    fmt = detect_format(sanitized_lines)

    # Count severity
    error_count, warning_count = count_severity(sanitized_lines)

    # Truncate if needed
    truncated_lines, was_truncated = truncate_lines(sanitized_lines)

    return InternalLogSchema(
        source=source,
        raw_lines=truncated_lines,
        line_count=len(lines),
        detected_format=fmt,
        time_range=TimeRange(),
        error_count=error_count,
        warning_count=warning_count,
        truncated=was_truncated,
    )
