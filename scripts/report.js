import fs from "node:fs";
import path from "node:path";
import { collectHealth, resolveContext } from "./lib.js";

function main() {
  const ctx = resolveContext();
  const health = collectHealth(ctx);
  const report = {
    generatedAt: new Date().toISOString(),
    toolVersion: ctx.manifest.toolVersion ?? null,
    runtimeFile: ctx.manifest.runtime.file,
    ...health
  };

  const outputPath = path.join(process.cwd(), "openclaw-zh-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`Wrote report: ${outputPath}`);
}

main();
