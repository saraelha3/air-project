import React from "react";

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  return (
    <div className="glass weather-hero animate-in">
      <p className="city-name">
        📍 {weather.location?.city || "Safi"}, {weather.location?.country || "MA"}
      </p>

      <img
        className="weather-icon-large"
        src={iconUrl}
        alt={weather.description}
      />

      <div className="temperature">
        {Math.round(weather.temperature)}
        <span>°C</span>
      </div>

      <p className="description">{weather.description}</p>

      <p className="temp-range">
        ↑ {Math.round(weather.temp_max)}° &nbsp;·&nbsp; ↓ {Math.round(weather.temp_min)}°
        &nbsp;·&nbsp; Ressenti {Math.round(weather.feels_like)}°
      </p>
    </div>
  );
}
