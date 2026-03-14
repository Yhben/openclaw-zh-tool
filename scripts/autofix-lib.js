import fs from "node:fs";
import path from "node:path";

const exactMap = new Map([
  ["Account Id", "账户 ID"],
  ["Ack Reaction", "确认反应"],
  ["ACP Backend", "ACP 后端"],
  ["ACP Default Agent", "ACP 默认代理"],
  ["ACP Dispatch Enabled", "启用 ACP 分发"],
  ["ACP Enabled", "启用 ACP"],
  ["ACP Max Concurrent Sessions", "ACP 最大并发会话数"],
  ["ACP Runtime Install Command", "ACP 运行时安装命令"],
  ["Actions", "操作"],
  ["Add entry", "添加条目"],
  ["Approval Agent Filter", "审批代理筛选"],
  ["Approval Forwarding Mode", "审批转发模式"],
  ["Approval Forwarding Targets", "审批转发目标"],
  ["Approval Session Filter", "审批会话筛选"],
  ["Approvals", "审批"],
  ["Audio Transcription", "音频转写"],
  ["Audio Transcription Command", "音频转写命令"],
  ["Audio Transcription Timeout (sec)", "音频转写超时（秒）"],
  ["Auto Update Beta Check Interval (hours)", "自动更新 Beta 检查间隔（小时）"],
  ["Auto Update Enabled", "启用自动更新"],
  ["Auto Update Stable Delay (hours)", "自动更新稳定版延迟（小时）"],
  ["Auto Update Stable Jitter (hours)", "自动更新稳定版抖动（小时）"],
  ["Channel", "频道"],
  ["Commands", "命令"],
  ["Connect", "连接"],
  ["Dashboard", "仪表板"],
  ["Dispatch", "分发"],
  ["Exec Approval Forwarding", "执行审批转发"],
  ["Forward Exec Approvals", "转发执行审批"],
  ["Group Chat Rules", "群聊规则"],
  ["Group History Limit", "群组历史限制"],
  ["Model Id", "模型 ID"],
  ["Get a tokenized dashboard URL:", "获取带令牌的仪表板 URL："],
  ["Thread Id", "线程 ID"],
  ["How to connect", "如何连接"],
  ["Password (not stored)", "密码（不存储）"],
  ["Paste the WebSocket URL and token above, or open the tokenized URL directly.", "粘贴上方的 WebSocket URL 和令牌，或直接打开带令牌的 URL。"],
  ["Read the docs →", "阅读文档 →"],
  ["Start the gateway on your host machine:", "在你的主机上启动网关："],
  ["To", "目标"],
  ["unauthorized: gateway token missing (open the dashboard URL and paste the token in Control UI settings)", "未授权：缺少网关令牌（打开仪表板 URL，并在控制界面设置中粘贴令牌）"],
  ["Update Channel", "更新频道"],
  ["Update Check on Start", "启动时检查更新"],
  ["WebSocket URL", "WebSocket 地址"],
  ["Wizard Last Run Command", "设置向导上次运行命令"],
  ["Wizard Last Run Commit", "设置向导上次运行提交"],
  ["Wizard Last Run Mode", "设置向导上次运行模式"],
  ["Wizard Last Run Timestamp", "设置向导上次运行时间戳"],
  ["Wizard Last Run Version", "设置向导上次运行版本"]
]);

