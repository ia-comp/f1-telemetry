from fastapi import HTTPException, APIRouter
from config import settings
from controllers.session_results import *

# Define the router
router = APIRouter()
# @router.get("/session_results/speed_trace/{year}/{gp}/{driver}")
# async def fetch_driver_speed_trace(year: int, gp: str, driver: str):
#     try:
#         data = get_qualifying_results(year, gp)
#         return data
#     except Exception as e:
#         # If FastF1 fails (e.g., wrong GP name), return a 400 error
#         raise HTTPException(status_code=400, detail=str(e))

@router.get("/session_results/{year}/{gp}")
async def fetch_qualifying_results(year: int, gp: str):
    if (year < EARLIEST_YEAR or year > LATEST_YEAR):
        raise HTTPException(status_code=400, detail=f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive")

    if (not gp):
        raise HTTPException(status_code=400, detail="Must select an event to load results")
    
    try:
        data = get_qualifying_results(year, gp)
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/session_results/{year}")
async def fetch_year_schedule(year: int):
    if (year < EARLIEST_YEAR or year > LATEST_YEAR):
        raise HTTPException(status_code=400, detail=f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive")

    try:
        data = get_year_schedule(year)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/status")
async def health_check():
    return {"status": "F1 Backend is online"}