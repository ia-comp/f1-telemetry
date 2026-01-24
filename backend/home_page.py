import pandas as pd
import fastf1
from fastf1.core import Laps

# This function converts a driver's fastest lap into a string with format
#  min:sec:ms eg. '1:12.345'
def format_laptime(td):
    if pd.notna(td):
        secs = td.total_seconds()
        return f"{int(secs // 60)}:{int(secs % 60):02d}.{int((secs % 1) * 1000):03d}"
    return None

# This function returns all races scheduled for a given year
def get_year_schedule(year: int):
    schedule = fastf1.get_event_schedule(year)

    # # get race names and round number
    list_races = list()
    for event in schedule.itertuples():
        list_races.append({
            "round": int(event.RoundNumber),
            "name": event.EventName,
        }) 
    return list_races
 
def get_qualifying_results(year: int, gp: str):
    # load a session and its telemetry data
    session = fastf1.get_session(year, gp, 'Q')
    session.load(telemetry=False, weather=False)
    drivers = pd.unique(session.laps['Driver'])

    # # get drivers fastest laps
    list_fastest_laps = list()
    for drv in drivers:
        drvs_fastest_lap = session.laps.pick_drivers(drv).pick_fastest()
        list_fastest_laps.append(drvs_fastest_lap)
    
    fastest_laps = Laps(list_fastest_laps) \
        .sort_values(by='LapTime') \
        .reset_index(drop=True)

    # display laptime delta to pole
    pole_lap = fastest_laps.pick_fastest()
    fastest_laps['LapTimeDelta'] = fastest_laps['LapTime'] - pole_lap['LapTime']

    # React cannot read Python Timedelta objects. 
    # This converts them to '0 days 00:01:12.345' format or simple strings.
    df = fastest_laps[['Driver', 'LapTime', 'LapTimeDelta']].copy()
    
    df['LapTime'] = df['LapTime'].apply(format_laptime)
    
    # Convert Timedelta to total seconds (float) so JSON can handle it
    df['LapTimeDelta'] = df['LapTimeDelta'].dt.total_seconds()
    
    return df.to_dict('records')

