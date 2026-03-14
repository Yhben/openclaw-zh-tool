import fs from "node:fs";
import path from "node:path";
import { analyzeScan } from "./autofix-lib.js";
import { collectHealth, resolveContext } from "./lib.js";
import { runScan, summarizeScan } from "./scan.js";

function buildSummary(scan, analysis) {
  if (!scan || scan.unavailable || !analysis) {
    return null;
  }

  return {
    totalResidualEntries: scan.totalResidualEntries,
    uniqueResidualTexts: scan.uniqueResidualEntries,
    autoFixCandidates: analysis.candidateCount,
    reviewCandidates: analysis.reviewCandidateCount,
    unresolvedEntries: analysis.unresolvedCount,
    topRoutes: summarizeScan(scan).slice(0, 5),
    topSafeCandidates: analysis.safeCandidates.slice(0, 10).map((item) => ({
      text: item.text,
      translation: item.translation,
      count: item.count
    })),
    topReviewCandidates: analysis.reviewCandidates.slice(0, 10).map((item) => ({
      text: item.text,
      translation: item.translation,
      count: item.count
    })),
    topUnresolved: analysis.unresolved.slice(0, 10).map((item) => ({
      text: item.text,
      count: item.count
    }))
  };
}

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
    scan,
    autofixAnalysis: scan && !scan.unavailable ? analyzeScan(scan) : null
  };

  report.summary = buildSummary(report.scan, report.autofixAnalysis);

  const outputPath = path.join(process.cwd(), "openclaw-zh-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`Wrote report: ${outputPath}`);
  if (report.summary) {
    console.log(`Unique residual texts: ${report.summary.uniqueResidualTexts}`);
    console.log(`Auto-fix candidates: ${report.summary.autoFixCandidates}`);
    console.log(`Review candidates: ${report.summary.reviewCandidates}`);
  }
}

await main();
