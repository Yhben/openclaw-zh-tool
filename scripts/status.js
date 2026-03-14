import fs from "node:fs";
import { readState, resolveContext } from "./lib.js";

function main() {
  const ctx = resolveContext();
  const state = readState(ctx.openClawDir);
  const verified = ctx.manifest.verifiedOpenClawVersions.includes(ctx.openClawVersion);

  console.log(`OpenClaw dir: ${ctx.openClawDir}`);
  console.log(`OpenClaw version: ${ctx.openClawVersion}`);
  console.log(`Verified version: ${verified ? "yes" : "no"}`);
  console.log(`Injection target: ${ctx.indexBundle}`);

  if (!state) {
    console.log("Patch status: not installed");
    process.exit(0);
  }

  const allFilesPresent = state.files.every((file) => fs.existsSync(`${ctx.assetsDir}/${file}`));
  console.log(`Patch status: installed`);
  console.log(`Mode: ${state.mode ?? "unknown"}`);
  console.log(`Installed at: ${state.installedAt}`);
  console.log(`Backup dir: ${state.backupDir}`);
  console.log(`Files present: ${allFilesPresent ? "yes" : "no"}`);
}

main();
