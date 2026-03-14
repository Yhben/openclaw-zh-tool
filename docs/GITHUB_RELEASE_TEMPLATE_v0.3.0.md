# openclaw-zh-tool v0.3.0

Community Chinese localization tool for the OpenClaw Control WebUI.

## What this release includes

- adaptive runtime injection against the active OpenClaw `index-*.js` bundle
- backup and restore workflow
- verification and diagnostics
- browser-based route scanning
- residual-English export
- conservative auto-fix generation
- review-tier promotion workflow
- Windows PowerShell bootstrap scripts
- English and Chinese README files

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

## Verified OpenClaw version

- `2026.3.12`

## Important notes

- this is not an official OpenClaw plugin
- this tool patches only the display layer
- it does not modify backend runtime logic, config keys, API/RPC contracts, IDs, or commands
- future OpenClaw releases may still require compatibility updates

## Useful commands

```bash
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
node bin/openclaw-zh.js autofix
```
