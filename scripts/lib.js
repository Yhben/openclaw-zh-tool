import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "manifest.json"), "utf8"));

function candidateOpenClawDirs() {
  const candidates = [];
  if (process.env.OPENCLAW_DIR) {
    candidates.push(process.env.OPENCLAW_DIR);
  }

  try {
    const npmRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
    if (npmRoot) {
      candidates.push(path.join(npmRoot, "openclaw"));
    }
  } catch {}

  candidates.push(
    "/usr/local/lib/node_modules/openclaw",
    "/opt/homebrew/lib/node_modules/openclaw",
    path.join(process.env.HOME ?? "", ".npm-global/lib/node_modules/openclaw")
  );

  return [...new Set(candidates.filter(Boolean))];
}

function findOpenClawDir() {
  for (const dir of candidateOpenClawDirs()) {
    const packageJsonPath = path.join(dir, "package.json");
    const assetsDir = path.join(dir, "dist/control-ui/assets");
    if (fs.existsSync(packageJsonPath) && fs.existsSync(assetsDir)) {
      return dir;
    }
  }
  return null;
}

function getOpenClawVersion(openClawDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(openClawDir, "package.json"), "utf8"));
  return pkg.version;
}

function getAssetsDir(openClawDir) {
  return path.join(openClawDir, "dist/control-ui/assets");
}

function getRuntimePath() {
  return path.join(repoRoot, manifest.runtime.file);
}

function getStatePath(openClawDir) {
  return path.join(getAssetsDir(openClawDir), ".openclaw-zh-state.json");
}

function readState(openClawDir) {
  const statePath = getStatePath(openClawDir);
  if (!fs.existsSync(statePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(statePath, "utf8"));
}

function writeState(openClawDir, state) {
  fs.writeFileSync(getStatePath(openClawDir), JSON.stringify(state, null, 2));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function findIndexBundle(assetsDir) {
  const files = fs.readdirSync(assetsDir).filter((file) => /^index-.*\.js$/.test(file));
  if (files.length === 0) {
    throw new Error(`No index bundle found in ${assetsDir}`);
  }
  files.sort();
  return files[0];
}

function resolveContext() {
  const openClawDir = findOpenClawDir();
  if (!openClawDir) {
    throw new Error("OpenClaw installation not found. Set OPENCLAW_DIR or install OpenClaw globally with npm.");
  }

  const openClawVersion = getOpenClawVersion(openClawDir);
  const assetsDir = getAssetsDir(openClawDir);
  const indexBundle = findIndexBundle(assetsDir);
  const runtimePath = getRuntimePath();

  return {
    repoRoot,
    manifest,
    openClawDir,
    openClawVersion,
    assetsDir,
    indexBundle,
    indexBundlePath: path.join(assetsDir, indexBundle),
    runtimePath,
    statePath: getStatePath(openClawDir)
  };
}

export {
  ensureDir,
  findIndexBundle,
  readState,
  resolveContext,
  timestamp,
  writeState
};
