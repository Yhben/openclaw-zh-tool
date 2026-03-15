# Changelog

All notable changes to `openclaw-zh-tool` will be documented in this file.

The format is intentionally lightweight and focused on real user-facing changes.

## [0.3.0] - 2026-03-15

### Added

- adaptive runtime injection against the active `index-*.js` bundle
- automatic backup and restore workflow
- installation state tracking
- integrity verification
- browser-based route scanning with tab, expander, add-button, and action-button coverage
- JSON reporting via `report`
- unique residual export via `residuals`
- conservative supplement generation via `autofix`
- review promotion flow via `promote-review`
- Windows PowerShell bootstrap scripts
- English and Chinese README files
- release notes

### Changed

- moved away from a version-locked full asset replacement approach
- refined residual scanning to ignore technical literals and mixed Chinese-plus-technical strings
- improved report summaries with top routes and candidate sections
- improved path detection with Windows-friendly locations

### Notes

- verified OpenClaw versions now include `2026.3.12` and `2026.3.13`
- future OpenClaw UI changes may still require maintenance updates
