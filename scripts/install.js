import { installRuntime } from "./install-lib.js";

const skipAutoheal = process.argv.includes("--skip-autoheal") || process.env.OPENCLAW_ZH_SKIP_AUTOHEAL === "1";

installRuntime({
  autoheal: !skipAutoheal,
  quiet: false
});
