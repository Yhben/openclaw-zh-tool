const scanConfig = {
  baseUrl: process.env.OPENCLAW_CONTROL_URL ?? "http://127.0.0.1:18789",
  routes: [
    "/overview",
    "/channels",
    "/instances",
    "/sessions",
    "/usage",
    "/cron",
    "/agents",
    "/skills",
    "/nodes",
    "/config",
    "/communications",
    "/appearance",
    "/automation",
    "/infrastructure",
    "/ai-agents",
    "/debug",
    "/logs"
  ],
  clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
  settleMs: 1200,
  maxEntriesPerView: 80
};

export { scanConfig };
