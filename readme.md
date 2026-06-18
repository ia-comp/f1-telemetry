This project is inspired by the Fastlytics platform. Going to try and just vibe code this one to show I can use AI.

Techstack:
- Frontend: React + TypeScript, Plotly.js for charts.
- Backend: Python (FastF1 API + FastAPI framework)

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


Planned Features:

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

Use Zustand for state control:
- which session?
- which year?
- which event?
- which driver? (for lap/race replay)

## Design choices:

Getting information for a particular event (race weekend/testing day):

The snippet of code below in fastf1/events.py:
```
  if round == 0:
      raise ValueError("Cannot get testing event by round number!")
```
means it is not possible to obtain data for a particular preseason-testing day using round number. 
This is because the fastF1 backend assigns all preseason-testing days with round number 0. 
This data can only be obtained using the string gp param. I initially used the first word of the eventname eg. "Australian" from "Australian Grand Prix" to obtain the data. 
However, I found the fuzzy match algorithm to be unreliable since it failed to find the Event object for many valid race weekend names. 

Passing a string in the HTTP Get request params also uses more data than passing a round number. 
Preseason testing data is also considered inaccurate since teams "sandbag" or limit the maximum performance of their cars. 
Therefore, I chose to only analyse race weekends and get the Event objects using round number.

## Current problems:
- each API call takes a long time to load and setup data (up to 1 minute)
- currently uses local caching but thats not feasible for deployment
- Fastlytics uses supabase to cache --> reduce api calls
- Need to learn how to stream data for race replay
- Sync up the replay and laptime
- Concurrency when updating multiple driver location on track, running position, status (eg. pit stop, DNF etc)

## Bugs out of my control:
- qualifying results for round 15 2021 returns an "Internal Server Error"
- qualifying results for round 7 2024 returns an "Internal Server Error"
