@echo off
cd /d "%~dp0"
start "" /min cmd /c "timeout /t 1 /nobreak >nul & start "" http://127.0.0.1:8080/""
python -m http.server 8080 --bind 127.0.0.1
