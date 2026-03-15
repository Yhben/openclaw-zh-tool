import fs from "node:fs";
import path from "node:path";
import { buildRuntimePayload, ensureDir, resolveContext, timestamp, writeState } from "./lib.js";
import { ensureAutoheal } from "./autoheal-lib.js";

function installRuntime(options = {}) {
  const { autoheal = process.platform === "darwin", quiet = false } = options;
  const ctx = resolveContext();
  const runtime = buildRuntimePayload(ctx);
  const markerStart = ctx.manifest.runtime.markerStart;
  const markerEnd = ctx.manifest.runtime.markerEnd;
  const original = fs.readFileSync(ctx.indexBundlePath, "utf8");

  if (original.includes(markerStart) && original.includes(markerEnd)) {
    const start = original.indexOf(markerStart);
    const end = original.indexOf(markerEnd, start + markerStart.length);
    const updated = `${original.slice(0, start)}${markerStart}\n${runtime}\n${markerEnd}${original.slice(end + markerEnd.length)}`;
    fs.writeFileSync(ctx.indexBundlePath, updated);
    if (!quiet) {
      console.log(`Updated injected runtime in ${ctx.indexBundle}`);
    }
  } else {
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

    if (!quiet) {
      console.log(`Injected runtime into OpenClaw ${ctx.openClawVersion}`);
      console.log(`Assets dir: ${ctx.assetsDir}`);
      console.log(`Target bundle: ${ctx.indexBundle}`);
      console.log(`Backup dir: ${backupDir}`);
    }
  }

  if (autoheal) {
    try {
      const result = ensureAutoheal({ quiet: true });
      if (!quiet && result.enabled) {
        console.log(`Auto-heal: enabled (${result.mode})`);
      }
    } catch (error) {
      if (!quiet) {
        console.warn(`Auto-heal: setup skipped (${String(error.message ?? error)})`);
      }
    }
  }

  return ctx;
}

export { installRuntime };
