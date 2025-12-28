@echo off
REM CuraSense Diagnosis - Dual Server Launcher
REM This script starts both the main dashboard and X-ray analysis servers

echo ============================================
echo CuraSense Diagnosis - Starting Servers
echo ============================================
echo.

REM Start Main Dashboard Server (Port 8000)
echo [1/2] Starting Main Dashboard Server on port 8000...
start "CuraSense Dashboard" cmd /k "cd /d d:\curasense_diagnosis_ml_model\curasense-ml && conda activate curasense_env && uvicorn app:app --reload --port 8000"

REM Wait a moment for first server to initialize
timeout /t 3 /nobreak >nul

REM Start X-Ray Analysis Server (Port 8001)
echo [2/2] Starting X-Ray Analysis Server on port 8001...
start "X-Ray Analysis API" cmd /k "cd /d d:\curasense_diagnosis_ml_model\ml-fastapi && conda activate curasense_vision_env && uvicorn main:app --reload --port 8001"

echo.
echo ============================================
echo Both servers are starting...
echo.
echo Main Dashboard: http://localhost:8000
echo X-Ray API: http://localhost:8001
echo.
echo Press any key to open the dashboard in your browser...
pause >nul

REM Open dashboard in default browser
start http://localhost:8000

echo.
echo Dashboard opened in browser!
echo To stop servers, close the opened terminal windows.
echo.
pause
