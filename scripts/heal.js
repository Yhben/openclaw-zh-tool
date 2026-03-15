import { collectHealth, describeHealingNeed, resolveContext } from "./lib.js";
import { installRuntime } from "./install-lib.js";

function main() {
  const quiet = process.argv.includes("--quiet");
  const ctx = resolveContext();
  const health = collectHealth(ctx);
  const reason = describeHealingNeed(health);

  if (!reason) {
    if (!quiet) {
      console.log(`OpenClaw ${health.openClawVersion} is healthy; no re-install needed.`);
    }
    return;
  }

  if (!quiet) {
    console.log(`Detected drift: ${reason}`);
  }

  installRuntime({ autoheal: false, quiet });

  if (!quiet) {
    console.log(`Healed OpenClaw ${ctx.openClawVersion}`);
  }
}

main();
