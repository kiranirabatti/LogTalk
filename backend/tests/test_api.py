"""Tests for FastAPI endpoints."""

from __future__ import annotations

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
