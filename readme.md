This project is inspired by the [Fastlytics](https://fastlytics.app) platform. Going to try and just vibe code this one to show I can use AI.

**Techstack:**
- Frontend: React + TypeScript, Plotly.js for charts.
- Backend: Python (FastF1 API + FastAPI framework)
- Linking frontend with backend: axios
Use Zustand for state control:
- which session?
- which year?
- which event?
- which driver? (for lap/race replay)

## Installation 
Backend:
```
pip install -r requirements.txt
```
Frontend:
```
npm install
```

## Running  
**DISCLAIMERS **
- only results for **QUALIFYING** works
- Telemetry page needs a lot of work (proper playback, graphs not going all over the place when changing drivers etc)
- The entire thing is very much in its early stages

Backend:
```
cd backend
fastapi dev main.py
```
Frontend:
```
cd frontend
npm run dev
```
Pytests:
```
cd backend
pytest
```


## Planned Features:

- session results (driver positions + laptimes)
  - qualifying
  - race
  - practice sessions
  - testing times

- Driver's fastest lap replay (for a given session):
  - lap time
  - race replay animation
  - throttle %
  - speed 

- Full race replay:
  - leaderboard section
  - adjust replay speed
  - click on a driver and they their current pace, throttle and position when you click on their name on the leaderboard
  - also when clicking on the circle that represents a driver on track
  - should add a place to show the position of pit entry (maybe crowd stands as well)



## Design choices:

**1. Getting information for a particular event (race weekend/testing day)**

The snippet of code below in fastf1/events.py:
```
  if round == 0:
      raise ValueError("Cannot get testing event by round number!")
```
means it is not possible to obtain data for a particular preseason-testing day using round number. 
This is because the fastF1 backend assigns all preseason-testing days with round number 0. 
This data **can only** be obtained using the **string** gp param. I initially used the first word of the eventname eg. "Australian" from "Australian Grand Prix" to obtain the data. 
However, I found the fuzzy match algorithm to be unreliable since it failed to find the Event object for many valid race weekend names. 

Passing a string in the HTTP Get request params also means we're transmitting more data copmared to just passing a round number. 
Preseason testing data is also considered inaccurate since teams "sandbag".
Therefore, I chose to only analyse race weekends and get the Event objects using **round number**.

## Current problems:
- each API call takes a long time to load and setup data (up to 1 minute)
- currently uses local caching but thats not feasible for deployment
- Fastlytics uses supabase to cache --> reduce api calls
- Need to learn how to stream data for race replay
- Sync up the replay and laptime
- Concurrency when updating multiple driver location on track, running position, status (eg. pit stop, DNF etc)
