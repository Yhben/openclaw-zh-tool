# openclaw-zh-tool

OpenClaw Control WebUI community Chinese runtime injector.

This project injects a Chinese display-layer runtime into your installed OpenClaw WebUI and provides:

- one-command install
- automatic backup before patching
- restore to original files
- status check
- integrity verification
- doctor diagnostics
- JSON report output
- browser-based residual English scan

This project only patches display-layer frontend assets. It does not modify runtime logic, config keys, API/RPC contracts, IDs, commands, or model names.

## Compatibility

- Verified on OpenClaw `2026.3.12`
- Other versions may also work because the installer targets the current `index-*.js` bundle automatically instead of replacing version-specific asset hashes

## Quick start

```bash
git clone https://github.com/Yhben/openclaw-zh-tool.git
cd openclaw-zh-tool
node scripts/install.js
```

One-line install:

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/install.sh | bash
```

Restore original files:

```bash
node scripts/restore.js
```

One-line restore:

```bash
curl -fsSL https://raw.githubusercontent.com/Yhben/openclaw-zh-tool/main/restore.sh | bash
```

Check current status:

```bash
node scripts/status.js
```

Verify installation integrity:

```bash
node scripts/verify.js
```

Run diagnostics:

```bash
node scripts/doctor.js
```

Write a JSON report:

```bash
node scripts/report.js
```

Run a scan summary:

```bash
node scripts/scan-cli.js
```

Install dependencies for browser scanning:

```bash
npm install
```

## How it works

The installer:

1. locates your local OpenClaw installation
2. finds the active `index-*.js` frontend bundle in `dist/control-ui/assets`
3. backs up the original bundle
4. appends a Chinese translation runtime to the end of that bundle

This is safer across versions than replacing hash-locked asset files.

## CLI

After cloning, you can also use:

```bash
node bin/openclaw-zh.js install
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js scan
node bin/openclaw-zh.js restore
```

`doctor` and `report` try to scan the running OpenClaw WebUI at `http://127.0.0.1:18789` by default.
You can override that with:

```bash
OPENCLAW_CONTROL_URL=http://127.0.0.1:18789 node bin/openclaw-zh.js doctor
```

## How OpenClaw detection works

The installer tries these paths in order:

1. `OPENCLAW_DIR` if you provide it
2. `npm root -g` + `/openclaw`
3. common global npm locations

If the installed OpenClaw version is not in the verified list, the installer still works in adaptive mode and reports that the version is unverified.

## Backup and restore

Before patching, the installer copies the original bundle into:

- `<openclaw>/dist/control-ui/assets/.openclaw-zh-backup/<timestamp>/`

It also writes state to:

- `<openclaw>/dist/control-ui/assets/.openclaw-zh-state.json`

## Notes

- This is not an official OpenClaw plugin.
- This tool is adaptive, but unverified future OpenClaw versions may still need runtime updates.
- If OpenClaw changes its frontend structure heavily, a newer `openclaw-zh-tool` release may still be required.

## License

MIT
