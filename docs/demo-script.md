# LogTalk — VibeCon 2026 Demo Script

**Event:** VibeCon 2026, April 16-17, Bangalore
**Duration:** Under 3 minutes
**Audience:** YC partner judges

---

## Setup (before going on stage)

- [ ] Open LogTalk in browser (production URL or localhost:5173)
- [ ] Verify backend is running (`/api/health` returns ok)
- [ ] Have mobile hotspot ready as network backup
- [ ] Close all unnecessary browser tabs
- [ ] Set browser zoom to 100%, window width 1280px+

---

## Demo Flow

### Act 1: The Problem (30 seconds)

> "Every engineering team has dashboards full of logs. But when something breaks at 3 AM, your CEO asks one question: *how many users are affected and how much money are we losing?* Today, developers and executives speak different languages about the same incident. LogTalk bridges that gap."

### Act 2: Developer View (45 seconds)

1. **Click "Payment Gateway Failure"** demo sample button
   - Textarea fills with realistic payment service error logs
2. **Click "Analyze Logs"**
   - Loading skeleton appears (~3-5 seconds)
3. **Developer View populates** (default view)
   - Point out: severity badge, technical summary, root cause, deployment correlation
   - > "A developer sees exactly what they need — stack traces, root cause, which deploy caused it."

### Act 3: The Toggle — Hero Moment (30 seconds)

4. **Click the CEO View toggle**
   - Pill slides right, indigo theme appears
   - > "Now watch this. One click."
5. **CEO View appears**
   - Point out the impact cards: "47 users affected", "₹82K revenue impact"
   - Point out: plain-English summary, revenue reasoning, recommended next step
   - > "Same data, same incident — but now your CEO understands the business impact in 2 seconds."

### Act 4: Multiple Input Modes (30 seconds)

6. **Click "Upload" tab**
   - > "Teams can also upload log files directly."
7. **Click "Live" tab**
   - **Click "Trigger Live Error"**
   - > "Or connect any monitoring tool via webhook. Here's our sandbox generating a real error in real time."
   - Results appear with toggle working on live data

### Act 5: Close (15 seconds)

> "LogTalk turns any log into a business conversation. Paste, upload, or stream live — every incident gets both a developer view and a CEO view. One AI analysis, two audiences, zero translation needed."

---

## Timing Checkpoints

| Mark | Action | Cumulative |
|------|--------|-----------|
| 0:00 | Start talking (problem statement) | 0:30 |
| 0:30 | Click demo sample + Analyze | 0:45 |
| 0:45 | Developer View walkthrough | 1:15 |
| 1:15 | **HIT THE TOGGLE** | 1:20 |
| 1:20 | CEO View walkthrough | 1:45 |
| 1:45 | Upload + Live tab demo | 2:15 |
| 2:15 | Closing statement | 2:30 |

---

## Fallback Plans

| Scenario | Action |
|----------|--------|
| **Claude API slow (>10s)** | Say "AI is thinking..." naturally. If >15s, switch to cached demo response |
| **Claude API down** | Use cached fallback response (built into frontend) |
| **Railway/Vercel down** | Switch to localhost — have terminal ready with `uvicorn` and `npm run dev` |
| **Network down** | Use mobile hotspot. If that fails, play the screen recording |
| **Screen recording** | Record full demo flow the night before as .mp4 backup |

---

## Key Numbers to Emphasize

- **47 users** couldn't check out
- **₹82,000** estimated revenue impact
- **v2.3.1** — the deploy that caused it
- **One click** to switch from dev to CEO view
