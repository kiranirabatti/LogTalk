const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "logtalk-sandbox" });
});

// Placeholder — error scenario generation will be added in Sprint 2
app.get("/trigger", (_req, res) => {
  res.json({ message: "Sandbox trigger — scenarios coming in Sprint 2" });
});

app.listen(PORT, () => {
  console.log(`LogTalk Sandbox running on port ${PORT}`);
});
