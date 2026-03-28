# LogTalk — Architecture Reference

## Internal Log Schema

All log parsers normalize to this format before hitting the AI layer:

```json
{
  "source": "paste | upload | webhook | azure",
  "raw_lines": ["..."],
  "line_count": 0,
  "detected_format": "nginx | apache | json | plaintext | mixed",
  "time_range": {
    "start": "ISO timestamp or null",
    "end": "ISO timestamp or null"
  },
  "error_count": 0,
  "warning_count": 0,
  "truncated": false
}
```

## API Endpoints (FastAPI)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/analyze/paste` | Analyze raw pasted log text |
| POST | `/api/analyze/upload` | Analyze uploaded log file |
| POST | `/api/logs/ingest` | Webhook endpoint for sandbox/live sources |
| GET  | `/api/health` | Health check |
| GET  | `/api/demo/trigger` | Trigger a sandbox error event (demo use only) |

## AI Response Schema

```typescript
interface LogAnalysis {
  severity: 'critical' | 'high' | 'medium' | 'low';
  affected_users: number;
  revenue_impact_inr: number;
  revenue_reasoning: string;
  technical_summary: string;
  business_summary: string;
  root_cause: string;
  recommended_action: string;
  started_at: string;
  deployment_correlation: string;
  analyzed_at: string; // added by backend, not Claude
  log_line_count: number; // added by backend
}
```

## Demo Flow (VibeCon Event)

```
1. Open LogTalk on laptop (live URL)
2. Show "Developer View" — paste pre-loaded payment failure logs
3. Click "Analyze" — 3-5 second AI processing
4. Watch Developer View populate with technical details
5. HIT THE TOGGLE → CEO View animates in
6. Judge sees: "47 users couldn't checkout | ₹82,000 est. revenue impact | Started 3:15 PM | Fix: Rollback last deploy"
7. Switch to LIVE tab — sandbox app streaming real errors in real time
8. Same toggle magic on live data
```

## Deployment

- **Backend**: Railway (FastAPI auto-detected, set `PORT` env var)
- **Frontend**: Vercel (Vite preset, set `VITE_API_URL` to Railway URL)
- **Sandbox**: Railway (separate service, set `LOGTALK_WEBHOOK_URL`)
