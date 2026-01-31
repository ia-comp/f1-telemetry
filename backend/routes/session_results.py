from fastapi import HTTPException, APIRouter
from backend.controllers.session_results import *
from backend.exceptions import validate_year

# Define the router
router = APIRouter()

@router.get("/session_results/telemetry/speed_trace/{year}/{gp}/{driver}")
async def fetch_driver_speed_trace(year: int, gp: str, driver: str):
    validate_year(year)

    if (not gp):
        raise HTTPException(status_code=400, detail="Must select an event to load speed trace")
    
    if (not driver):
        raise HTTPException(status_code=400, detail="Must select a driver to load speed trace")
    try:
        data = plot_speed_trace(year, gp, driver)
        return data
    except Exception as e:
        # If FastF1 fails (e.g., wrong GP name), return a 400 error
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/session_results/{year}/{gp}")
async def fetch_qualifying_results(year: int, gp: str):
    validate_year(year)

    if (not gp):
        raise HTTPException(status_code=400, detail="Must select an event to load results")
    
    try:
        data = get_qualifying_results(year, gp)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/session_results/{year}")
async def fetch_year_schedule(year: int):
    validate_year(year)
    try:
        data = get_year_schedule(year)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/status")
async def health_check():
    return {"status": "F1 Backend is online"}