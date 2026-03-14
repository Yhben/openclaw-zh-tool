import fs from "node:fs";
import path from "node:path";
import { readState, resolveContext } from "./lib.js";

function main() {
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

  console.log(`Restored original OpenClaw assets for ${ctx.openClawVersion}`);
  console.log(`Restored from: ${state.backupDir}`);
}

main();