const orderedPhraseRules = [
  ["Control UI", "控制界面"],
  ["Remote Gateway", "远程网关"],
  ["Setup Wizard", "设置向导"],
  ["Audio Transcription", "音频转写"],
  ["Ack Reaction", "确认反应"],
  ["Approval Forwarding", "审批转发"],
  ["Approval Session", "审批会话"],
  ["Approval Agent", "审批代理"],
  ["Approval", "审批"],
  ["Account", "账户"],
  ["Agent", "代理"],
  ["Appearance", "外观"],
  ["Automation", "自动化"],
  ["Backend", "后端"],
  ["Binding", "绑定"],
  ["Broadcast", "广播"],
  ["Capabilities", "能力"],
  ["Channel", "频道"],
  ["Chat", "聊天"],
  ["Check", "检查"],
  ["Command", "命令"],
  ["Commit", "提交"],
  ["Communications", "通信"],
  ["Concurrent", "并发"],
  ["Config", "配置"],
  ["Connection", "连接"],
  ["Default", "默认"],
  ["Dashboard", "仪表板"],
  ["Delay", "延迟"],
  ["Delivery", "投递"],
  ["Dispatch", "分发"],
  ["Emoji", "表情"],
  ["Enabled", "启用"],
  ["Exec", "执行"],
  ["Fallback", "回退"],
  ["Filter", "筛选"],
  ["Forwarding", "转发"],
  ["Forward", "转发"],
  ["Gateway", "网关"],
  ["Group", "群组"],
  ["History", "历史"],
  ["Host", "主机"],
  ["Inbound", "入站"],
  ["Install", "安装"],
  ["Interval", "间隔"],
  ["Last Run", "上次运行"],
  ["Limit", "限制"],
  ["Max", "最大"],
  ["Message", "消息"],
  ["Metadata", "元数据"],
  ["Mode", "模式"],
  ["Node", "节点"],
  ["Output", "输出"],
  ["Path", "路径"],
  ["Policy", "策略"],
  ["Port", "端口"],
  ["Profile", "配置档"],
  ["Queue", "队列"],
  ["Reaction", "反应"],
  ["Reconnect", "重连"],
  ["Reload", "重载"],
  ["Runtime", "运行时"],
  ["Scope", "范围"],
  ["Search", "搜索"],
  ["Security", "安全"],
  ["Session", "会话"],
  ["Stable", "稳定"],
  ["Status", "状态"],
  ["Stream", "流式输出"],
  ["Tag", "标签"],
  ["Target", "目标"],
  ["Thread", "线程"],
  ["Timeout", "超时"],
  ["Timestamp", "时间戳"],
  ["Token", "令牌"],
  ["Transcription", "转写"],
  ["Update", "更新"],
  ["Version", "版本"],
  ["Visibility", "可见性"],
  ["Wizard", "向导"]
];

const ignoredTokens = new Set([
  "ACP",
  "API",
  "CDP",
  "CLI",
  "HTTP",
  "HTTPS",
  "ID",
  "IDs",
  "JSON",
  "JSONL",
  "OpenClaw",
  "QR",
  "RPC",
  "SSRF",
  "TTL",
  "UI",
  "URL",
  "URLs",
  "Web",
  "WebChat",
  "WebSocket",
  "Tailscale",
  "Tailnet",
  "beta",
  "dev",
  "direct",
  "final_only",
  "group-all",
  "group-mentions",
  "live",
  "local",
  "none",
  "off",
  "on",
  "paragraph",
  "remote",
  "session",
  "space",
  "stable",
  "targets"
]);

