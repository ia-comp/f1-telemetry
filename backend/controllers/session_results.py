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
    schedule = fastf1.get_event_schedule(year, include_testing=False)

    # # get race names and round number
    list_races = list()
    for event in schedule.itertuples():
        list_races.append({
            "round": int(event.RoundNumber),
            "name": event.EventName.removesuffix(" Grand Prix"),
        }) 
    return list_races

def get_qualifying_results(year: int, gp: int):
    session = get_session(year, gp, session_type="Q")
    session.load(laps=False, telemetry=False, weather=False, messages=False)

    # get the fastest lap for each driver
    fastest_laps = session.results
    fastest_laps['LapTime'] = fastest_laps.apply(
        lambda row: row['Q3'] if pd.notna(row['Q3']) 
                    else (row['Q2'] if pd.notna(row['Q2']) else row['Q1']),
        axis=1
    )

    # calculate time delta
    pole_lap = fastest_laps['Q3'].min()
    fastest_laps['LapTimeDelta'] = fastest_laps['LapTime'] - pole_lap

    df = fastest_laps[['LastName', 'TeamColor', 'LapTime', 'LapTimeDelta']].copy()
    
    df.columns = ['Driver', 'TeamColour', 'LapTime', 'LapTimeDelta']
    df['LapTime'] = df['LapTime'].apply(format_laptime)
    
    # Convert Timedelta to total seconds (float) so JSON can handle it
    df['LapTimeDelta'] = df['LapTimeDelta'].dt.total_seconds()
    
    return df.to_dict('records')

# The functions below are used to display telemetry information
def plot_speed_trace(year: int, gp: str, driver: str):
    session = get_session(year, gp, session_type="Q")
    session.load(weather=False, messages=False)
    
    fastest_lap = session.laps.pick_driver(driver).pick_fastest()  # Singular
    
    # Get telemetry (combines car_data and pos_data)
    telemetry = fastest_lap.get_telemetry()
    
    # Remove rows with missing data
    telemetry = telemetry.dropna(subset=['Speed', 'Throttle', 'X', 'Y'])
    
    team_color = fastf1.plotting.get_team_color(
        fastest_lap['Team'], 
        session=session
    )
    
    return {
        "colour": team_color,
        "distance": telemetry['Distance'].tolist(),
        "speed": telemetry['Speed'].tolist(),
        "throttle": telemetry['Throttle'].tolist(),
        "x": telemetry['X'].tolist(),
        "y": telemetry['Y'].tolist(),
        "z": telemetry['Z'].tolist() if 'Z' in telemetry.columns else None
    }

def circuit_map(year: int, gp: int, driver: str):
    session = get_session(year, gp, session_type="Q")
    session.load(weather=False, messages=False)
    fastest_lap = session.laps.pick_drivers(driver).pick_fastest()

    pos = fastest_lap.get_pos_data()
    
    return {
        "X": pos['X'].tolist(),
        "Y": pos['Y'].tolist(),
        "Z": pos['Z'].tolist() if 'Z' in pos.columns else None
    } 
