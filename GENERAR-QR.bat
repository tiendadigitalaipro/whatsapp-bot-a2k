@echo off
cd /d "%~dp0"
title ZYNC BOT — Generando QR...
echo.
echo =====================================================
echo     Generando QR de WhatsApp como imagen...
echo =====================================================
echo.
node generar-qr.js
pause
