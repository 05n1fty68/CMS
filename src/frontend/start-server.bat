@echo off
echo Starting CMS Frontend Server...
echo.
echo Frontend will be available at: http://localhost:8080
echo Backend API should be running at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8080

