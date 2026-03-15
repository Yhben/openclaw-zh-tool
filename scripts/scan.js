import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { scanConfig } from "./scan-config.js";

const technicalAllowlist = [
  /^(ws:|https?:)/i,
  /^openclaw$/i,
  /^openclaw\s+/i,
  /^json value$/i,
  /^select\.\.\.$/i,
  /^[A-Z0-9_./:-]+$/,
  /^qmd$/i,
  /^npm$/i,
  /^pnpm$/i,
  /^yarn$/i,
  /^bun$/i,
  /^on$/i,
  /^off$/i,
  /^raw$/i,
  /^hash$/i,
  /^strict$/i,
  /^query$/i,
  /^search$/i,
  /^vsearch$/i,
  /^paragraph$/i,
  /^newline$/i,
  /^sentence$/i,
  /^\d+ items?$/i
];

const mixedTechnicalTokens = new Set([
  "Control",
  "UI",
  "URL",
  "URLs",
  "WebSocket",
  "gateway",
  "token",
  "tokens"
]);

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

async function launchBrowser(playwright) {
  const chromium = playwright.chromium;
  const candidates = [
    () => chromium.launch({
      headless: true,
      executablePath: process.env.OPENCLAW_ZH_BROWSER_PATH
    }),
    () => chromium.launch({
      headless: true,
      channel: process.env.OPENCLAW_ZH_BROWSER_CHANNEL ?? "chrome"
    }),
    () => chromium.launch({ headless: true })
  ];

  for (const candidate of candidates) {
    try {
      return await candidate();
    } catch {}
  }

  throw new Error("Unable to launch a browser. Install Playwright browsers or set OPENCLAW_ZH_BROWSER_PATH.");
}

function readJsonIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function extractBalancedJson(raw, startIndex) {
  if (startIndex < 0 || startIndex >= raw.length) return null;
  const opening = raw[startIndex];
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : null;
  if (!closing) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < raw.length; i += 1) {
    const char = raw[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === opening) {
      depth += 1;
      continue;
    }

    if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(startIndex, i + 1);
      }
    }
  }

  return null;
}

function extractJsonAfterKey(raw, key) {
  let fromIndex = raw.length;

  while (fromIndex >= 0) {
    const keyIndex = raw.lastIndexOf(key, fromIndex);
    if (keyIndex < 0) return null;

    const searchStart = keyIndex + key.length;
    const objectIndex = raw.indexOf("{", searchStart);
    const arrayIndex = raw.indexOf("[", searchStart);
    const valueIndex = [objectIndex, arrayIndex]
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0];

    if (valueIndex >= 0 && valueIndex - searchStart < 4096) {
      const extracted = extractBalancedJson(raw, valueIndex);
      if (extracted) {
        try {
          return JSON.parse(extracted);
        } catch {}
      }
    }

    fromIndex = keyIndex - 1;
  }

  return null;
}

function findBrowserStorageDirs() {
  const home = os.homedir();
  return [
    path.join(home, "Library/Application Support/Google/Chrome/Profile 1/Local Storage/leveldb"),
    path.join(home, "Library/Application Support/Google/Chrome/Default/Local Storage/leveldb"),
    path.join(home, "Library/Application Support/Chromium/Default/Local Storage/leveldb"),
    path.join(home, "AppData/Local/Google/Chrome/User Data/Default/Local Storage/leveldb"),
    path.join(home, "AppData/Local/Chromium/User Data/Default/Local Storage/leveldb")
  ];
}

function readBrowserLocalStorageBootstrap() {
  for (const dir of findBrowserStorageDirs()) {
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".ldb") || name.endsWith(".log"))
      .map((name) => ({
        filePath: path.join(dir, name),
        mtimeMs: fs.statSync(path.join(dir, name)).mtimeMs
      }))
      .sort((a, b) => b.mtimeMs - a.mtimeMs);

    let deviceIdentity = null;
    let deviceAuth = null;
    let settings = null;

    for (const file of files) {
      const raw = fs.readFileSync(file.filePath, "latin1");
      if (!deviceIdentity) {
        const parsed = extractJsonAfterKey(raw, "openclaw-device-identity-v1");
        if (parsed?.deviceId) deviceIdentity = parsed;
      }
      if (!deviceAuth) {
        const parsed = extractJsonAfterKey(raw, "openclaw.device.auth.v1");
        if (parsed?.tokens) deviceAuth = parsed;
      }
      if (!settings) {
        const parsed = extractJsonAfterKey(raw, "openclaw.control.settings.v1");
        if (parsed?.gatewayUrl) settings = parsed;
      }
      if (deviceIdentity && deviceAuth && settings) {
        return { deviceIdentity, deviceAuth, settings };
      }
    }

    if (deviceIdentity || deviceAuth || settings) {
      return { deviceIdentity, deviceAuth, settings };
    }
  }

  return null;
}

