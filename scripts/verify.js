import { collectHealth, resolveContext } from "./lib.js";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function main() {
  const ctx = resolveContext();
  const health = collectHealth(ctx);

  console.log(`OpenClaw version: ${health.openClawVersion}`);
  console.log(`Target bundle: ${health.indexBundle}`);

  if (!health.statePresent) {
    fail("Verification failed: patch state file not found.");
  }
  if (!health.indexBundleExists) {
    fail("Verification failed: target bundle not found.");
  }
  if (!health.markerInjected) {
    fail("Verification failed: runtime markers are missing from the current bundle.");
  }
  if (!health.runtimeMatches) {
    fail("Verification failed: injected runtime does not match the bundled runtime file.");
  }
  if (!health.backupDirExists) {
    fail("Verification failed: backup directory recorded in state file does not exist.");
  }
  if (!health.targetFileExists) {
    fail("Verification failed: target bundle recorded in state file does not exist.");
  }

  console.log("Verification passed.");
}

main();
