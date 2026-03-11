import strawberry
from typing import Optional

from usgs import fetch_events


@strawberry.type
class SeismicEventType:
    id: str
    lat: float
    lng: float
    magnitude: float
    severity: str
    place: str
    timestamp: str
    depth: float
    tsunami: bool
    url: str


@strawberry.type
class Query:
    @strawberry.field
    async def events(
        self, severity: Optional[str] = None
    ) -> list[SeismicEventType]:
        data = await fetch_events(severity)
        return [SeismicEventType(**e) for e in data]

    @strawberry.field
    async def event(self, id: str) -> Optional[SeismicEventType]:
        data = await fetch_events()
        match = next((e for e in data if e["id"] == id), None)
        return SeismicEventType(**match) if match else None


schema = strawberry.Schema(query=Query)
