import { disableAutoheal } from "./autoheal-lib.js";

const quiet = process.argv.includes("--quiet");
const result = disableAutoheal({ quiet });

if (!quiet && !result.supported) {
  console.log("Auto-heal background service is not configured on this platform.");
}
