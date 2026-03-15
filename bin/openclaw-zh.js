#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const command = process.argv[2] ?? "status";
const scriptMap = {
  install: "install.js",
  patch: "install.js",
  heal: "heal.js",
  watch: "watch.js",
  "enable-autoheal": "enable-autoheal.js",
  "disable-autoheal": "disable-autoheal.js",
  restore: "restore.js",
  status: "status.js",
  verify: "verify.js",
  doctor: "doctor.js",
  report: "report.js",
  residuals: "residuals.js",
  scan: "scan-cli.js",
  autofix: "autofix.js",
  "promote-review": "promote-review.js"
};

const script = scriptMap[command];

if (!script) {
  console.error(`Unknown command: ${command}`);
  console.error("Usage: openclaw-zh <install|heal|watch|enable-autoheal|disable-autoheal|restore|status|verify|doctor|report|residuals|scan|autofix|promote-review>");
  process.exit(1);
}

const result = spawnSync(process.execPath, [fileURLToPath(new URL(`../scripts/${script}`, import.meta.url)), ...process.argv.slice(3)], {
  stdio: "inherit"
});

process.exit(result.status ?? 1);