function readScanBootstrap() {
  const home = os.homedir();
  const browserBootstrap = readBrowserLocalStorageBootstrap();
  const identityCandidates = [
    path.join(home, "Library/Application Support/OpenClaw/identity"),
    path.join(home, ".openclaw/identity")
  ];

  let deviceIdentity = browserBootstrap?.deviceIdentity ?? null;
  let deviceAuth = browserBootstrap?.deviceAuth ?? null;

  for (const dir of identityCandidates) {
    const device = readJsonIfExists(path.join(dir, "device.json"));
    const auth = readJsonIfExists(path.join(dir, "device-auth.json"));
    if (!deviceIdentity && device?.deviceId) {
      deviceIdentity = {
        version: device.version ?? 1,
        deviceId: device.deviceId,
        publicKey: device.publicKey ?? device.publicKeyPem,
        privateKey: device.privateKey ?? device.privateKeyPem,
        createdAtMs: device.createdAtMs
      };
    }
    if (!deviceAuth && auth?.tokens) {
      deviceAuth = auth;
    }
    if (deviceIdentity && deviceAuth) break;
  }

  const config = readJsonIfExists(path.join(home, ".openclaw/openclaw.json"));
  const gatewayPort = config?.gateway?.port ?? 18789;
  const gatewayUrl = `ws://127.0.0.1:${gatewayPort}`;
  const settings = {
    gatewayUrl,
    sessionKey: "agent:main:main",
    lastActiveSessionKey: "agent:main:main",
    ...(browserBootstrap?.settings || {})
  };

  return {
    deviceIdentity,
    deviceAuth,
    settings
  };
}

function shouldIgnore(text) {
  if (technicalAllowlist.some((pattern) => pattern.test(text))) {
    return true;
  }

  if (/[\u4e00-\u9fff]/.test(text)) {
    const tokens = text.match(/[A-Za-z][A-Za-z0-9_-]*/g) ?? [];
    if (tokens.length > 0 && tokens.every((token) => mixedTechnicalTokens.has(token))) {
      return true;
    }
  }

  return false;
}

function routeProfile(route) {
  return scanConfig.routeProfiles?.[route] ?? {};
}

async function collectVisibleEnglish(page) {
  return page.evaluate(({ maxEntriesPerView }) => {
    const isVisible = (element) => {
      if (!element) return false;
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const walker = document.createTreeWalker(document.querySelector("main") || document.body, NodeFilter.SHOW_TEXT);
    const out = [];
    const seen = new Set();
    let node;

    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const text = (node.nodeValue || "").replace(/\s+/g, " ").trim();
      if (!parent || !text) continue;
      if (!isVisible(parent)) continue;
      if (!/[A-Za-z]/.test(text)) continue;
      if (text.length > 260) continue;
      if (seen.has(text)) continue;
      seen.add(text);
      out.push({
        text,
        tag: parent.tagName.toLowerCase()
      });
      if (out.length >= maxEntriesPerView) break;
    }

    return out;
  }, { maxEntriesPerView: scanConfig.maxEntriesPerView });
}

function normalizeEntries(entries) {
  return entries.filter((entry) => !shouldIgnore(entry.text));
}

