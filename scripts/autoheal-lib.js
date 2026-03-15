import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  ensureDir,
  getAutohealBaseDir,
  getAutohealErrLogPath,
  getAutohealLogDir,
  getAutohealOutLogPath,
  getAutohealScriptPath,
  getDefaultRepoUrl,
  getLaunchAgentLabel,
  getLaunchAgentPath
} from "./lib.js";

function isMac() {
  return process.platform === "darwin";
}

function getAutohealStatus() {
  if (!isMac()) {
    return {
      supported: false,
      enabled: false,
      mode: "manual-watch"
    };
  }

  const plistPath = getLaunchAgentPath();
  const scriptPath = getAutohealScriptPath();

  return {
    supported: true,
    enabled: fs.existsSync(plistPath) && fs.existsSync(scriptPath),
    mode: "launchagent",
    label: getLaunchAgentLabel(),
    plistPath,
    scriptPath,
    outLogPath: getAutohealOutLogPath(),
    errLogPath: getAutohealErrLogPath()
  };
}

function buildAutohealShellScript() {
  const repoUrl = getDefaultRepoUrl();
  return `#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

REPO_URL="${repoUrl}"
WORK_DIR="$(mktemp -d "\${TMPDIR:-/tmp}/openclaw-zh-tool.autoheal.XXXXXX")"
LOCK_DIR="$HOME/.openclaw-zh-tool/autoheal.lock"

cleanup() {
  rm -rf "$WORK_DIR"
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}
trap cleanup EXIT

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  exit 0
fi

git clone --depth=1 "$REPO_URL" "$WORK_DIR" >/dev/null 2>&1 || exit 0
cd "$WORK_DIR"
node scripts/heal.js --quiet >/dev/null 2>&1 || exit 0
`;
}

function buildLaunchAgentPlist() {
  const label = getLaunchAgentLabel();
  const scriptPath = getAutohealScriptPath();
  const outLogPath = getAutohealOutLogPath();
  const errLogPath = getAutohealErrLogPath();

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${label}</string>
    <key>ProgramArguments</key>
    <array>
      <string>${scriptPath}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>300</integer>
    <key>StandardOutPath</key>
    <string>${outLogPath}</string>
    <key>StandardErrorPath</key>
    <string>${errLogPath}</string>
    <key>ProcessType</key>
    <string>Background</string>
    <key>AbandonProcessGroup</key>
    <true/>
  </dict>
</plist>
`;
}

function safeLaunchctl(...args) {
  try {
    execFileSync("launchctl", args, { stdio: "ignore" });
  } catch {}
}

function ensureAutoheal(options = {}) {
  const { quiet = false } = options;
  if (!isMac()) {
    return {
      enabled: false,
      supported: false,
      mode: "manual-watch"
    };
  }

  const baseDir = getAutohealBaseDir();
  const logDir = getAutohealLogDir();
  const scriptPath = getAutohealScriptPath();
  const plistPath = getLaunchAgentPath();
  const label = getLaunchAgentLabel();
  const uid = String(process.getuid?.() ?? "");

  ensureDir(baseDir);
  ensureDir(logDir);
  ensureDir(path.dirname(plistPath));

  fs.writeFileSync(scriptPath, buildAutohealShellScript());
  fs.chmodSync(scriptPath, 0o755);
  fs.writeFileSync(plistPath, buildLaunchAgentPlist());

  safeLaunchctl("bootout", `gui/${uid}`, plistPath);
  safeLaunchctl("bootstrap", `gui/${uid}`, plistPath);
  safeLaunchctl("enable", `gui/${uid}/${label}`);
  safeLaunchctl("kickstart", "-k", `gui/${uid}/${label}`);

  if (!quiet) {
    console.log(`Auto-heal enabled via LaunchAgent: ${label}`);
    console.log(`LaunchAgent plist: ${plistPath}`);
  }

  return {
    enabled: true,
    supported: true,
    mode: "launchagent",
    label,
    plistPath,
    scriptPath,
    outLogPath: getAutohealOutLogPath(),
    errLogPath: getAutohealErrLogPath()
  };
}

function disableAutoheal(options = {}) {
  const { quiet = false } = options;
  if (!isMac()) {
    return {
      enabled: false,
      supported: false,
      mode: "manual-watch"
    };
  }

  const plistPath = getLaunchAgentPath();
  const scriptPath = getAutohealScriptPath();
  const label = getLaunchAgentLabel();
  const uid = String(process.getuid?.() ?? "");

  safeLaunchctl("bootout", `gui/${uid}`, plistPath);
  safeLaunchctl("disable", `gui/${uid}/${label}`);

  fs.rmSync(plistPath, { force: true });
  fs.rmSync(scriptPath, { force: true });

  if (!quiet) {
    console.log(`Auto-heal disabled: ${label}`);
  }

  return {
    enabled: false,
    supported: true,
    mode: "launchagent",
    label
  };
}

export {
  disableAutoheal,
  ensureAutoheal,
  getAutohealStatus
};
