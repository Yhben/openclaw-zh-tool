# Pre-Release Checklist

Use this checklist before publishing a new public release of `openclaw-zh-tool`.

## Repository state

- [ ] `main` is pushed to GitHub
- [ ] no unintended local changes remain
- [ ] README links work
- [ ] Chinese README exists and is current
- [ ] release notes are current
- [ ] changelog is current

## Core command checks

Run these locally against a real OpenClaw installation if possible:

```bash
node bin/openclaw-zh.js status
node bin/openclaw-zh.js verify
node bin/openclaw-zh.js doctor
node bin/openclaw-zh.js report
node bin/openclaw-zh.js residuals
```

Checklist:

- [ ] `status` prints the detected OpenClaw path and version
- [ ] `verify` passes after install
- [ ] `doctor` runs without crashing
- [ ] `report` writes `openclaw-zh-report.json`
- [ ] `residuals` writes `openclaw-zh-residuals.json`

## Install and restore checks

- [ ] `install` works from the repo
- [ ] `restore` works from the repo
- [ ] `install.sh` works on macOS/Linux
- [ ] `restore.sh` works on macOS/Linux
- [ ] `install.ps1` is present for Windows
- [ ] `restore.ps1` is present for Windows

## Documentation checks

- [ ] `README.md` clearly explains what the tool does
- [ ] `README.zh-CN.md` clearly explains installation and recovery in Chinese
- [ ] `CONTRIBUTING.md` is present
- [ ] `CHANGELOG.md` is present
- [ ] release draft text is ready
- [ ] share-post copy is ready

## GitHub checks

- [ ] repository description is set
- [ ] repository topics are set
- [ ] issue templates are present
- [ ] pull request template is present
- [ ] draft release exists

## Translation-quality checks

- [ ] residual list reflects real remaining UI text, not just technical literals
- [ ] obvious UI labels are already translated
- [ ] review-tier candidates are separated from safe auto-fix candidates
- [ ] custom exact supplements contain any intentionally promoted translations

## Final publish decision

- [ ] current release body has been reviewed
- [ ] verified OpenClaw version is correctly stated
- [ ] known limitations are documented
- [ ] ready to publish the GitHub draft release
