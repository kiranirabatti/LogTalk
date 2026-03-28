"""Tests for log parser — format detection, PII stripping, truncation."""

from __future__ import annotations

from parser import count_severity, detect_format, parse_logs, strip_pii, truncate_lines


class TestStripPII:
    def test_strips_email(self) -> None:
        text = "Error for user john@example.com in request"
        result = strip_pii(text)
        assert "john@example.com" not in result
        assert "[REDACTED]" in result

    def test_strips_phone(self) -> None:
        text = "SMS failed for 9876543210"
        result = strip_pii(text)
        assert "9876543210" not in result
        assert "[REDACTED]" in result

    def test_strips_ip(self) -> None:
        text = "Request from 192.168.1.100 blocked"
        result = strip_pii(text)
        assert "192.168.1.100" not in result
        assert "[REDACTED]" in result

    def test_strips_multiple_pii(self, sample_pii_log: str) -> None:
        result = strip_pii(sample_pii_log)
        assert "john.doe@example.com" not in result
        assert "203.0.113.42" not in result
        assert "9876543210" not in result
        assert result.count("[REDACTED]") == 3


class TestDetectFormat:
    def test_nginx_format(self) -> None:
        lines = [
            '192.168.1.1 - - [28/Mar/2026:10:00:00 +0530] "GET /api HTTP/1.1" 200 1234',
            '10.0.0.1 - - [28/Mar/2026:10:00:01 +0530] "POST /api HTTP/1.1" 500 567',
        ]
        assert detect_format(lines) == "nginx"

    def test_json_format(self) -> None:
        lines = [
            '{"timestamp": "2026-03-28T10:00:00Z", "level": "ERROR", "message": "fail"}',
            '{"timestamp": "2026-03-28T10:00:01Z", "level": "INFO", "message": "ok"}',
        ]
        assert detect_format(lines) == "json"

    def test_plaintext_format(self) -> None:
        lines = [
            "2026-03-28 10:00:00 ERROR Something went wrong",
            "2026-03-28 10:00:01 INFO Recovery complete",
        ]
        assert detect_format(lines) == "plaintext"

    def test_empty_returns_plaintext(self) -> None:
        assert detect_format([]) == "plaintext"


class TestCountSeverity:
    def test_counts_errors_and_warnings(self, sample_plaintext_log: str) -> None:
        lines = sample_plaintext_log.splitlines()
        errors, warnings = count_severity(lines)
        assert errors == 2  # ERROR + CRITICAL
        assert warnings == 1


class TestTruncateLines:
    def test_no_truncation_when_within_budget(self) -> None:
        lines = ["short line"] * 10
        result, truncated = truncate_lines(lines)
        assert not truncated
        assert len(result) == 10

    def test_truncation_preserves_error_lines(self) -> None:
        filler = ["INFO: normal log line " + "x" * 200] * 500
        important = ["ERROR: critical failure detected"]
        lines = filler[:250] + important + filler[250:]
        result, truncated = truncate_lines(lines)
        assert truncated
        assert any("ERROR: critical failure" in line for line in result)


class TestParseLogs:
    def test_paste_source(self, sample_plaintext_log: str) -> None:
        result = parse_logs(sample_plaintext_log, source="paste")
        assert result.source == "paste"
        assert result.line_count == 4
        assert result.error_count == 2
        assert result.warning_count == 1

    def test_pii_stripped_in_output(self, sample_pii_log: str) -> None:
        result = parse_logs(sample_pii_log, source="paste")
        raw = "\n".join(result.raw_lines)
        assert "john.doe@example.com" not in raw
        assert "203.0.113.42" not in raw
        assert "9876543210" not in raw
