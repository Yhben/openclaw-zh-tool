# Release Notes

## v0.3.0

Current public baseline for `openclaw-zh-tool`.

### Highlights

- adaptive runtime injection instead of full hash-locked asset replacement
- backup and restore workflow
- installation verification and diagnostics
- browser-based route scanning
- residual English export
- conservative auto-fix generation
- review-tier promotion workflow
- Windows PowerShell bootstrap scripts
- expanded README and Chinese documentation

### Core commands

```bash
node bin/openclaw-zh.js install
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
node bin/openclaw-zh.js autofix
node bin/openclaw-zh.js promote-review
node bin/openclaw-zh.js restore
```

### Verified OpenClaw version

- `2026.3.12`
- `2026.3.13`

### Compatibility notes

- designed to be more resilient across OpenClaw updates than static asset replacement
- still may require maintenance if OpenClaw changes frontend structure heavily
- currently strongest on macOS because that is where active validation was performed
- Windows support is implemented and documented, but should still be considered community-verified rather than fully field-verified

### Notes for users

- this is not an official OpenClaw plugin
- this is a community display-layer localization tool
- it does not modify config keys, APIs, RPCs, IDs, commands, or backend runtime logic
