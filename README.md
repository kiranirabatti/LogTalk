# LogTalk

**AI-powered log intelligence that translates raw application logs into business impact.**

One analysis. Two audiences. Zero translation needed.

LogTalk takes any application log — pasted, uploaded, or streamed live — and produces both a **Developer View** (stack traces, root cause, deploy correlation) and a **CEO View** (users affected, revenue impact in INR, plain-English summary). Toggle between them with one click.

Built for [VibeCon 2026](https://vibecon.in) (April 16–17, Bangalore).

---

## Demo

```
1. Paste payment failure logs
2. Click "Analyze Logs" → AI processes in ~3 seconds
3. Developer View: severity, root cause, deploy correlation
4. Click the toggle → CEO View: 47 users affected, ₹82K revenue impact
```

Three input modes: **Paste** | **Upload** (.log, .txt, .json) | **Live** (webhook from sandbox)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| **Backend** | Python 3.11+, FastAPI, Anthropic SDK (`claude-sonnet-4-6`), uvicorn |
| **Frontend** | React 18, TypeScript, Tailwind CSS v4, Vite |
| **Sandbox** | Node.js 20+, Express (demo error generator) |
| **Deploy** | Railway (backend + sandbox), Vercel (frontend) |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- [Anthropic API key](https://console.anthropic.com/)

### 1. Clone and configure

```bash
git clone https://github.com/kiranirabatti/LogTalk.git
cd LogTalk

# Set up backend environment
cp backend/.env.example backend/.env
# Edit backend/.env and add your ANTHROPIC_API_KEY
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Visit **http://localhost:5173** — paste some logs and hit Analyze.

### 5. (Optional) Start the sandbox

```bash
cd sandbox
npm install
npm run dev
```

The sandbox generates fake AcmeCorp errors and sends them to the backend via webhook. Use the **Live** tab in the UI to trigger them.

---

## Project Structure

```
logtalk/
├── backend/                  # FastAPI — log parsing + Claude AI
│   ├── main.py               # API endpoints
│   ├── parser.py             # Log normalization + PII stripping
│   ├── intelligence.py       # Claude API integration
│   ├── models.py             # Pydantic models
│   └── tests/                # pytest test suite
├── frontend/                 # React — dual-view UI
│   ├── src/components/       # LogInput, LogViewer, DeveloperView, CeoView, etc.
│   ├── src/api/              # API client
│   ├── src/types/            # TypeScript interfaces
│   └── src/data/             # Demo samples + fallback response
├── sandbox/                  # Node.js — demo error generator
│   ├── index.js              # Express server
│   └── scenarios.js          # 4 error scenarios
├── docs/                     # Architecture + demo script
└── .github/workflows/        # CI pipeline
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze/paste` | Analyze raw pasted log text |
| `POST` | `/api/analyze/upload` | Analyze uploaded log file (.log, .txt, .json) |
| `POST` | `/api/logs/ingest` | Webhook for live log sources |
| `GET` | `/api/demo/trigger` | Trigger sandbox error scenario |

---

## Testing

```bash
# Backend (29 tests)
cd backend
pip install -r requirements-dev.txt
ruff check .
pytest tests/ -v

# Frontend (31 tests)
cd frontend
npm run lint
npm run test -- --run
```

60 tests total — parser, AI response handling, PII stripping, API validation, all UI components.

---

## Key Features

- **Dev/CEO Toggle** — one click switches between technical and business views
- **PII Stripping** — emails, phone numbers, and IPs are redacted before AI analysis
- **Token Usage Tracking** — input/output tokens displayed after each analysis
- **Demo Samples** — 3 one-click preloaded log scenarios for instant demos
- **Fallback Response** — cached analysis ensures demo works even if API is slow
- **Memory-Only Processing** — uploaded files are never written to disk

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `ALLOWED_ORIGINS` | CORS origins (default: `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default: `http://localhost:8000`) |

### Sandbox (`sandbox/.env`)

| Variable | Description |
|----------|-------------|
| `LOGTALK_WEBHOOK_URL` | Backend webhook URL (default: `http://localhost:8000/api/logs/ingest`) |

---

## License

MIT
