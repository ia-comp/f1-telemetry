import fastf1
from fastf1.core import Session

def get_session(year: int, gp: str, session_type: str) -> Session:
    schedule = fastf1.get_event_schedule(year)

    season_events = set()
    for event in schedule.itertuples():
        season_events.add(event.EventName.removesuffix(" Grand Prix"))


    print(season_events)
    print("My gp", gp)
    if (gp not in season_events):
        raise Exception("Invalid event selected")
     
    session = fastf1.get_session(year, gp, session_type)
    if (not session):
        raise Exception("Get session results - Internal server error")
 
    return session