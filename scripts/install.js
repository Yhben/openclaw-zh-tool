import fs from "node:fs";
import path from "node:path";
import { ensureDir, resolveContext, timestamp, writeState } from "./lib.js";

function main() {
  const ctx = resolveContext();
  const backupDir = path.join(ctx.assetsDir, ".openclaw-zh-backup", timestamp());
  ensureDir(backupDir);

  for (const file of ctx.patchInfo.files) {
    const source = path.join(ctx.assetsDir, file);
    const backup = path.join(backupDir, file);
    const patched = path.join(ctx.patchDir, file);

    if (!fs.existsSync(source)) {
      throw new Error(`Target asset missing: ${source}`);
    }
    if (!fs.existsSync(patched)) {
      throw new Error(`Patch asset missing: ${patched}`);
    }

    fs.copyFileSync(source, backup);
    fs.copyFileSync(patched, source);
  }

  writeState(ctx.openClawDir, {
    installedAt: new Date().toISOString(),
    openClawVersion: ctx.openClawVersion,
    patchVersion: ctx.patchInfo.patchVersion,
    backupDir,
    files: ctx.patchInfo.files
  });

  console.log(`Patched OpenClaw ${ctx.openClawVersion}`);
  console.log(`Assets dir: ${ctx.assetsDir}`);
  console.log(`Backup dir: ${backupDir}`);
}

main();
