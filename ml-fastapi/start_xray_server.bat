@echo off
echo Starting X-Ray Analysis Server...
cd /d d:\curasense_diagnosis_ml_model\ml-fastapi
call conda activate curasense_vision_env
echo.
echo Server starting on http://localhost:8001
echo.
uvicorn main:app --reload --port 8001
pause
