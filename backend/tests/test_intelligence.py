"""Tests for AI intelligence layer — response parsing and error handling."""

from __future__ import annotations

import json

import pytest

from intelligence import _build_error_analysis, _parse_ai_response, _strip_markdown_fences


class TestStripMarkdownFences:
    def test_strips_json_fence(self) -> None:
        text = '```json\n{"severity": "high"}\n```'
        assert _strip_markdown_fences(text) == '{"severity": "high"}'

    def test_strips_plain_fence(self) -> None:
        text = '```\n{"severity": "high"}\n```'
        assert _strip_markdown_fences(text) == '{"severity": "high"}'

    def test_no_fences_unchanged(self) -> None:
        text = '{"severity": "high"}'
        assert _strip_markdown_fences(text) == '{"severity": "high"}'


class TestParseAIResponse:
    VALID_RESPONSE = json.dumps(
        {
            "severity": "critical",
            "affected_users": 47,
            "revenue_impact_inr": 82000,
            "revenue_reasoning": "47 users unable to checkout during peak hours",
            "technical_summary": "Payment gateway timeout. Connection pool exhausted.",
            "business_summary": "Customers cannot complete purchases. Estimated 47 affected.",
            "root_cause": "Database connection pool limit reached after deploy v2.3.1",
            "recommended_action": "Rollback to v2.3.0 and increase pool size",
            "started_at": "2026-03-28T15:15:00Z",
            "deployment_correlation": "v2.3.1 deployed 30 minutes before incident",
        }
    )

    def test_parses_valid_response(self) -> None:
        result = _parse_ai_response(self.VALID_RESPONSE, log_line_count=50)
        assert result.severity.value == "critical"
        assert result.affected_users == 47
        assert result.revenue_impact_inr == 82000
        assert result.log_line_count == 50
        assert result.analyzed_at  # should be set

    def test_parses_fenced_response(self) -> None:
        fenced = f"```json\n{self.VALID_RESPONSE}\n```"
        result = _parse_ai_response(fenced, log_line_count=10)
        assert result.severity.value == "critical"

    def test_raises_on_invalid_json(self) -> None:
        with pytest.raises(json.JSONDecodeError):
            _parse_ai_response("not json at all", log_line_count=5)

    def test_raises_on_missing_fields(self) -> None:
        incomplete = json.dumps({"severity": "high"})
        with pytest.raises(ValueError, match="Missing required fields"):
            _parse_ai_response(incomplete, log_line_count=5)

    def test_unknown_severity_normalized(self) -> None:
        data = json.loads(self.VALID_RESPONSE)
        data["severity"] = "apocalyptic"
        result = _parse_ai_response(json.dumps(data), log_line_count=10)
        assert result.severity.value == "unknown"


class TestBuildErrorAnalysis:
    def test_returns_unknown_severity(self) -> None:
        result = _build_error_analysis("Something broke", log_line_count=20)
        assert result.severity.value == "unknown"
        assert "Something broke" in result.technical_summary
        assert result.log_line_count == 20
