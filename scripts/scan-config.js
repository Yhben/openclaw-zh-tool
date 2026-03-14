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
  expandTexts: ["展开", "高级", "更多", "显示更多", "Expand", "Advanced", "More", "Show more"],
  settleMs: 1200,
  maxEntriesPerView: 80,
  maxTabClicksPerView: 24,
  maxAddClicksPerView: 3,
  maxExpandClicksPerView: 16
};

export { scanConfig };
