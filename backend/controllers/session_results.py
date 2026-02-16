import pandas as pd
import numpy as np

import fastf1
from fastf1.core import Laps
import fastf1.plotting

from backend.helpers import get_session

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
            "name": event.EventName.removesuffix(" Grand Prix"),
        }) 
    return list_races
 
def get_qualifying_results(year: int, gp: str):
    session = get_session(year, gp, session_type="Q")
    session.load(telemetry=False, weather=False, messages=False)

    drivers = pd.unique(session.laps['Driver'])

    # get drivers fastest laps
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

# The functions below are used to display telemetry information
def plot_speed_trace(year: int, gp: int, driver: str):
    session = get_session(year, gp, session_type="Q")
    session.load(weather=False, messages=False)
    fastest_lap = session.laps.pick_drivers(driver).pick_fastest()

    car_data = fastest_lap.get_car_data().add_distance()
    
    # Remove rows with missing data
    car_data = car_data.dropna()  
    team_color = fastf1.plotting.get_team_color(fastest_lap['Team'],
                                            session=session)
    return {
        "colour": team_color,
        "distance": car_data['Distance'].tolist(),
        "speed": car_data['Speed'].tolist(),
    }
