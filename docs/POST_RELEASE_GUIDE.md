# Post-Release Guide

This guide describes what to do after publishing a release of `openclaw-zh-tool`.

## Immediately after publishing

- verify the release page renders correctly
- verify install commands on the release page are correct
- verify README links still work
- verify the repository description and topics still look right

## Share the project

Use:

- `docs/SHARE_POSTS.md`
- `README.zh-CN.md`
- `README.md`

Suggested places:

- X / Twitter
- Telegram groups
- Discord communities
- GitHub Discussions or issues in related projects if appropriate
- Chinese AI / automation communities

## Ask users for useful feedback

The best feedback to request is:

- OpenClaw version
- operating system
- whether install / verify / doctor succeeded
- whether residual English remains
- whether Windows or Linux worked in real use

## When users report problems

Ask them for:

- `node bin/openclaw-zh.js verify`
- `node bin/openclaw-zh.js residuals`
- `openclaw-zh-report.json`
- screenshots if the issue is visual

## Good follow-up tasks after release

- add support notes for more OpenClaw versions
- reduce false positives in residual scanning
- improve Windows validation
- improve Linux validation
- promote useful review-tier translations
- update changelog and release notes for the next version

## Suggested maintenance rhythm

- when OpenClaw updates: run `doctor`, `report`, and `residuals`
- if safe candidates appear: run `autofix`
- if review candidates look correct: run `promote-review`
- publish a new release only after re-checking the verified version note
