# Security Rules

Applies to: entire codebase. These are non-negotiable.

## Data Handling

- NEVER log raw log content to console or application logs in production
- NEVER store uploaded log files to disk — process in memory only and discard
- NEVER store analysis results in a database for MVP — stateless by design
- Strip all PII patterns before sending to Claude API: emails, phone numbers, IP addresses, UUIDs that look like user IDs

## PII Stripping (apply in `backend/parser.py` before any Claude call)

```python
# Patterns to redact before sending to AI
PII_PATTERNS = [
    r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # emails
    r'\b\d{10}\b',           # phone numbers
    r'\b(?:\d{1,3}\.){3}\d{1,3}\b',  # IP addresses
]
# Replace with: [REDACTED]
```

## API Keys

- All secrets via environment variables — never hardcode
- Required env vars: `ANTHROPIC_API_KEY`, `ALLOWED_ORIGINS`
- `.env` is gitignored — provide `.env.example` with placeholder values

## Demo Environment

- The sandbox app generates FAKE data only — no real transactions, no real users
- Sandbox company name: "AcmeCorp" — fictional, clearly not a real client
- If demoing at VibeCon: use sandbox webhook mode exclusively

## CORS

- Backend CORS: restrict to `ALLOWED_ORIGINS` env var in production
- During local dev only: allow `localhost:5173` (Vite default)
