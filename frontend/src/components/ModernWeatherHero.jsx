import React, { useState, useEffect } from "react";
import { MapPin, Wind, Cloud, Droplets, Eye, Thermometer } from "lucide-react";
import { getWeatherBg } from "../utils/weatherBackgrounds";

export default function ModernWeatherHero({ weather }) {
  const [time, setTime] = useState(new Date());
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const bg = getWeatherBg(weather?.description, weather?.icon);
  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const metrics = [
    { icon: <Cloud size={15} />, label: "Nuages",     value: `${weather?.clouds ?? "—"}%` },
    { icon: <Droplets size={15} />, label: "Humidité", value: `${weather?.humidity ?? "—"}%` },
    { icon: <Wind size={15} />, label: "Vent",        value: `${weather?.wind_speed?.toFixed(1) ?? "—"} m/s` },
    { icon: <Eye size={15} />, label: "Visibilité",   value: `${weather?.visibility ?? "—"} km` },
  ];

  return (
    <div className="modern-weather-hero animate-in" style={{ background: bg.gradient }}>
      {/* Background image */}
      <img
        className="hero-backdrop"
        src={bg.url}
        alt="weather background"
        style={{ opacity: imageLoaded ? 0.55 : 0 }}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Layered overlays */}
      <div className="hero-overlay-1" style={{ background: bg.overlay }} />
      <div className="hero-overlay-2" />
      <div className="hero-overlay-3" />

      {/* Content */}
      <div className="hero-content">
        {/* Top row */}
        <div className="hero-top">
          <div>
            {/* Tag */}
            <div className="hero-tag">
              🌿 OCP AtmoSafe — Surveillance air
            </div>
            {/* Location */}
            <div className="hero-location">
              <MapPin size={15} style={{ color: "rgba(255,255,255,0.7)" }} />
              <span>{weather?.location?.city || "Safi"}, {weather?.location?.country || "MA"}</span>
            </div>
            {/* Big temp */}
            <p className="hero-big-temp">
              {Math.round(weather?.temperature ?? 0)}°
            </p>
            <p className="hero-condition">
              {weather?.description || "Chargement…"}
            </p>
          </div>

          {/* Datetime */}
          <div className="hero-datetime">
            <span className="hero-time-big">{timeStr}</span>
            <span className="hero-date-small">{dateStr.toUpperCase()}</span>
            {/* Min/Max */}
            <div style={{ marginTop: ".75rem", display: "flex", gap: ".65rem", justifyContent: "flex-end" }}>
              <span style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.55)", display:"flex", alignItems:"center", gap:".25rem" }}>
                <Thermometer size={12} style={{ opacity:.7 }}/> 
                ↑{Math.round(weather?.temp_max ?? 0)}° / ↓{Math.round(weather?.temp_min ?? 0)}°
              </span>
            </div>
            {/* Wind direction */}
            <div style={{ marginTop:".4rem", textAlign:"right" }}>
              <span style={{ fontSize:".75rem", color:"rgba(255,255,255,0.5)" }}>
                {weather?.wind_direction ?? "—"} · Ressenti {Math.round(weather?.feels_like ?? 0)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="hero-metrics">
          {metrics.map(m => (
            <div key={m.label} className="hero-metric">
              <div className="hero-metric-icon">{m.icon}</div>
              <p className="hero-metric-label">{m.label}</p>
              <p className="hero-metric-value">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}