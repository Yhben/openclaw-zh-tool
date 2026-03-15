# openclaw-zh-tool

`openclaw-zh-tool` is a community localization tool for the OpenClaw Control WebUI.

- Chinese guide: [README.zh-CN.md](./README.zh-CN.md)
- Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md)
- GitHub release draft: [docs/GITHUB_RELEASE_TEMPLATE_v0.3.0.md](./docs/GITHUB_RELEASE_TEMPLATE_v0.3.0.md)
- Pre-release checklist: [docs/PRE_RELEASE_CHECKLIST.md](./docs/PRE_RELEASE_CHECKLIST.md)
- Post-release guide: [docs/POST_RELEASE_GUIDE.md](./docs/POST_RELEASE_GUIDE.md)

## One-line install

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.sh | bash
```

Windows PowerShell:

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.ps1 -UseBasicParsing | iex
```

It injects a Chinese display-layer runtime into an installed OpenClaw frontend bundle so Chinese-speaking users can use the WebUI more easily without changing OpenClaw's runtime behavior.

This project is designed for people who want:

- a Chinese WebUI for OpenClaw
- a reversible install
- version-aware adaptive patching instead of hash-locked full asset replacement
- scan/report tools to find residual English UI text
- conservative auto-fix helpers for future OpenClaw updates

## What this tool does

This tool modifies only the WebUI display layer.

It can:

- locate a local OpenClaw installation
- find the current `index-*.js` frontend bundle automatically
- inject a Chinese runtime into that bundle
- back up the original bundle before patching
- restore the original bundle later
- verify whether the current injection is healthy
- scan routes, tabs, expanders, add forms, and some action buttons for residual English
- generate safe exact-match supplement translations
- separate review-tier candidates from safe auto-fixes
- export a unique residual-English list for follow-up cleanup

## What this tool does not do

This project does not change OpenClaw's runtime logic.

It does not modify:

- config keys
- API or RPC contracts
- agent IDs
- model IDs
- command names
- tool IDs
- file paths
- request payloads
- backend execution logic

If you install this tool correctly, OpenClaw should continue to behave the same way as before. The intended change is only what users see in the WebUI.

## Project status

- Verified OpenClaw version: `2026.3.12`
- Patch mode: adaptive runtime injection
- Current strategy: base runtime + generated supplements + custom supplements

Even if a future OpenClaw version is not in the verified list, the tool may still work because it targets the active `index-*.js` bundle dynamically rather than replacing a version-specific asset file set.

## Platform support

### Core support

- macOS: supported and used during development
- Windows: supported by the Node CLI, with PowerShell bootstrap scripts included
- Linux: expected to work when OpenClaw is installed in a detectable npm-global location

### Important caveats

- `install.sh` and `restore.sh` are for macOS/Linux shells
- `install.ps1` and `restore.ps1` are for Windows PowerShell
- browser scan commands require Playwright plus an available browser
- Windows support is implemented in the tooling, but should still be treated as needing more community verification than macOS

## How installation works

When you install, the tool does this:

1. find your OpenClaw installation
2. detect the active `dist/control-ui/assets/index-*.js` bundle
3. back up the original bundle
4. append the Chinese runtime payload between marker comments
5. write a local patch state file

It does not replace the whole `assets` directory.

That is important because OpenClaw asset filenames often include hashes and change between releases. Runtime injection is more resilient than shipping a single hard-coded replacement bundle.

## Quick start

### Clone and install from source

```bash
git clone https://github.com/Yhben/openclaw-zh-tool.git
cd openclaw-zh-tool
node scripts/install.js
```

### One-line install on macOS/Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.sh | bash
```

### One-line install on Windows PowerShell

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.ps1 -UseBasicParsing | iex
```

### Restore original files

```bash
node scripts/restore.js
```

### One-line restore on macOS/Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.sh | bash
```

### One-line restore on Windows PowerShell

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.ps1 -UseBasicParsing | iex
```

## Recommended usage flow

For most users, this is the intended workflow:

1. install the patch
2. refresh or restart OpenClaw if needed
3. run `doctor`
4. run `report` or `residuals` if you want to inspect leftover English
5. run `autofix` for safe exact-match supplements
6. review any remaining review-tier entries
7. promote review-tier entries if you accept them

## CLI commands

After cloning, you can use:

```bash
node bin/openclaw-zh.js install
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
node bin/openclaw-zh.js scan
node bin/openclaw-zh.js autofix
node bin/openclaw-zh.js promote-review
node bin/openclaw-zh.js restore
```

### Command summary

`install`

- injects the runtime into the active bundle

`status`

- shows install state, detected version, and active bundle

`verify`

- verifies marker presence, payload match, backup presence, and target bundle health

`doctor`

- runs structural checks
- runs browser-based scanning if possible
- reports residual English counts and candidate counts

`report`

