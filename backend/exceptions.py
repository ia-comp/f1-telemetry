from fastapi import HTTPException
from backend.config import settings

def validate_year(year: int):
  if (year < settings.EARLIEST_YEAR or year > settings.LATEST_YEAR):
    raise HTTPException(
        status_code=400, 
        detail=f"Selected year must be between {settings.EARLIEST_YEAR} and {settings.LATEST_YEAR} inclusive"
    )