const skipPatterns = [
  /^(ws:|https?:)/i,
  /[`{}[\]]/,
  /^\/[A-Za-z0-9._/-]+$/,
  /^[A-Z0-9_./:-]+$/,
  /^\d+(\.\d+)?$/,
  /^\d+\s+(items?|rows?)$/i
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function looksTechnical(text) {
  return skipPatterns.some((pattern) => pattern.test(text));
}

function translateCandidate(text) {
  const trimmed = text.trim();
  if (!trimmed || !/[A-Za-z]/.test(trimmed) || looksTechnical(trimmed)) {
    return null;
  }

  if (exactMap.has(trimmed)) {
    return exactMap.get(trimmed);
  }

  let translated = trimmed
    .replace(/\((hours)\)/gi, "（小时）")
    .replace(/\((hour)\)/gi, "（小时）")
    .replace(/\((minutes|min)\)/gi, "（分钟）")
    .replace(/\((seconds|sec)\)/gi, "（秒）")
    .replace(/\((milliseconds|ms)\)/gi, "（毫秒）");

  for (const [source, target] of orderedPhraseRules) {
    translated = translated.replace(new RegExp(`\\b${escapeRegExp(source)}\\b`, "g"), target);
  }

  translated = translated
    .replace(/\bId\b/g, "ID")
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (translated === trimmed) {
    return null;
  }

  const leftovers = translated.match(/[A-Za-z][A-Za-z0-9_-]*/g) ?? [];
  const unsafeLeftovers = leftovers.filter((token) => !ignoredTokens.has(token));
  if (unsafeLeftovers.length > 0 && trimmed.length > 80) {
    return null;
  }

  return translated;
}

function classifyCandidate(text, translation) {
  const trimmed = text.trim();
  const translated = translation.trim();
  const hasSentencePunctuation = /[.:;]|".*"/.test(trimmed);
  const isLong = trimmed.length > 72;
  const remainingAscii = translated.match(/[A-Za-z][A-Za-z0-9_-]*/g) ?? [];
  const unsafeLeftovers = remainingAscii.filter((token) => !ignoredTokens.has(token));

  if (!translation || translation === trimmed) {
    return "unresolved";
  }
  if (!hasSentencePunctuation && !isLong && unsafeLeftovers.length === 0) {
    return "safe";
  }
  if (unsafeLeftovers.length === 0) {
    return "review";
  }
  if (unsafeLeftovers.length <= 2 && trimmed.length <= 90) {
    return "review";
  }
  return "unresolved";
}

function analyzeScan(scan) {
  const counts = new Map();
  for (const route of scan.routes ?? []) {
    for (const view of route.views ?? []) {
      for (const entry of view.entries ?? []) {
        const key = entry.text.trim();
        if (!key) continue;
        const existing = counts.get(key) ?? { count: 0, routes: new Set(), views: new Set() };
        existing.count += 1;
        existing.routes.add(route.route);
        existing.views.add(`${route.route}:${view.view}`);
        counts.set(key, existing);
      }
    }
  }

  const safeCandidates = [];
  const reviewCandidates = [];
  const unresolved = [];

  for (const [text, meta] of counts) {
    const translation = translateCandidate(text);
    const item = {
      text,
      count: meta.count,
      routes: [...meta.routes].sort(),
      views: [...meta.views].sort()
    };

    const classification = classifyCandidate(text, translation ?? "");
    if (classification === "safe") {
      safeCandidates.push({ ...item, translation });
      continue;
    }
    if (classification === "review") {
      reviewCandidates.push({ ...item, translation });
      continue;
    }
    unresolved.push(item);
  }

  safeCandidates.sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
  reviewCandidates.sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
  unresolved.sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

  return {
    candidateCount: safeCandidates.length,
    reviewCandidateCount: reviewCandidates.length,
    unresolvedCount: unresolved.length,
    candidates: safeCandidates,
    safeCandidates,
    reviewCandidates,
    unresolved
  };
}

function writeGeneratedSupplements(repoRoot, analysis) {
  const outputPath = path.join(repoRoot, "supplements", "generated-exact.json");
  const existing = fs.existsSync(outputPath)
    ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
    : { exact: {} };
  const nextExact = { ...(existing.exact ?? {}) };
  let added = 0;

  for (const item of analysis.candidates) {
    if (nextExact[item.text] !== item.translation) {
      nextExact[item.text] = item.translation;
      added += 1;
    }
  }

  fs.writeFileSync(outputPath, `${JSON.stringify({ exact: nextExact }, null, 2)}\n`);

  return {
    outputPath,
    added,
    total: Object.keys(nextExact).length
  };
}

function writeReviewSuggestions(repoRoot, analysis) {
  const outputPath = path.join(repoRoot, "supplements", "review-candidates.json");
  const payload = {
    generatedAt: new Date().toISOString(),
    review: analysis.reviewCandidates,
    unresolved: analysis.unresolved
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  return outputPath;
}

export {
  analyzeScan,
  translateCandidate,
  writeGeneratedSupplements,
  writeReviewSuggestions
};
