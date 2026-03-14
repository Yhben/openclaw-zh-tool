import fs from "node:fs";
import path from "node:path";
import { ensureDir, resolveContext, timestamp, writeState } from "./lib.js";

function main() {
  const ctx = resolveContext();
  const runtime = fs.readFileSync(ctx.runtimePath, "utf8").trim();
  const markerStart = ctx.manifest.runtime.markerStart;
  const markerEnd = ctx.manifest.runtime.markerEnd;
  const original = fs.readFileSync(ctx.indexBundlePath, "utf8");

  if (original.includes(markerStart) && original.includes(markerEnd)) {
    const updated = original.replace(
      new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`),
      `${markerStart}\n${runtime}\n${markerEnd}`
    );
    fs.writeFileSync(ctx.indexBundlePath, updated);
    console.log(`Updated injected runtime in ${ctx.indexBundle}`);
    return;
  }

  const backupDir = path.join(ctx.assetsDir, ".openclaw-zh-backup", timestamp());
  ensureDir(backupDir);
  const backup = path.join(backupDir, ctx.indexBundle);
  fs.copyFileSync(ctx.indexBundlePath, backup);

  const injected = `${original}\n${markerStart}\n${runtime}\n${markerEnd}\n`;
  fs.writeFileSync(ctx.indexBundlePath, injected);

  writeState(ctx.openClawDir, {
    installedAt: new Date().toISOString(),
    openClawVersion: ctx.openClawVersion,
    verifiedVersion: ctx.manifest.verifiedOpenClawVersions.includes(ctx.openClawVersion),
    mode: "runtime-injection",
    backupDir,
    files: [ctx.indexBundle],
    targetFile: ctx.indexBundle
  });

  console.log(`Injected runtime into OpenClaw ${ctx.openClawVersion}`);
  console.log(`Assets dir: ${ctx.assetsDir}`);
  console.log(`Target bundle: ${ctx.indexBundle}`);
  console.log(`Backup dir: ${backupDir}`);
}

main();
