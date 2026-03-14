$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/Yhben/openclaw-zh-tool.git"
$WorkDir = Join-Path ([System.IO.Path]::GetTempPath()) ("openclaw-zh-tool." + [System.Guid]::NewGuid().ToString("N"))

try {
  Write-Host "Cloning openclaw-zh-tool into $WorkDir"
  git clone --depth=1 $RepoUrl $WorkDir | Out-Null
  Set-Location $WorkDir
  node scripts/restore.js
}
finally {
  if (Test-Path $WorkDir) {
    Remove-Item -Recurse -Force $WorkDir
  }
}
