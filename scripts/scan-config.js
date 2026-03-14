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
  routeProfiles: {
    "/config": {
      tabTexts: ["设置", "环境", "认证", "更新", "元数据", "日志", "诊断", "CLI", "密钥", "ACP"],
      clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["编辑", "详情", "设置", "Edit", "Details", "Settings"]
    },
    "/communications": {
      tabTexts: ["通信", "频道", "消息", "广播", "语音", "音频"],
      clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["编辑", "详情", "设置", "探测", "Edit", "Details", "Settings", "Probe"]
    },
    "/appearance": {
      tabTexts: ["外观", "外观", "界面", "设置向导"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["详情", "Details"]
    },
    "/automation": {
      tabTexts: ["自动化", "命令", "钩子", "绑定", "定时任务", "审批", "插件"],
      clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["编辑", "详情", "设置", "Edit", "Details", "Settings"]
    },
    "/infrastructure": {
      tabTexts: ["网关", "浏览器", "日志", "监控", "媒体", "存储"],
      clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["编辑", "详情", "设置", "Edit", "Details", "Settings"]
    },
    "/ai-agents": {
      tabTexts: ["会话", "线程", "模型", "记忆", "上下文", "提示"],
      clickTexts: ["添加", "添加条目", "Add", "Add Entry"],
      expandTexts: ["高级", "展开", "更多", "Expand", "Advanced"],
      actionTexts: ["编辑", "详情", "设置", "Edit", "Details", "Settings"]
    }
  },
  settleMs: 1200,
  maxEntriesPerView: 80,
  maxTabClicksPerView: 24,
  maxAddClicksPerView: 3,
  maxExpandClicksPerView: 16,
  maxActionClicksPerView: 6
};

export { scanConfig };
