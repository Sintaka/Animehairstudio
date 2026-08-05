@echo off
setlocal
cd /d "%~dp0"

rem ============================================================
rem  Anime Hair Studio - local dev server (Python static server)
rem  NOTE: do NOT open index.html via file:// - browser security
rem  blocks it. Serve the folder over http://127.0.0.1:8080/
rem ============================================================

rem Locate a Python interpreter (python preferred, then py launcher, then python3)
set "PYTHON_CMD="
where python >nul 2>nul && set "PYTHON_CMD=python"
if not defined PYTHON_CMD (
  where py >nul 2>nul && set "PYTHON_CMD=py -3"
)
if not defined PYTHON_CMD (
  where python3 >nul 2>nul && set "PYTHON_CMD=python3"
)
if not defined PYTHON_CMD (
  echo.
  echo Python was not found. Please install Python 3 and make sure it is on your PATH.
  echo.
  pause
  exit /b 1
)

echo.
echo Starting Anime Hair Studio at http://127.0.0.1:8080/
echo Press Ctrl+C in this window to stop the server.
echo.

rem Open the browser a moment after the server starts listening.
start "" cmd /c "timeout /t 1 /nobreak >nul & start "" http://127.0.0.1:8080/""

%PYTHON_CMD% -m http.server 8080 --bind 127.0.0.1
endlocal
