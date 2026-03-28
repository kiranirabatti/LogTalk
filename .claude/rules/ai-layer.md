# AI Intelligence Layer Rules

Applies to: `backend/intelligence.py`, any file calling the Anthropic SDK.

## Model

Always use `claude-sonnet-4-6`. Never hardcode another model name without updating this file.

## System Prompt (canonical — do not change structure without discussion)

```python
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
```

## Response Parsing

- Always parse with `json.loads()` inside a try/except
- On parse failure: return a structured error object, never raise to the API caller
- Validate all required fields are present before returning to frontend
- Strip any accidental markdown fences (` ```json `) before parsing

## Token Efficiency

- Truncate log input to 4000 tokens max before sending to Claude
- For large log files: extract the most recent 100 lines + any lines containing ERROR/CRITICAL/FATAL
- Pass truncation context to Claude: *"Note: logs truncated to most relevant sections."*

## Error States

- API timeout → return `severity: "unknown"` with a user-facing message
- Rate limit → queue and retry once after 2 seconds
- Malformed logs → still attempt analysis, note uncertainty in `technical_summary`
