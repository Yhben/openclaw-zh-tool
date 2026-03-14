import { collectHealth, resolveContext } from "./lib.js";
import { runScan, summarizeScan } from "./scan.js";

function line(label, value) {
  console.log(`${label}: ${value}`);
}

function main() {
  const ctx = resolveContext();
  const health = collectHealth(ctx);
  const problems = [];
  const installed = health.statePresent || health.markerInjected;

  if (!health.indexBundleExists) problems.push("target bundle missing");
  if (health.statePresent && !health.backupDirExists) problems.push("backup directory missing");
  if (health.statePresent && !health.targetFileExists) problems.push("target bundle recorded in state is missing");
  if (health.statePresent && !health.markerInjected) problems.push("state exists but runtime markers are missing");
  if (health.markerInjected && !health.runtimeMatches) problems.push("runtime markers exist but payload differs from current runtime file");

  line("OpenClaw dir", health.openClawDir);
  line("OpenClaw version", health.openClawVersion);
  line("Verified version", health.verifiedVersion ? "yes" : "no");
  line("Target bundle", health.indexBundle);
  line("State file", health.statePresent ? "present" : "missing");
  line("Runtime markers", health.markerInjected ? "present" : "missing");
  line("Runtime payload match", health.runtimeMatches ? "yes" : "no");
  line("Backup dir", health.backupDirExists ? "present" : "missing");

  if (!installed && problems.length === 0) {
    console.log("Doctor status: not installed");
    return;
  }

  if (problems.length === 0) {
    console.log("Doctor status: structural checks passed");
  } else {
    console.log("Doctor status: issues found");
    for (const problem of problems) {
      console.log(`- ${problem}`);
    }
    process.exitCode = 1;
  }
}

runDoctor();

async function runDoctor() {
  main();

  try {
    const scan = await runScan();
    console.log(`Residual English entries: ${scan.totalResidualEntries}`);
    const topRoutes = summarizeScan(scan).filter((item) => item.residualEntries > 0).slice(0, 5);
    for (const item of topRoutes) {
      console.log(`- ${item.route}: ${item.residualEntries}`);
    }
    if (scan.totalResidualEntries > 0) {
      console.log("Doctor scan status: residual English found");
      process.exitCode = 1;
    } else {
      console.log("Doctor scan status: clean");
    }
  } catch (error) {
    console.log(`Doctor scan status: unavailable (${String(error.message ?? error)})`);
  }
}
