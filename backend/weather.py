"""
Weather data retrieval from OpenWeatherMap and gas flow simulation.
"""
import random
import requests
from config import (
    OPENWEATHER_API_KEY,
    OPENWEATHER_BASE_URL,
    SAFI_LAT,
    SAFI_LON,
    GAS_FLOW_BASE,
    GAS_FLOW_VARIANCE,
)


# ─── Wind direction helpers ───────────────────────────────────────────────────
_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]


def degree_to_direction(deg: float) -> str:
    """Convert wind bearing (0-360°) to compass label."""
    idx = int((deg + 22.5) % 360 // 45)
    return _DIRECTIONS[idx]


# ─── OpenWeatherMap ───────────────────────────────────────────────────────────
def get_current_weather() -> dict:
    """Fetch current weather for Safi from OpenWeatherMap."""
    url = f"{OPENWEATHER_BASE_URL}/weather"
    params = {
        "lat":   SAFI_LAT,
        "lon":   SAFI_LON,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang":  "fr",
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    wind_deg = data.get("wind", {}).get("deg", 0)

    return {
        "temperature":     data["main"]["temp"],
        "feels_like":      data["main"]["feels_like"],
        "temp_min":        data["main"]["temp_min"],
        "temp_max":        data["main"]["temp_max"],
        "humidity":        data["main"]["humidity"],
        "pressure":        data["main"]["pressure"],
        "wind_speed":      data.get("wind", {}).get("speed", 0),
        "wind_deg":        wind_deg,
        "wind_direction":  degree_to_direction(wind_deg),
        "clouds":          data.get("clouds", {}).get("all", 0),
        "visibility":      data.get("visibility", 10000),
        "description":     data["weather"][0]["description"],
        "icon":            data["weather"][0]["icon"],
        "rain_1h":         data.get("rain", {}).get("1h", 0),
        "sunrise":         data["sys"].get("sunrise"),
        "sunset":          data["sys"].get("sunset"),
        "dt":              data["dt"],
    }


def get_forecast() -> list:
    """Fetch 5-day / 3-hour forecast for Safi."""
    url = f"{OPENWEATHER_BASE_URL}/forecast"
    params = {
        "lat":   SAFI_LAT,
        "lon":   SAFI_LON,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang":  "fr",
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    forecasts = []
    for item in data.get("list", []):
        wind_deg = item.get("wind", {}).get("deg", 0)
        forecasts.append({
            "dt":             item["dt"],
            "dt_txt":         item["dt_txt"],
            "temperature":    item["main"]["temp"],
            "feels_like":     item["main"]["feels_like"],
            "temp_min":       item["main"]["temp_min"],
            "temp_max":       item["main"]["temp_max"],
            "humidity":       item["main"]["humidity"],
            "pressure":       item["main"]["pressure"],
            "wind_speed":     item.get("wind", {}).get("speed", 0),
            "wind_deg":       wind_deg,
            "wind_direction": degree_to_direction(wind_deg),
            "clouds":         item.get("clouds", {}).get("all", 0),
            "description":    item["weather"][0]["description"],
            "icon":           item["weather"][0]["icon"],
            "rain_3h":        item.get("rain", {}).get("3h", 0),
        })
    return forecasts


# ─── Gas flow simulation ─────────────────────────────────────────────────────
def simulate_gas_flow() -> float:
    """Return a simulated gas flow value in m³/h."""
    return round(
        GAS_FLOW_BASE + random.uniform(-GAS_FLOW_VARIANCE, GAS_FLOW_VARIANCE),
        1,
    )
