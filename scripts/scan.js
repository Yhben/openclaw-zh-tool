import { scanConfig } from "./scan-config.js";

const technicalAllowlist = [
  /^(ws:|https?:)/i,
  /^openclaw$/i,
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
  return technicalAllowlist.some((pattern) => pattern.test(text));
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

async function clickTabs(page) {
  const tabs = page.locator('[role="tab"]');
  const count = await tabs.count();
  const clicked = [];

  for (let i = 0; i < count; i += 1) {
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
  const clicked = [];
  for (const text of scanConfig.clickTexts) {
    const buttons = page.getByRole("button", { name: text });
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 3); i += 1) {
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

async function scanRoute(page, route) {
  const url = `${scanConfig.baseUrl}${route}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(scanConfig.settleMs);

  const views = [];

  const baseEntries = normalizeEntries(await collectVisibleEnglish(page));
  views.push({ view: "default", entries: baseEntries });

  const tabs = await clickTabs(page);
  for (const tab of tabs) {
    const entries = normalizeEntries(await collectVisibleEnglish(page));
    views.push({ view: `tab:${tab}`, entries });
  }

  const addClicks = await clickAddButtons(page);
  if (addClicks.length > 0) {
    const entries = normalizeEntries(await collectVisibleEnglish(page));
    views.push({ view: "after-add", entries });
  }

  return {
    route,
    url,
    tabs,
    addClicks,
    views
  };
}

async function runScan() {
  const playwright = await loadPlaywright();
  if (!playwright) {
    throw new Error("Playwright is not installed. Run `npm install` in this repository to enable page scanning.");
  }

  const browser = await launchBrowser(playwright);
  const page = await browser.newPage();
  const startedAt = new Date().toISOString();
  const results = [];

  try {
    for (const route of scanConfig.routes) {
      results.push(await scanRoute(page, route));
    }
  } finally {
    await browser.close();
  }

  const totalResidualEntries = results.reduce(
    (sum, route) => sum + route.views.reduce((viewSum, view) => viewSum + view.entries.length, 0),
    0
  );

  return {
    startedAt,
    baseUrl: scanConfig.baseUrl,
    totalRoutes: results.length,
    totalResidualEntries,
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
