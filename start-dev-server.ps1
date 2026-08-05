# ============================================================
#  Anime Hair Studio - local dev server (Python static server)
#  NOTE: do NOT open index.html via file:// - browser security
#  blocks it. Serve the folder over http://127.0.0.1:8080/
# ============================================================
param([switch]$NoOpen)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

# Locate a Python interpreter (python preferred, then py launcher, then python3)
$python = $null
foreach ($candidate in @("python", "py", "python3")) {
  if (Get-Command $candidate -ErrorAction SilentlyContinue) {
    $python = $candidate
    break
  }
}
if (-not $python) {
  Write-Host ""
  Write-Host "Python was not found. Please install Python 3 and make sure it is on your PATH." -ForegroundColor Red
  Write-Host ""
  Read-Host "Press Enter to exit"
  exit 1
}

$pythonArgs = @("-m", "http.server", "8080", "--bind", "127.0.0.1")
if ($python -eq "py") { $pythonArgs = @("-3") + $pythonArgs }

Write-Host ""
Write-Host "Starting Anime Hair Studio at http://127.0.0.1:8080/" -ForegroundColor Green
Write-Host "Press Ctrl+C in this window to stop the server."
Write-Host ""

# Open the browser a moment after the server starts listening.
if (-not $NoOpen) {
  Start-Process powershell -ArgumentList @(
    "-NoProfile",
    "-WindowStyle", "Hidden",
    "-Command", "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:8080/'"
  )
}

& $python @pythonArgs
