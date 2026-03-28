const express = require("express");
const { getRandomScenario } = require("./scenarios");

const app = express();
const PORT = process.env.PORT || 4000;
const LOGTALK_WEBHOOK_URL =
  process.env.LOGTALK_WEBHOOK_URL || "http://localhost:8000/api/logs/ingest";

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "logtalk-sandbox" });
});

app.get("/trigger", async (_req, res) => {
  const scenario = getRandomScenario();
  const logs = scenario.generate();

  try {
    const response = await fetch(LOGTALK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "webhook",
        logs,
        metadata: { scenario: scenario.name, generator: "logtalk-sandbox" },
      }),
    });

    if (response.ok) {
      const analysis = await response.json();
      res.json({
        status: "sent",
        scenario: scenario.name,
        analysis,
      });
    } else {
      res.status(502).json({
        status: "error",
        scenario: scenario.name,
        message: `LogTalk backend returned ${response.status}`,
      });
    }
  } catch (err) {
    res.status(502).json({
      status: "error",
      scenario: scenario.name,
      message: `Failed to reach LogTalk backend: ${err.message}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`LogTalk Sandbox running on port ${PORT}`);
  console.log(`Webhook target: ${LOGTALK_WEBHOOK_URL}`);
});
