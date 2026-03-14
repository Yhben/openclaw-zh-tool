#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/Yhben/openclaw-zh-tool.git"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/openclaw-zh-tool.XXXXXX")"

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

echo "Cloning openclaw-zh-tool into $WORK_DIR"
git clone --depth=1 "$REPO_URL" "$WORK_DIR" >/dev/null 2>&1

cd "$WORK_DIR"
node scripts/install.js
