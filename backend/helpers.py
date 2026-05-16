import fastf1
from fastf1.core import Session

def get_session(year: int, gp: int, session_type: str) -> Session:
    session = fastf1.get_session(year, gp, session_type)
    if not session:
        raise Exception("Get session results - Internal server error")
    
    return session