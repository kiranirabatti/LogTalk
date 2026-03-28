"""Tests for FastAPI endpoints."""

from __future__ import annotations

import io

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(async_client: AsyncClient) -> None:
    response = await async_client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"


@pytest.mark.asyncio
async def test_paste_endpoint_rejects_empty(async_client: AsyncClient) -> None:
    response = await async_client.post("/api/analyze/paste", json={"logs": ""})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_upload_rejects_unsupported_extension(async_client: AsyncClient) -> None:
    file_content = b"some data"
    response = await async_client.post(
        "/api/analyze/upload",
        files={"file": ("test.exe", io.BytesIO(file_content), "application/octet-stream")},
    )
    assert response.status_code == 422
    assert "Unsupported file type" in response.json()["detail"]


@pytest.mark.asyncio
async def test_upload_rejects_oversized_file(async_client: AsyncClient) -> None:
    # 1.1 MB file — exceeds 1 MB limit
    file_content = b"x" * (1_048_576 + 100)
    response = await async_client.post(
        "/api/analyze/upload",
        files={"file": ("big.log", io.BytesIO(file_content), "text/plain")},
    )
    assert response.status_code == 413
    assert "1 MB" in response.json()["detail"]


@pytest.mark.asyncio
async def test_upload_rejects_empty_file(async_client: AsyncClient) -> None:
    response = await async_client.post(
        "/api/analyze/upload",
        files={"file": ("empty.log", io.BytesIO(b""), "text/plain")},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_webhook_rejects_empty_logs(async_client: AsyncClient) -> None:
    response = await async_client.post(
        "/api/logs/ingest",
        json={"source": "webhook", "logs": ""},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_demo_trigger_handles_sandbox_unavailable(async_client: AsyncClient) -> None:
    # Sandbox is not running during tests, should return graceful response
    response = await async_client.get("/api/demo/trigger")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unavailable"
