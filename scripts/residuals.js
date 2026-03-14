import fs from "node:fs";
import path from "node:path";
import { analyzeScan } from "./autofix-lib.js";
import { runScan } from "./scan.js";

async function main() {
  const scan = await runScan();
  const analysis = analyzeScan(scan);
  const residuals = new Map();

  for (const route of scan.routes ?? []) {
    for (const view of route.views ?? []) {
      for (const entry of view.entries ?? []) {
        const key = entry.text.trim();
        if (!key) continue;
        const current = residuals.get(key) ?? {
          text: key,
          count: 0,
          routes: new Set(),
          views: new Set()
        };
        current.count += 1;
        current.routes.add(route.route);
        current.views.add(`${route.route}:${view.view}`);
        residuals.set(key, current);
      }
    }
  }

  const items = [...residuals.values()]
    .map((item) => {
      const safe = analysis.safeCandidates.find((candidate) => candidate.text === item.text);
      const review = analysis.reviewCandidates.find((candidate) => candidate.text === item.text);
      return {
        text: item.text,
        count: item.count,
        routes: [...item.routes].sort(),
        views: [...item.views].sort(),
        suggestedTranslation: safe?.translation ?? review?.translation ?? null,
        status: safe ? "safe" : review ? "review" : "unresolved"
      };
    })
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

  const output = {
    generatedAt: new Date().toISOString(),
    baseUrl: scan.baseUrl,
    uniqueResidualTexts: items.length,
    residuals: items
  };

  const outputPath = path.join(process.cwd(), "openclaw-zh-residuals.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Wrote residual list: ${outputPath}`);
  console.log(`Unique residual texts: ${items.length}`);
  for (const item of items.slice(0, 10)) {
    const suffix = item.suggestedTranslation ? ` -> ${item.suggestedTranslation}` : "";
    console.log(`- ${item.text} (${item.status}, ${item.count})${suffix}`);
  }
}

await main();
