import uvicorn

if __name__ == "__main__":
    # Runs the FastAPI backend application on port 8000 with auto-reload
    print("[Server] Starting AI Business Digital Twin Backend...")
    print("[Server] API Documentation will be available at: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

