# LogTalk

AI-powered log intelligence tool that translates raw application logs into business impact.
Core value: toggle between **Developer View** (stack traces, error codes) and **CEO View** (users affected, revenue impact, plain-English root cause).

Built for VibeCon 2026 (April 16–17, Bangalore) — judges are YC partners. Every decision should reinforce: *this is a real product, not a hackathon toy.*

## Architecture

```
logtalk/
├── backend/        # Python / FastAPI — log parsing + Claude AI intelligence layer
├── frontend/       # React — dual-view UI with Dev/CEO toggle
├── sandbox/        # Node.js demo app — generates realistic live errors via webhook
└── docs/           # Architecture decisions and API contracts
```

See @docs/architecture.md for detailed component contracts.

## Stack

- **Backend**: Python 3.11+, FastAPI, `anthropic` SDK, `uvicorn`
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Sandbox**: Node.js 20+, Express
- **Deploy**: Backend → Railway, Frontend → Vercel

## Commands

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev

# Sandbox (demo live error generator)
cd sandbox && npm install && npm run dev

# Tests
cd backend && pytest
cd frontend && npm run test
```

## Core Rules

- The **Dev/CEO toggle** is the hero feature — protect its UX above all else
- Always output structured JSON from the AI layer before rendering in UI
- Use `claude-sonnet-4-6` model for all Anthropic API calls
- Every Claude API response must be parsed defensively — assume fields may be missing
- Never log or expose real client data anywhere in the codebase
- Use `httpx` (async) for all HTTP calls in FastAPI, never `requests`

## Log Input Modes (build in this order)

1. **Paste** — textarea input, any format (MVP, build first)
2. **Upload** — `.log`, `.txt`, `.json` file upload
3. **Webhook** — POST endpoint `/api/logs/ingest` (for live sandbox demo)
4. **Azure Monitor** — future, ScriptsHub client integration

## Key Files

- `backend/intelligence.py` — Claude API prompt + response parser (core brain)
- `backend/parser.py` — normalizes all log formats to internal JSON schema
- `frontend/src/components/LogViewer.tsx` — the toggle UI component
- `frontend/src/components/ImpactCard.tsx` — CEO view revenue/user impact display

See @.claude/rules/ai-layer.md for Claude API prompt engineering rules.
See @.claude/rules/frontend.md for React and UI conventions.
See @.claude/rules/security.md for data handling rules.
