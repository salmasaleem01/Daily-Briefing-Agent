import httpx
from typing import Optional, Dict, Any

async def fetch_weather(city: str, country_code: Optional[str] = None) -> Dict[str, Any]:
    q = f"{city}, {country_code}" if country_code else city
    async with httpx.AsyncClient(timeout=20) as client:
        geo = await client.get("https://geocoding-api.open-meteo.com/v1/search", params={"name": q, "count": 1})
        results = geo.json().get("results") or []
        if not results:
            raise ValueError("Location not found")
        loc = results[0]
        lat, lon = loc["latitude"], loc["longitude"]
        forecast = await client.get("https://api.open-meteo.com/v1/forecast", params={
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,weather_code",
        })
        current = forecast.json().get("current") or {}
        code = current.get("weather_code")
        return {
            "temperatureC": float(current.get("temperature_2m") or 0),
            "humidity": float(current.get("relative_humidity_2m") or 0),
            "description": describe_weather_code(code),
        }

def describe_weather_code(code: Optional[int]) -> str:
    mapping = {
        0: "Clear",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        61: "Rain",
        71: "Snow",
        80: "Rain showers",
        95: "Thunderstorm",
    }
    if code is None:
        return "Unknown"
    return mapping.get(code, "Mixed conditions")
