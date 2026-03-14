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

async function clickTabs(page, route) {
  const profile = routeProfile(route);
  if (profile.tabTexts?.length) {
    const clicked = [];
    const seen = new Set();
    for (const text of profile.tabTexts) {
      const tabs = page.getByRole("tab", { name: text });
      const count = await tabs.count();
      for (let i = 0; i < Math.min(count, scanConfig.maxTabClicksPerView); i += 1) {
        const tab = tabs.nth(i);
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
    if (clicked.length > 0) {
      return clicked;
    }
  }

  const tabs = page.locator('[role="tab"]');
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
  const clicked = [];
  for (const text of profile.clickTexts ?? scanConfig.clickTexts) {
    const buttons = page.getByRole("button", { name: text });
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
  const clicked = [];
  const seen = new Set();
  const disclosureSelectors = [
    'button[aria-expanded="false"]',
    '[role="button"][aria-expanded="false"]',
    "details summary"
  ];

  for (const selector of disclosureSelectors) {
    const nodes = page.locator(selector);
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
    const buttons = page.getByRole("button", { name: text });
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
  const actionTexts = profile.actionTexts ?? [];
  const clicked = [];
  const seen = new Set();

  for (const text of actionTexts) {
    const buttons = page.getByRole("button", { name: text });
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
  const snapshot = async (view) => {
    const entries = normalizeEntries(await collectVisibleEnglish(page));
    views.push({ view, entries });
  };

  await snapshot("default");

  const tabs = await clickTabs(page, route);
  for (const tab of tabs) {
    await snapshot(`tab:${tab}`);
  }

  const expanded = await expandDisclosureButtons(page);
  if (expanded.length > 0) {
    await snapshot("expanded");
  }

  const addClicks = await clickAddButtons(page);
  if (addClicks.length > 0) {
    await snapshot("after-add");
  }

  const actionClicks = await clickActionButtons(page);
  if (actionClicks.length > 0) {
    await snapshot("after-action");
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
  await context.addInitScript(() => {
    try {
      localStorage.setItem("openclaw.i18n.locale", "zh-CN");
    } catch {}
  });
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

export { runScan, summarizeScan };
