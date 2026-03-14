import { execFileSync } from "node:child_process";
import { analyzeScan, writeGeneratedSupplements, writeReviewSuggestions } from "./autofix-lib.js";
import { collectHealth, resolveContext } from "./lib.js";
import { runScan } from "./scan.js";

async function main() {
  const ctx = resolveContext();
  const health = collectHealth(ctx);
  const scan = await runScan();
  const analysis = analyzeScan(scan);

  console.log(`Residual English entries: ${scan.totalResidualEntries}`);
  console.log(`Unique residual texts: ${scan.uniqueResidualEntries}`);
  console.log(`Auto-fix candidates: ${analysis.candidateCount}`);
  console.log(`Review candidates: ${analysis.reviewCandidateCount}`);
  console.log(`Unresolved entries: ${analysis.unresolvedCount}`);

  const reviewPath = writeReviewSuggestions(ctx.repoRoot, analysis);
  console.log(`Review suggestion file: ${reviewPath}`);

  if (analysis.candidateCount === 0) {
    console.log("No safe auto-fix candidates found.");
    return;
  }

  const writeResult = writeGeneratedSupplements(ctx.repoRoot, analysis);
  console.log(`Generated supplement file: ${writeResult.outputPath}`);
  console.log(`New exact replacements added: ${writeResult.added}`);
  console.log(`Total generated replacements: ${writeResult.total}`);

  if (health.statePresent || health.markerInjected) {
    execFileSync(process.execPath, ["./scripts/install.js"], {
      cwd: ctx.repoRoot,
      stdio: "inherit"
    });
    console.log("Reinstalled runtime with updated supplements.");
  } else {
    console.log("Runtime not currently installed. Run install to inject the updated supplements.");
  }
}

await main();