async function scrollPage(page, fraction) {
  await page.evaluate((targetFraction) => {
    const scroller =
      document.scrollingElement ||
      document.documentElement ||
      document.body;
    const maxScroll = Math.max(0, scroller.scrollHeight - window.innerHeight);
    const top = Math.round(maxScroll * targetFraction);
    window.scrollTo({ top, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(scanConfig.settleMs);
}

async function snapshotAtScrollPoints(page, viewPrefix, views) {
  for (const fraction of scanConfig.scrollFractions ?? [0]) {
    await scrollPage(page, fraction);
    const entries = normalizeEntries(await collectVisibleEnglish(page));
    const suffix =
      fraction === 0 ? "top" :
      fraction === 1 ? "bottom" :
      `${Math.round(fraction * 100)}`;
    views.push({
      view: `${viewPrefix}:${suffix}`,
      entries
    });
  }

  await scrollPage(page, 0);
}

async function getContentRoot(page) {
  const main = page.locator("main");
  const count = await main.count();
  if (count > 0) return main.first();
  return page.locator("body");
}

async function clickTabs(page, route) {
  const profile = routeProfile(route);
  const root = await getContentRoot(page);
  if (profile.tabTexts?.length) {
    const clicked = [];
    const seen = new Set();
    for (const text of profile.tabTexts) {
      const candidates = [
        root.getByRole("tab", { name: text }),
        root.getByRole("button", { name: text })
      ];

      for (const group of candidates) {
        const count = await group.count();
        for (let i = 0; i < Math.min(count, scanConfig.maxTabClicksPerView); i += 1) {
          const tab = group.nth(i);
          const visible = await tab.isVisible().catch(() => false);
          if (!visible) continue;
          const label = ((await tab.textContent()) || "").trim() || text;
          if (seen.has(label)) continue;
          await tab.click().catch(() => {});
          await page.waitForTimeout(scanConfig.settleMs);
          clicked.push(label);
          seen.add(label);
        }
      }
    }
    if (clicked.length > 0) {
      return clicked;
    }
  }

  const tabs = root.locator('[role="tab"]');
  const count = await tabs.count();
  const clicked = [];

  for (let i = 0; i < Math.min(count, scanConfig.maxTabClicksPerView); i += 1) {
    const tab = tabs.nth(i);
    const label = ((await tab.textContent()) || "").trim();
    if (!label) continue;
    await tab.click().catch(() => {});
    await page.waitForTimeout(scanConfig.settleMs);
    clicked.push(label);
  }

  return clicked;
}

async function clickAddButtons(page) {
  const profile = routeProfile(page.url().replace(scanConfig.baseUrl, ""));
  const root = await getContentRoot(page);
  const clicked = [];
  for (const text of profile.clickTexts ?? scanConfig.clickTexts) {
    const buttons = root.getByRole("button", { name: text });
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, scanConfig.maxAddClicksPerView); i += 1) {
      const button = buttons.nth(i);
      const visible = await button.isVisible().catch(() => false);
      if (!visible) continue;
      await button.click().catch(() => {});
      await page.waitForTimeout(scanConfig.settleMs);
      clicked.push(text);
    }
  }
  return clicked;
}

async function expandDisclosureButtons(page) {
  const profile = routeProfile(page.url().replace(scanConfig.baseUrl, ""));
  const root = await getContentRoot(page);
  const clicked = [];
  const seen = new Set();
  const disclosureSelectors = [
    'button[aria-expanded="false"]',
    '[role="button"][aria-expanded="false"]',
    "details summary"
  ];

  for (const selector of disclosureSelectors) {
    const nodes = root.locator(selector);
    const count = await nodes.count();
    for (let i = 0; i < Math.min(count, scanConfig.maxExpandClicksPerView); i += 1) {
      const node = nodes.nth(i);
      const visible = await node.isVisible().catch(() => false);
      if (!visible) continue;
      const label = (((await node.textContent()) || "").replace(/\s+/g, " ").trim()) || selector;
      if (seen.has(`${selector}:${label}`)) continue;
      await node.click().catch(() => {});
      await page.waitForTimeout(scanConfig.settleMs);
      seen.add(`${selector}:${label}`);
      clicked.push(label);
    }
  }

  for (const text of profile.expandTexts ?? scanConfig.expandTexts) {
    const buttons = root.getByRole("button", { name: text });
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, scanConfig.maxExpandClicksPerView); i += 1) {
      const button = buttons.nth(i);
      const visible = await button.isVisible().catch(() => false);
      if (!visible) continue;
      const label = (((await button.textContent()) || "").replace(/\s+/g, " ").trim()) || text;
      if (seen.has(`text:${label}`)) continue;
      await button.click().catch(() => {});
      await page.waitForTimeout(scanConfig.settleMs);
      seen.add(`text:${label}`);
      clicked.push(label);
    }
  }

  return clicked;
}

