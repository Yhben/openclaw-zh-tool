#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const command = process.argv[2] ?? "status";
const scriptMap = {
  install: "install.js",
  patch: "install.js",
  restore: "restore.js",
  status: "status.js",
  verify: "verify.js",
  doctor: "doctor.js",
  report: "report.js"
};

const script = scriptMap[command];

if (!script) {
  console.error(`Unknown command: ${command}`);
  console.error("Usage: openclaw-zh <install|restore|status|verify|doctor|report>");
  process.exit(1);
}

const result = spawnSync(process.execPath, [fileURLToPath(new URL(`../scripts/${script}`, import.meta.url))], {
  stdio: "inherit"
});

process.exit(result.status ?? 1);
