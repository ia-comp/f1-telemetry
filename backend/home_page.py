import pandas as pd
import fastf1
from fastf1.core import Laps

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
    
    # Convert Timedelta to total seconds (float) so JSON can handle it
    df['LapTime'] = df['LapTime'].dt.total_seconds() 
    df['LapTimeDelta'] = df['LapTimeDelta'].dt.total_seconds()
    
    return df.to_dict('records')

