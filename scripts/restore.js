import fs from "node:fs";
import path from "node:path";
import { disableAutoheal } from "./autoheal-lib.js";
import { readState, resolveContext } from "./lib.js";

function main() {
  const keepAutoheal = process.argv.includes("--keep-autoheal");
  const ctx = resolveContext();
  const state = readState(ctx.openClawDir);

  if (!state) {
    throw new Error("No openclaw-zh state file found. Nothing to restore.");
  }

  for (const file of state.files) {
    const backup = path.join(state.backupDir, file);
    const target = path.join(ctx.assetsDir, file);

    if (!fs.existsSync(backup)) {
      throw new Error(`Backup file missing: ${backup}`);
    }

    fs.copyFileSync(backup, target);
  }

  fs.rmSync(ctx.statePath, { force: true });

  if (!keepAutoheal) {
    try {
      disableAutoheal({ quiet: true });
    } catch {}
  }

  console.log(`Restored original OpenClaw assets for ${ctx.openClawVersion}`);
  console.log(`Restored from: ${state.backupDir}`);
  if (!keepAutoheal) {
    console.log("Auto-heal: disabled");
  }
}

main();
