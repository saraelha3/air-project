"""
Feature engineering utilities.
Builds the 41-feature vector expected by the XGBoost model.
"""
import math
from models import get_feature_names
from config import SAFI_LAT, SAFI_LON, OCP_LAT, OCP_LON


def _wind_components(speed: float, deg: float):
    """Return (u, v) wind vector components."""
    rad = math.radians(deg)
    u = -speed * math.sin(rad)
    v = -speed * math.cos(rad)
    return round(u, 4), round(v, 4)


def _direction_category(direction: str) -> dict:
    """One-hot encode the wind direction."""
    dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
    return {f"direction_{d}": (1 if d == direction else 0) for d in dirs}


def _is_wind_towards_city(wind_deg: float) -> int:
    """
    Check if wind blows from the OCP plant (S) towards Safi (N).
    Roughly: wind from 135°-225° (S sector) carries pollutants
    towards the city.
    """
    return 1 if 135 <= wind_deg <= 225 else 0


def _distance_factor(wind_speed: float) -> float:
    """
    Simple attenuation factor based on wind speed and
    distance between OCP plant and city (~39 km).
    """
    dist_km = 39.0  # approximate
    if wind_speed <= 0:
        return 0.0
    travel_time_h = dist_km / (wind_speed * 3.6)  # m/s → km/h
    decay = math.exp(-0.05 * travel_time_h)
    return round(decay, 4)


def build_features(weather_data: dict, gas_flow: float) -> dict:
    """
    Build the full 41-feature vector expected by the model.
    35 base features + 6 engineered features + 0 direction flags
    (direction flags are included in the 8 directions below)
    """
    wind_speed = weather_data.get("wind_speed", 0)
    wind_deg   = weather_data.get("wind_deg", 0)
    direction  = weather_data.get("wind_direction", "N")
    temp       = weather_data.get("temperature", 20)
    humidity   = weather_data.get("humidity", 50)
    pressure   = weather_data.get("pressure", 1013)
    clouds     = weather_data.get("clouds", 0)
    rain       = weather_data.get("rain_1h", 0) or weather_data.get("rain_3h", 0) or 0
    visibility = weather_data.get("visibility", 10000)

    u, v = _wind_components(wind_speed, wind_deg)
    dir_flags = _direction_category(direction)

    features = {
        # Raw meteorological (8 features)
        "temperature":          temp,
        "humidity":             humidity,
        "pressure":             pressure,
        "wind_speed":           wind_speed,
        "wind_deg":             wind_deg,
        "clouds":               clouds,
        "rain":                 rain,
        "visibility":           visibility,
        # Gas flow (1 feature)
        "gas_flow":             gas_flow,
        # Engineered (26 features)
        "wind_u":               u,
        "wind_v":               v,
        "wind_towards_city":    _is_wind_towards_city(wind_deg),
        "distance_factor":      _distance_factor(wind_speed),
        "gas_x_wind":           round(gas_flow * wind_speed, 2),
        "gas_x_direction":      round(gas_flow * _is_wind_towards_city(wind_deg), 2),
        "temp_humidity":        round(temp * humidity, 2),
        "pressure_diff":        round(pressure - 1013.25, 2),
        "wind_speed_sq":        round(wind_speed ** 2, 4),
        "gas_flow_sq":          round(gas_flow ** 2, 2),
        "wind_chill":           round(13.12 + 0.6215 * temp - 11.37 * (wind_speed * 3.6) ** 0.16 + 0.3965 * temp * (wind_speed * 3.6) ** 0.16, 2) if wind_speed > 0 else temp,
        "cloud_factor":         round(clouds / 100.0, 2),
        "rain_flag":            1 if rain > 0 else 0,
        "visibility_km":        round(visibility / 1000.0, 2),
        "temp_inv":             round(1.0 / (temp + 273.15), 6),
        "humidity_pressure":    round(humidity * pressure / 100000, 4),
        "gas_per_wind":         round(gas_flow / max(wind_speed, 0.1), 2),
        "stability_index":      round((temp - 20) * 0.5 + (1013 - pressure) * 0.3 + (humidity - 50) * 0.2, 2),
        # 6 ADDITIONAL ENGINEERED FEATURES
        "pressure_normalized":  round((pressure - 1013.25) / 10, 4),
        "humidity_normalized":  round(humidity / 100, 4),
        "wind_speed_cubed":     round(wind_speed ** 3, 4),
        "gas_wind_interaction": round(gas_flow * wind_speed * wind_deg / 360, 2) if wind_speed > 0 else 0,
        "stability_wind":       round((temp - 20) * wind_speed, 2),
        "risk_index":           round((gas_flow / max(wind_speed, 1)) * (pressure - 1000) / 15, 2),
    }

    # Add direction one-hot flags (8 features: direction_N, direction_NE, ..., direction_NO)
    features.update(dir_flags)

    return features