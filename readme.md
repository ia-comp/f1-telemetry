This project is inspired by the Fastlytics platform. Going to try and just vibe code this one to show I can use AI.

Techstack:
- Frontend: React + TypeScript, Plotly.js for charts.
- Backend: Python (FastF1 API + FastAPI framework)

Features:

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
- which driver? (for lap replay)

Current problems:
- each API call takes a long time to load and setup data (up to 1 minute)
- currently uses local caching but thats not feasible for deployment
- Fastlytics uses supabase to cache --> reduce api calls
- Need to learn how to stream data for race replay
- Sync up the replay and laptime
- Concurrency when updating multiple driver location on track, running position, status (eg. pit stop, DNF etc)

## Installation 
Backend:
```
pip install -r requirements.txt
```
Frontend:
```
npm install
```
