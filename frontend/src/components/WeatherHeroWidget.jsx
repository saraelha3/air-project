import React, { useState, useEffect } from "react";

function getWeatherState(icon, description) {
  const d = (description || "").toLowerCase();
  const isNight = icon && icon.endsWith("n");
  if (d.includes("orage") || d.includes("thunder")) return "stormy";
  if (d.includes("pluie") || d.includes("rain") || d.includes("drizzle") || d.includes("bruine")) return "rainy";
  if (d.includes("brouillard") || d.includes("fog") || d.includes("mist") || d.includes("brume")) return "foggy";
  if (d.includes("nuageux") || d.includes("cloud") || d.includes("couvert") || d.includes("overcast")) return "cloudy";
  if (isNight) return "night";
  return "sunny";
}
const ICONS = { sunny:"☀️", cloudy:"⛅", rainy:"🌧️", stormy:"⛈️", foggy:"🌫️", night:"🌙" };

export default function WeatherHeroWidget({ weather }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const timeStr = time.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });
  const dateStr = time.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });
  const state = weather ? getWeatherState(weather.icon, weather.description) : "night";

  return (
    <div className={`weather-hero-widget ${state} animate-in`}>
      <div className="hero-location-pill">
        📍 {weather?.location?.city || "Safi"}, {weather?.location?.country || "MA"}
      </div>
      <div className="hero-left">
        <div className="hero-greeting">Bienvenue — OCP AtmoSafe</div>
        <div className="hero-time">{timeStr}</div>
        <div className="hero-date">{dateStr}</div>
        <div className="hero-condition-label">{weather?.description || "—"}</div>
        {weather && (
          <div className="hero-condition-desc">
            Vent {weather.wind_speed?.toFixed(1)} m/s · Humidité {weather.humidity}%
          </div>
        )}
      </div>
      <div className="hero-right">
        <div className="hero-weather-icon">{ICONS[state]}</div>
        <div className="hero-temp">
          {weather ? Math.round(weather.temperature) : "--"}<sup>°C</sup>
        </div>
        <div className="hero-meta">
          <span>↑{Math.round(weather?.temp_max ?? 0)}°</span>
          <span>↓{Math.round(weather?.temp_min ?? 0)}°</span>
        </div>
      </div>
    </div>
  );
}