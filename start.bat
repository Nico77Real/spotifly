@echo off
echo ===============================================
echo   SPOTIFLY 2.0 - Music Streaming App
echo ===============================================
echo.
echo Avvio del server backend e dell'applicazione...
echo.

cd /d "%~dp0"

start cmd /k "npm run server"
timeout /t 3 /nobreak >nul
start cmd /k "npm run dev"
timeout /t 5 /nobreak >nul
npm run electron

pause
