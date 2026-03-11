# Sentinel

Real-time seismic event monitoring dashboard. Ingests live earthquake data from the USGS API, normalizes it through a FastAPI backend, and renders events on an interactive 3D globe with a filterable command center interface.

**[Live Demo](https://sentinel-six-kappa.vercel.app)**

https://github.com/user-attachments/assets/c77e3c77-1310-4493-94f7-3c1e70b48a7f

## Stack

| Layer    | Tech                                  |
| -------- | ------------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend  | Python, FastAPI                       |
| APIs     | REST + GraphQL (Strawberry)           |
| Map      | Mapbox GL JS (globe projection)       |
| Data     | USGS Earthquake Hazards Program       |
| Deploy   | Vercel (frontend), Render (backend)   |

## Architecture

```
USGS GeoJSON Feed
       |
  FastAPI Backend (normalization + 60s TTL cache)
       |
  REST (/api/events)  +  GraphQL (/graphql)
       |
  React Frontend (client-side filtering, Mapbox GL globe)
```

The backend fetches raw GeoJSON from the USGS public feed, maps magnitude to severity tiers (`critical` >= 7.0, `high` >= 5.5, `medium` >= 4.5, `low` < 4.5), and exposes typed data via both REST and GraphQL. Responses are cached in memory with a 60-second TTL to reduce upstream calls.

The frontend queries GraphQL for all events and filters client-side to keep filter counts accurate across severity levels.

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
cp .env.example .env  # add your Mapbox token
npm install
npm run dev
```

Requires a [Mapbox access token](https://account.mapbox.com/access-tokens/) set as `VITE_MAPBOX_TOKEN` in `.env`.

## API

| Method | Path                | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/health`           | Health check                              |
| GET    | `/api/events`       | All events (optional `?severity=` filter) |
| GET    | `/api/events/:id`   | Single event by ID                        |
| GET    | `/api/cache-status` | Cache TTL, age, hit/miss counts           |
| POST   | `/graphql`          | GraphQL endpoint                          |
| GET    | `/graphql`          | GraphQL playground                        |

## Data

Live earthquake data from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/). Events with magnitude >= 2.5, ordered by time, limit 200.
