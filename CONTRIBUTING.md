# Contributing

Thanks for contributing to `openclaw-zh-tool`.

This project is a community localization and compatibility tool for the OpenClaw WebUI. The goal is to improve Chinese usability without changing OpenClaw runtime behavior.

## Contribution priorities

The highest-value contributions are:

- improving translation coverage for real OpenClaw UI text
- improving adaptive compatibility across OpenClaw versions
- reducing false positives in scan/report output
- improving Windows and Linux compatibility
- improving documentation and issue reporting quality

## Ground rules

Please keep these constraints intact:

- do not change OpenClaw runtime logic
- do not change config keys, RPC/API names, IDs, command names, or payload structures
- prefer display-layer translation only
- prefer reversible changes
- prefer conservative auto-fix behavior over aggressive rewriting

## Recommended workflow

1. install dependencies
2. run the tool against a local OpenClaw installation
3. verify the patch
4. scan for residual English
5. make a focused change
6. re-run verify and residual checks

Useful commands:

```bash
npm install
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
```

## Translation contributions

When adding translations:

- prefer exact matches for short UI labels
- use review-tier promotion for strings that need human judgement
- avoid translating technical command snippets unless they are clearly meant for end-user display
- avoid breaking mixed strings that intentionally preserve technical identifiers like `URL`, `WebSocket`, `token`, or `Control UI`

## Bug reports

If you file an issue, include:

- operating system
- OpenClaw version
- whether the patch is installed
- output from `node bin/openclaw-zh.js verify`
- output from `node bin/openclaw-zh.js residuals`
- screenshots if the issue is visual

If possible, attach:

- `openclaw-zh-report.json`
- `openclaw-zh-residuals.json`

## Pull requests

Please keep pull requests narrow and clearly scoped.

Good PR examples:

- add missing translations for one OpenClaw page
- improve one scan false-positive rule
- improve one OS detection path
- improve one documentation area

## Not in scope

These changes are generally out of scope:

- modifying OpenClaw backend logic
- adding unrelated UI redesigns
- translating model IDs, tool IDs, agent IDs, or protocol names
- bundling private or proprietary OpenClaw assets
