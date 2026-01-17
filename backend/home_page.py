import matplotlib.pyplot as plt
import pandas as pd
from timple.timedelta import strftimedelta

import fastf1
import fastf1.plotting
from fastf1.core import Laps

from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Congratulations, it's a web app!"


def speed_visualisation(session):
    fastest_lap = session.laps.pick_fastest()
    car_data = fastest_lap.get_car_data().add_distance()
    
    circuit_info = session.get_circuit_info()

    team_color = fastf1.plotting.get_team_color(fastest_lap['Team'],
                                                session=session)

    fig, ax = plt.subplots()
    ax.plot(car_data['Distance'], car_data['Speed'],
            color=team_color, label=fastest_lap['Driver'])

    # Draw vertical dotted lines at each corner that range from slightly below the
    # minimum speed to slightly above the maximum speed.
    v_min = car_data['Speed'].min()
    v_max = car_data['Speed'].max()
    ax.vlines(x=circuit_info.corners['Distance'], ymin=v_min-20, ymax=v_max+20,
            linestyles='dotted', colors='grey')

    # Plot the corner number just below each vertical line.
    # For corners that are very close together, the text may overlap. A more
    # complicated approach would be necessary to reliably prevent this.
    for _, corner in circuit_info.corners.iterrows():
        txt = f"{corner['Number']}{corner['Letter']}"
        ax.text(corner['Distance'], v_min-30, txt,
                va='center_baseline', ha='center', size='small')

    ax.set_xlabel('Distance (m)')
    ax.set_ylabel('Speed (km/h)')
    ax.legend()

    # Manually adjust the y-axis limits to include the corner numbers, because
    # Matplotlib does not automatically account for text that was manually added.
    ax.set_ylim([v_min - 40, v_max + 20])
    plt.show()

def display_qualifying_results(session):
    drivers = pd.unique(session.laps['Driver'])
    print(drivers)

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
    print(fastest_laps[['Driver', 'LapTime', 'LapTimeDelta']])




# FastF1's dark color scheme
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)

# fastf1.plotting.setup_mpl(mpl_timedelta_support=True, color_scheme='fastf1')

# # load a session and its telemetry data
# session = fastf1.get_session(2021, 'Spanish Grand Prix', 'Q')
# session.load()

# index()
# display_qualifying_results(session)
# speed_visualisation(session)



