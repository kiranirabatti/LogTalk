"""Shared test fixtures for LogTalk backend tests."""

from __future__ import annotations

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.fixture
def sample_nginx_log() -> str:
    return (
        '192.168.1.1 - - [28/Mar/2026:10:00:00 +0530] "GET /api/checkout HTTP/1.1" 500 1234\n'
        '192.168.1.2 - - [28/Mar/2026:10:00:01 +0530] "POST /api/payment HTTP/1.1" 502 567\n'
        '10.0.0.5 - - [28/Mar/2026:10:00:02 +0530] "GET /api/health HTTP/1.1" 200 15\n'
    )


@pytest.fixture
def sample_json_log() -> str:
    return (
        '{"timestamp": "2026-03-28T10:00:00Z", "level": "ERROR", "message": "Payment gateway timeout", "user_id": "u-12345"}\n'
        '{"timestamp": "2026-03-28T10:00:01Z", "level": "CRITICAL", "message": "Database connection pool exhausted", "user_id": "u-67890"}\n'
        '{"timestamp": "2026-03-28T10:00:02Z", "level": "INFO", "message": "Health check passed"}\n'
    )


@pytest.fixture
def sample_plaintext_log() -> str:
    return (
        "2026-03-28 10:00:00 ERROR PaymentService: Connection timeout after 30s\n"
        "2026-03-28 10:00:01 WARN RetryHandler: Retrying request (attempt 2/3)\n"
        "2026-03-28 10:00:02 CRITICAL DatabasePool: No available connections\n"
        "2026-03-28 10:00:03 INFO HealthCheck: Service is running\n"
    )


@pytest.fixture
def sample_pii_log() -> str:
    return (
        "ERROR: Failed to process order for user john.doe@example.com\n"
        "WARN: Rate limit exceeded from IP 203.0.113.42\n"
        "ERROR: SMS notification failed for 9876543210\n"
    )


@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