- writes `openclaw-zh-report.json`
- includes health, scan results, and summary sections

`residuals`

- writes `openclaw-zh-residuals.json`
- exports the unique residual English strings still seen by the scanner

`scan`

- prints route-level scan counts to stdout

`autofix`

- generates safe exact-match translations into `supplements/generated-exact.json`
- writes review-tier items into `supplements/review-candidates.json`
- re-installs the runtime if the patch is already installed

`promote-review`

- moves review-approved translations into `supplements/custom-exact.json`
- useful when you want a human-approved translation to become part of the persistent exact supplement layer

`restore`

- restores the original bundle from backup

## Browser scan behavior

The scanner is not just checking top-level pages.

It can also:

- open route pages
- click tabs
- expand collapsible sections
- click add buttons
- click selected action buttons like edit/details/settings on supported routes

The scanner forces `zh-CN` in browser local storage before loading pages so the results reflect the Chinese UI mode rather than the default language.

By default, `doctor`, `report`, `scan`, and `residuals` target:

```text
http://127.0.0.1:18789
```

You can override that with:

```bash
OPENCLAW_CONTROL_URL=http://127.0.0.1:18789 node bin/openclaw-zh.js doctor
```

## Generated files

The tool may create these local files in the repo:

- `openclaw-zh-report.json`
- `openclaw-zh-residuals.json`
- `supplements/generated-exact.json`
- `supplements/review-candidates.json`
- `supplements/custom-exact.json`

### Meaning of supplement files

`supplements/generated-exact.json`

- safe exact-match translations generated by `autofix`

`supplements/review-candidates.json`

- translations that should be reviewed before permanent promotion

`supplements/custom-exact.json`

- manually accepted exact-match translations
- this is the stable human-approved supplement layer

## Report output

`report` writes a JSON file that includes:

- current install health
- active OpenClaw version
- active bundle name
- scan results
- summary counts
- top residual routes
- top safe auto-fix candidates
- top review candidates
- top unresolved leftovers

This is useful when users want to file issues or share the current localization state without sending screenshots only.

## Residual export

If you want to inspect exactly what English text is still visible to the scanner, use:

```bash
node scripts/residuals.js
```

or:

```bash
node bin/openclaw-zh.js residuals
```

That writes `openclaw-zh-residuals.json` and prints the top leftover strings to the terminal.

## Auto-fix workflow

Generate safe supplement fixes:

```bash
node scripts/autofix.js
```

This writes:

- `supplements/generated-exact.json` for safe exact-match auto-fixes
- `supplements/review-candidates.json` for items that should be reviewed before promotion

Promote all review candidates:

```bash
node scripts/promote-review.js
```

Promote selected review candidates only:

```bash
node scripts/promote-review.js "Some English Label" "Another Label"
```

Then re-install:

```bash
node bin/openclaw-zh.js install
```

## OpenClaw detection

The installer tries to detect OpenClaw in this order:

1. `OPENCLAW_DIR`
2. `npm root -g` + `/openclaw`
3. common macOS/Linux global npm locations
4. common Windows npm/global installation locations

If detection fails, set `OPENCLAW_DIR` manually and run the command again.

Example:

```bash
OPENCLAW_DIR=/path/to/openclaw node bin/openclaw-zh.js install
```

## Backup and restore

Before patching, the original bundle is copied into:

```text
<openclaw>/dist/control-ui/assets/.openclaw-zh-backup/<timestamp>/
```

Patch state is written into:

```text
<openclaw>/dist/control-ui/assets/.openclaw-zh-state.json
```

This makes the patch reversible.

## If the UI still shows old English after install

That does not always mean the patch failed.

Possible reasons:

- OpenClaw is still serving an older in-memory or cached frontend bundle
- the browser did not reload hard enough
- the running OpenClaw process needs a restart
- the text is a command snippet or technical literal that the scanner correctly leaves alone

Recommended order:

1. run `node bin/openclaw-zh.js verify`
2. hard-refresh the browser
3. restart the OpenClaw process if needed
4. run `node bin/openclaw-zh.js residuals`
5. check whether the leftover is a true UI label or a technical string

## Compatibility philosophy

This project is adaptive, not magic.

It is more resilient than a version-locked asset replacement because:

- it locates the active bundle automatically
- it injects a runtime payload instead of replacing all hashed assets
- it has scan/report/autofix workflows for future drift

But future OpenClaw releases can still require maintenance if:

- frontend structure changes heavily
- rendering logic changes
- OpenClaw moves away from the current bundle layout

## Notes

- This is not an official OpenClaw plugin.
- This is a community patching and localization tool.
- `autofix` is intentionally conservative.
- review-tier candidates are not auto-injected blindly.
- browser scanning depends on Playwright and an available browser.

## Development

Install dependencies for browser scanning:

```bash
npm install
```

Useful local commands:

```bash
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
```

## License

MIT
