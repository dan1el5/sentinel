import httpx
import time
from datetime import datetime, timezone
from typing import Any

USGS_URL = (
    "https://earthquake.usgs.gov/fdsnws/event/1/query"
    "?format=geojson&orderby=time&limit=100&minmagnitude=2.5"
)

CACHE_TTL = 60  # seconds

_cache: dict[str, Any] = {"data": None, "timestamp": 0, "hits": 0, "misses": 0}


def magnitude_to_severity(mag: float) -> str:
    if mag >= 7.0:
        return "critical"
    elif mag >= 5.5:
        return "high"
    elif mag >= 4.5:
        return "medium"
    else:
        return "low"


def get_cache_status() -> dict:
    age = time.time() - _cache["timestamp"] if _cache["data"] else None
    return {
        "cached": _cache["data"] is not None,
        "age_seconds": round(age, 1) if age else None,
        "ttl_seconds": CACHE_TTL,
        "hits": _cache["hits"],
        "misses": _cache["misses"],
    }


async def fetch_events(severity: str | None = None) -> list[dict]:
    now = time.time()
    if _cache["data"] is None or (now - _cache["timestamp"]) > CACHE_TTL:
        async with httpx.AsyncClient() as client:
            response = await client.get(USGS_URL, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        _cache["data"] = data
        _cache["timestamp"] = now
        _cache["misses"] += 1
    else:
        data = _cache["data"]
        _cache["hits"] += 1

    events = []
    for feature in data["features"]:
        props = feature["properties"]
        coords = feature["geometry"]["coordinates"]
        mag = props.get("mag") or 0

        event = {
            "id": feature["id"],
            "lat": coords[1],
            "lng": coords[0],
            "magnitude": mag,
            "severity": magnitude_to_severity(mag),
            "place": props.get("place") or "Unknown location",
            "timestamp": datetime.fromtimestamp(
                props["time"] / 1000, tz=timezone.utc
            ).isoformat(),
            "depth": coords[2],
            "tsunami": bool(props.get("tsunami")),
            "url": props.get("url") or "",
        }
        events.append(event)

    if severity:
        events = [e for e in events if e["severity"] == severity]

    return events
