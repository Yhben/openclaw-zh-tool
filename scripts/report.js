import fs from "node:fs";
import path from "node:path";
import { collectHealth, resolveContext } from "./lib.js";
import { runScan } from "./scan.js";

async function main() {
  const ctx = resolveContext();
  const health = collectHealth(ctx);
  let scan = null;

  try {
    scan = await runScan();
  } catch (error) {
    scan = {
      unavailable: true,
      reason: String(error.message ?? error)
    };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    toolVersion: ctx.manifest.toolVersion ?? null,
    runtimeFile: ctx.manifest.runtime.file,
    ...health,
    scan
  };

  const outputPath = path.join(process.cwd(), "openclaw-zh-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`Wrote report: ${outputPath}`);
}

await main();
