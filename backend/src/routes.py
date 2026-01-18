from fastapi import APIRouter, HTTPException
from home_page import get_qualifying_results

# Define the router
router = APIRouter()

@router.get("/qualifying_results/{year}/{gp}")
async def fetch_drivers(year: int, gp: str):
    try:
        data = get_qualifying_results(year, gp)
        return data
    except Exception as e:
        # If FastF1 fails (e.g., wrong GP name), return a 400 error
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status")
async def health_check():
    return {"status": "F1 Backend is online"}