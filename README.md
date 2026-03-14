# openclaw-zh-tool

OpenClaw Control WebUI community Chinese patch installer.

This project packages a tested Chinese UI patch for OpenClaw `2026.3.12` and provides:

- one-command install
- automatic backup before patching
- restore to original files
- status check

This project only patches display-layer frontend assets. It does not modify runtime logic, config keys, API/RPC contracts, IDs, commands, or model names.

## Supported version

- OpenClaw `2026.3.12`

## Quick start

```bash
git clone https://github.com/Yhben/openclaw-zh-tool.git
cd openclaw-zh-tool
node scripts/install.js
```

Restore original files:

```bash
node scripts/restore.js
```

Check current status:

```bash
node scripts/status.js
```

## What gets patched

The installer replaces these frontend asset bundles inside your local OpenClaw installation:

- `index-CenotFkT.js`
- `nodes-Bel0FC94.js`
- `agents-BaF8a7Ki.js`
- `skills-CMWvmhzG.js`
- `skills-shared-BHEhPazJ.js`
- `logs-CDgUyuPX.js`

## How detection works

The installer tries these paths in order:

1. `OPENCLAW_DIR` if you provide it
2. `npm root -g` + `/openclaw`
3. common global npm locations

If the installed OpenClaw version is not supported, the installer stops instead of applying a risky patch.

## Backup and restore

Before patching, the installer copies original asset files into:

- `<openclaw>/dist/control-ui/assets/.openclaw-zh-backup/<timestamp>/`

It also writes state to:

- `<openclaw>/dist/control-ui/assets/.openclaw-zh-state.json`

## Notes

- This is not an official OpenClaw plugin.
- This is a version-locked community patch package.
- After upgrading OpenClaw, you will likely need a newer patch release.

## License

MIT
