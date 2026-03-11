# Sentinel

A real-time geospatial dashboard for monitoring global seismic activity.

![Sentinel Dashboard](./screenshot.png)

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Python + FastAPI
- **API:** REST + GraphQL (Strawberry)
- **Map:** Leaflet + react-leaflet (CartoDB dark tiles)
- **Data:** USGS Earthquake API (live, no API key required)

## Architecture
The FastAPI backend acts as a normalization layer — it fetches raw GeoJSON from the USGS
public earthquake feed, maps magnitude to severity tiers, and exposes clean typed data
via both REST and GraphQL. The backend caches responses in memory with a 60-second TTL
to avoid redundant upstream calls. The frontend uses GraphQL as its primary data source.

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
cp .env.example .env
npm install
npm run dev
```

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/events | Live events from USGS (supports ?severity=) |
| GET | /api/events/:id | Single event by ID |
| GET | /api/cache-status | Cache age, TTL, and hit/miss counts |
| POST | /graphql | GraphQL endpoint |
| GET | /graphql | GraphQL playground |

## Data Source
Live earthquake data from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/).
Events with magnitude >= 2.5, ordered by time, limit 100.