async function clickActionButtons(page) {
  const profile = routeProfile(page.url().replace(scanConfig.baseUrl, ""));
  const root = await getContentRoot(page);
  const actionTexts = profile.actionTexts ?? [];
  const clicked = [];
  const seen = new Set();

  for (const text of actionTexts) {
    const buttons = root.getByRole("button", { name: text });
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, scanConfig.maxActionClicksPerView); i += 1) {
      const button = buttons.nth(i);
      const visible = await button.isVisible().catch(() => false);
      if (!visible) continue;
      const label = (((await button.textContent()) || "").replace(/\s+/g, " ").trim()) || text;
      if (seen.has(label)) continue;
      await button.click().catch(() => {});
      await page.waitForTimeout(scanConfig.settleMs);
      clicked.push(label);
      seen.add(label);
    }
  }

  return clicked;
}

async function scanRoute(page, route) {
  const url = `${scanConfig.baseUrl}${route}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(scanConfig.settleMs);

  const views = [];
  await snapshotAtScrollPoints(page, "default", views);

  const tabs = await clickTabs(page, route);
  for (const tab of tabs) {
    await snapshotAtScrollPoints(page, `tab:${tab}`, views);
  }

  const expanded = await expandDisclosureButtons(page);
  if (expanded.length > 0) {
    await snapshotAtScrollPoints(page, "expanded", views);
  }

  const addClicks = await clickAddButtons(page);
  if (addClicks.length > 0) {
    await snapshotAtScrollPoints(page, "after-add", views);
  }

  const actionClicks = await clickActionButtons(page);
  if (actionClicks.length > 0) {
    await snapshotAtScrollPoints(page, "after-action", views);
  }

  return {
    route,
    url,
    tabs,
    expanded,
    addClicks,
    actionClicks,
    views
  };
}

async function runScan() {
  const playwright = await loadPlaywright();
  if (!playwright) {
    throw new Error("Playwright is not installed. Run `npm install` in this repository to enable page scanning.");
  }

  const browser = await launchBrowser(playwright);
  const context = await browser.newContext();
  const bootstrap = readScanBootstrap();
  await context.addInitScript((bootstrapData) => {
    try {
      localStorage.setItem("openclaw.i18n.locale", "zh-CN");
      const currentSettings = JSON.parse(localStorage.getItem("openclaw.control.settings.v1") || "{}");
      localStorage.setItem(
        "openclaw.control.settings.v1",
        JSON.stringify({
          ...currentSettings,
          ...(bootstrapData.settings || {})
        })
      );
      if (bootstrapData.deviceIdentity?.deviceId) {
        localStorage.setItem("openclaw-device-identity-v1", JSON.stringify(bootstrapData.deviceIdentity));
      }
      if (bootstrapData.deviceAuth?.tokens) {
        localStorage.setItem("openclaw.device.auth.v1", JSON.stringify(bootstrapData.deviceAuth));
      }
    } catch {}
  }, bootstrap);
  const page = await context.newPage();
  const startedAt = new Date().toISOString();
  const results = [];

  try {
    for (const route of scanConfig.routes) {
      results.push(await scanRoute(page, route));
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const totalResidualEntries = results.reduce(
    (sum, route) => sum + route.views.reduce((viewSum, view) => viewSum + view.entries.length, 0),
    0
  );
  const uniqueResidualEntries = new Set(
    results.flatMap((route) => route.views.flatMap((view) => view.entries.map((entry) => entry.text.trim())))
  ).size;

  return {
    startedAt,
    baseUrl: scanConfig.baseUrl,
    totalRoutes: results.length,
    totalResidualEntries,
    uniqueResidualEntries,
    routes: results
  };
}

function summarizeScan(scan) {
  return scan.routes
    .map((route) => ({
      route: route.route,
      residualEntries: route.views.reduce((sum, view) => sum + view.entries.length, 0)
    }))
    .sort((a, b) => b.residualEntries - a.residualEntries);
}

export { readScanBootstrap, runScan, summarizeScan };
