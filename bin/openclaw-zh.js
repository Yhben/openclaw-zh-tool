#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const command = process.argv[2] ?? "status";
const scriptMap = {
  install: "install.js",
  patch: "install.js",
  restore: "restore.js",
  status: "status.js"
};

const script = scriptMap[command];

if (!script) {
  console.error(`Unknown command: ${command}`);
  console.error("Usage: openclaw-zh <install|restore|status>");
  process.exit(1);
}

const result = spawnSync(process.execPath, [new URL(`../scripts/${script}`, import.meta.url).pathname], {
  stdio: "inherit"
});

process.exit(result.status ?? 1);
