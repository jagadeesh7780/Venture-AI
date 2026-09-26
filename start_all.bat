@echo off
echo ========================================================
echo Starting AI Business Digital Twin (Backend + Frontend)
echo ========================================================

:: Start Backend in a new terminal window
echo Starting FastAPI Backend Server on port 8000...
start "AI Business Backend (FastAPI)" cmd /k "cd /d e:\aibusiness\backend && .\venv\Scripts\activate && python run.py"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak > nul

:: Start Frontend in a new terminal window
echo Starting Vite React Frontend on port 5173...
start "AI Business Frontend (Vite)" cmd /k "cd /d e:\aibusiness\frontend && npm run dev"

echo ========================================================
echo Both servers are launching!
echo Backend:  http://localhost:8000 (API Docs: http://localhost:8000/docs)
echo Frontend: http://localhost:5173
echo ========================================================
