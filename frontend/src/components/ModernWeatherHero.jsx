import React, { useState, useEffect, useRef } from "react";
import { MapPin, Wind, Cloud, Droplets, Eye, Thermometer } from "lucide-react";
import { getWeatherBg } from "../utils/weatherBackgrounds";

/**
 * Tries to load image from url, then from fallbacks array.
 * Returns the first URL that loads successfully.
 */
function useBackgroundImage(url, fallbacks = []) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const allUrls = [url, ...fallbacks];
  const indexRef = useRef(0);

  useEffect(() => {
    setSrc(null);
    setLoaded(false);
    indexRef.current = 0;

    function tryNext() {
      if (indexRef.current >= allUrls.length) return; // all failed
      const img = new Image();
      img.src = allUrls[indexRef.current];
      img.onload = () => {
        setSrc(allUrls[indexRef.current]);
        setLoaded(true);
      };
      img.onerror = () => {
        indexRef.current += 1;
        tryNext();
      };
    }

    tryNext();
  }, [url]);

  return { src, loaded };
}

export default function ModernWeatherHero({ weather }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const bg = getWeatherBg(weather?.description, weather?.icon);
  const { src: bgSrc, loaded: bgLoaded } = useBackgroundImage(bg.url, bg.fallbacks);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });

  // Fix visibility: API returns meters
  const visibilityKm = weather?.visibility
    ? weather.visibility >= 1000
      ? `${(weather.visibility / 1000).toFixed(0)} km`
      : `${weather.visibility} m`
    : "—";

  const metrics = [
    { icon: <Cloud size={15} />,    label: "Nuages",     value: `${weather?.clouds ?? "—"}%` },
    { icon: <Droplets size={15} />, label: "Humidité",   value: `${weather?.humidity ?? "—"}%` },
    { icon: <Wind size={15} />,     label: "Vent",       value: `${weather?.wind_speed?.toFixed(1) ?? "—"} m/s` },
    { icon: <Eye size={15} />,      label: "Visibilité", value: visibilityKm },
  ];

  return (
    <div
      className="modern-weather-hero animate-in"
      style={{ background: bg.gradient }}
    >
      {/* Background image with smart fallback */}
      {bgSrc && (
        <img
          className="hero-backdrop"
          src={bgSrc}
          alt="weather background"
          style={{ opacity: bgLoaded ? 0.58 : 0, transition: "opacity 0.8s ease" }}
        />
      )}

      {/* Overlays */}
      <div className="hero-overlay-1" style={{ background: bg.overlay }} />
      <div className="hero-overlay-2" />
      <div className="hero-overlay-3" />

      {/* Content */}
      <div className="hero-content">

        {/* ── Top row ── */}
        <div className="hero-top">
          <div>
            <div className="hero-tag">🌿 OCP AtmoSafe — Surveillance air</div>
            <div className="hero-location">
              <MapPin size={14} style={{ color: "rgba(255,255,255,0.65)" }} />
              <span>{weather?.location?.city || "Safi"}, {weather?.location?.country || "MA"}</span>
            </div>
            <p className="hero-big-temp">
              {weather ? Math.round(weather.temperature) : "--"}°
            </p>
            <p className="hero-condition">
              {weather?.description || "Chargement…"}
            </p>
          </div>

          {/* Datetime */}
          <div className="hero-datetime">
            <span className="hero-time-big">{timeStr}</span>
            <span className="hero-date-small">{dateStr.toUpperCase()}</span>
            <div style={{ marginTop: ".85rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".3rem" }}>
              <span style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: ".3rem" }}>
                <Thermometer size={12} style={{ opacity: .65 }} />
                ↑{Math.round(weather?.temp_max ?? 0)}° / ↓{Math.round(weather?.temp_min ?? 0)}°
              </span>
              <span style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.45)" }}>
                {weather?.wind_direction ?? "—"} · Ressenti {Math.round(weather?.feels_like ?? 0)}°C
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom metrics ── */}
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