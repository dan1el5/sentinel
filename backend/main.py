from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from usgs import fetch_events, get_cache_status
from schema import schema

app = FastAPI(title="Sentinel API")

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/events")
async def get_events(severity: str | None = None):
    return await fetch_events(severity)


@app.get("/api/cache-status")
async def cache_status():
    return get_cache_status()


@app.get("/api/events/{event_id}")
async def get_event(event_id: str):
    events = await fetch_events()
    match = next((e for e in events if e["id"] == event_id), None)
    if not match:
        return {"error": "Event not found"}
    return match
