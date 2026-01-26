from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

from backend.config import settings, setup_f1
from backend.routes.session_results import router as session_router
# Initialize FastF1 Cache
# This must happen before the app starts so all routes have access to it
setup_f1()

app = FastAPI(
    title="RaceEngi",
    description="A backend for fetching FastF1 data into a React frontend",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows your React app (on port 5173) to fetch data from Python (on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CLIENT_URL], # The URL of your Vite app
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, etc.
    allow_headers=["*"],
)

# 3. Include Routers
app.include_router(session_router, prefix="/api")

# 4. Root Endpoint
# Good for checking if the server is actually running
@app.get("/")
def read_root():
    return {"message": "FastF1 API is running. Go to /docs for Swagger UI."}