import { collectHealth, resolveContext } from "./lib.js";

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
    console.log("Doctor status: healthy");
    return;
  }

  console.log("Doctor status: issues found");
  for (const problem of problems) {
    console.log(`- ${problem}`);
  }

  process.exit(1);
}

main();
