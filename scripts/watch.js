import { collectHealth, describeHealingNeed, resolveContext } from "./lib.js";
import { installRuntime } from "./install-lib.js";

const rawInterval = process.argv[2] ?? process.env.OPENCLAW_ZH_WATCH_INTERVAL ?? "30";
const intervalSeconds = Math.max(5, Number(rawInterval) || 30);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Watching OpenClaw every ${intervalSeconds}s for upgrades or missing runtime...`);

  for (;;) {
    try {
      const ctx = resolveContext();
      const health = collectHealth(ctx);
      const reason = describeHealingNeed(health);
      if (reason) {
        console.log(`[${new Date().toISOString()}] Healing triggered: ${reason}`);
        installRuntime({ autoheal: false, quiet: true });
        console.log(`[${new Date().toISOString()}] Heal complete for ${ctx.openClawVersion}`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Watch error: ${String(error.message ?? error)}`);
    }

    await sleep(intervalSeconds * 1000);
  }
}

await main();
