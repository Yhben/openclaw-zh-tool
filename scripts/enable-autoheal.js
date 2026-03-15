import { ensureAutoheal } from "./autoheal-lib.js";

const quiet = process.argv.includes("--quiet");
const result = ensureAutoheal({ quiet });

if (!quiet && !result.supported) {
  console.log("Auto-heal background service is currently implemented for macOS LaunchAgent. Use `watch` on other platforms.");
}
