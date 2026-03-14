# openclaw-zh-tool v0.3.0

`openclaw-zh-tool` is a community Chinese localization tool for the OpenClaw Control WebUI.

It patches only the display layer of an installed OpenClaw frontend bundle so Chinese-speaking users can use the WebUI more easily without changing OpenClaw runtime behavior.

## Highlights

- adaptive runtime injection against the active OpenClaw `index-*.js` bundle
- reversible backup and restore workflow
- installation verification and doctor diagnostics
- browser-based route scanning across pages, tabs, expanders, add forms, and selected action buttons
- residual-English export
- conservative auto-fix generation
- review-tier promotion workflow
- Windows PowerShell bootstrap scripts
- English and Chinese documentation

## Quick install

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.sh | bash
```

Windows PowerShell:

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.ps1 -UseBasicParsing | iex
```

## Quick restore

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.sh | bash
```

Windows PowerShell:

```powershell
iwr https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.ps1 -UseBasicParsing | iex
```

## Suggested first steps after install

```bash
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js residuals
```

If the UI still shows old English after patching:

1. hard-refresh the browser
2. restart the running OpenClaw process if needed
3. re-run `verify`
4. inspect `residuals`

## Verified OpenClaw version

- `2026.3.12`

## Important notes

- this is not an official OpenClaw plugin
- this tool patches only the display layer
- it does not modify backend runtime logic, config keys, API/RPC contracts, IDs, or commands
- future OpenClaw releases may still require compatibility updates

## Useful commands

```bash
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
node bin/openclaw-zh.js autofix
node bin/openclaw-zh.js promote-review
node bin/openclaw-zh.js restore
```

## More information

- English guide: `README.md`
- Chinese guide: `README.zh-CN.md`
- Release notes: `RELEASE_NOTES.md`
- Changelog: `CHANGELOG.md`
