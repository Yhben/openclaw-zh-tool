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
    path.join(process.env.HOME ?? "", ".npm-global/lib/node_modules/openclaw"),
    path.join(process.env.APPDATA ?? "", "npm/node_modules/openclaw"),
    path.join(process.env.ProgramFiles ?? "", "nodejs/node_modules/openclaw"),
    path.join(process.env.ProgramFiles ?? "", "nodejs/node_modules/npm/node_modules/openclaw"),
    path.join(process.env.LOCALAPPDATA ?? "", "Programs/openclaw")
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

function getSupplementPaths() {
  return (manifest.supplements?.exactFiles ?? []).map((file) => path.join(repoRoot, file));
}

function getStatePath(openClawDir) {
  return path.join(getAssetsDir(openClawDir), ".openclaw-zh-state.json");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
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

function isVerifiedVersion(manifestValue, version) {
  return manifestValue.verifiedOpenClawVersions.includes(version);
}

function readRuntime(ctx) {
  return readText(ctx.runtimePath).trim();
}

function readSupplementMaps(ctx) {
  const merged = {};
  for (const supplementPath of getSupplementPaths()) {
    if (!fileExists(supplementPath)) continue;
    const parsed = JSON.parse(readText(supplementPath));
    Object.assign(merged, parsed.exact ?? {});
  }
  return merged;
}

function buildSupplementRuntime(ctx) {
  const exact = readSupplementMaps(ctx);
  const entries = Object.entries(exact).filter(([key, value]) => key && value && key !== value);
  if (entries.length === 0) {
    return "";
  }

  return [
    "(()=>{",
    `const exact=new Map(${JSON.stringify(entries)});`,
    "const observedRoots=new WeakSet();",
    "try{window.__openclawZhSupplement={loaded:true,exactCount:exact.size,ts:Date.now(),runs:0,lastChanges:0,lastMatches:[]}}catch{}",
    "const attrNames=[\"placeholder\",\"title\",\"aria-label\",\"label\",\"data-label\",\"description\",\"data-description\",\"headline\",\"caption\",\"helper-text\"];",
    "function ready(){try{return localStorage.getItem(\"openclaw.i18n.locale\")===\"zh-CN\"}catch{return!1}}",
    "function translate(text){if(!text||!/[\\u0041-\\u005A\\u0061-\\u007A]/.test(text))return text;const trimmed=text.trim();if(!exact.has(trimmed))return text;return text.replace(trimmed,exact.get(trimmed));}",
    "function queryAll(root,selector){return root&&root.querySelectorAll?root.querySelectorAll(selector):[]}",
    "function attrSelector(){return attrNames.map(name=>`[${name}]`).join(\",\")}",
    "function noteMatch(value,matches){if(!value)return;const trimmed=value.trim();if(!trimmed||matches.includes(trimmed))return;matches.push(trimmed);if(matches.length>12)matches.shift()}",
    "function applyAttrs(root,state){for(const element of queryAll(root,attrSelector())){for(const attr of attrNames){const value=element.getAttribute(attr);if(!value)continue;const translated=translate(value);if(translated!==value){element.setAttribute(attr,translated);state.changed++;noteMatch(value,state.matches)}}}}",
    "function applyText(root,state){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;for(;node=walker.nextNode();){const parent=node.parentElement;if(!parent||/^(SCRIPT|STYLE|TEXTAREA)$/.test(parent.tagName)||parent.closest(\".log-stream\"))continue;const translated=translate(node.nodeValue||\"\");if(translated!==node.nodeValue){noteMatch(node.nodeValue||\"\",state.matches);node.nodeValue=translated;state.changed++}}}",
    "function applyDirectText(root,state){const elements=root===document?[document.documentElement,...queryAll(document,\"*\")]:[root,...queryAll(root,\"*\")];for(const element of elements){if(!element||/^(SCRIPT|STYLE|TEXTAREA)$/.test(element.tagName)||element.closest?.(\".log-stream\"))continue;for(const node of Array.from(element.childNodes||[])){if(node.nodeType!==Node.TEXT_NODE)continue;const translated=translate(node.nodeValue||\"\");if(translated!==node.nodeValue){noteMatch(node.nodeValue||\"\",state.matches);node.nodeValue=translated;state.changed++}}}}",
    "function forEachShadowRoot(root,fn){for(const element of queryAll(root,\"*\")){if(element.shadowRoot)fn(element.shadowRoot);}}",
    "function observeRoot(root){if(!root||observedRoots.has(root))return;observedRoots.add(root);new MutationObserver(()=>tick()).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrNames});}",
    "function processRoot(root,state){if(!root)return;observeRoot(root);applyText(root,state);applyDirectText(root,state);applyAttrs(root,state);forEachShadowRoot(root,shadow=>processRoot(shadow,state))}",
    "let queued=false;",
    "function tick(){if(queued||!ready())return;queued=true;requestAnimationFrame(()=>{queued=false;const state={changed:0,matches:[]};processRoot(document,state);processRoot(document.querySelector(\"main\")||document.body,state);try{window.__openclawZhSupplement.runs=(window.__openclawZhSupplement.runs||0)+1;window.__openclawZhSupplement.lastChanges=state.changed;window.__openclawZhSupplement.lastMatches=state.matches}catch{}});}",
    "const attachShadow=Element.prototype.attachShadow;Element.prototype.attachShadow=function(init){const shadow=attachShadow.call(this,init);if(ready())processRoot(shadow);return shadow;};",
    "observeRoot(document);",
    "new MutationObserver(tick).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attrNames});",
    "document.readyState===\"loading\"?document.addEventListener(\"DOMContentLoaded\",tick,{once:true}):tick();",
    "addEventListener(\"popstate\",tick);",
    "setInterval(tick,1200);",
    "})();"
  ].join("");
}

function buildRuntimePayload(ctx) {
  const segments = [readRuntime(ctx)];
  const supplementRuntime = buildSupplementRuntime(ctx);
  if (supplementRuntime) {
    segments.push(supplementRuntime);
  }
  return segments.join("\n");
}

function bundleContainsRuntime(ctx) {
  const text = readText(ctx.indexBundlePath);
  return text.includes(ctx.manifest.runtime.markerStart) && text.includes(ctx.manifest.runtime.markerEnd);
}

function bundleContainsExpectedRuntime(ctx) {
  const text = readText(ctx.indexBundlePath);
  const expected = buildRuntimePayload(ctx);
  return text.includes(expected);
}

function collectHealth(ctx) {
  const state = readState(ctx.openClawDir);
  const markerInjected = bundleContainsRuntime(ctx);
  const runtimeMatches = markerInjected ? bundleContainsExpectedRuntime(ctx) : false;
  const backupDirExists = state?.backupDir ? fileExists(state.backupDir) : false;
  const targetFileExists = state?.targetFile ? fileExists(path.join(ctx.assetsDir, state.targetFile)) : true;
  const indexBundleExists = fileExists(ctx.indexBundlePath);

  return {
    openClawDir: ctx.openClawDir,
    openClawVersion: ctx.openClawVersion,
    verifiedVersion: isVerifiedVersion(ctx.manifest, ctx.openClawVersion),
    indexBundle: ctx.indexBundle,
    indexBundleExists,
    statePresent: Boolean(state),
    markerInjected,
    runtimeMatches,
    backupDirExists,
    targetFileExists,
    state
  };
}

export {
  buildRuntimePayload,
  bundleContainsExpectedRuntime,
  bundleContainsRuntime,
  collectHealth,
  ensureDir,
  findIndexBundle,
  fileExists,
  readState,
  readRuntime,
  readText,
  resolveContext,
  timestamp,
  writeState
};
