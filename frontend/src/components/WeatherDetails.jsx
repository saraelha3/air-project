import React from "react";
import { Droplets, Gauge, Cloud, Wind, Eye, Thermometer } from "lucide-react";

const details = [
  { key: "humidity",    label: "Humidité",    icon: Droplets,     unit: "%",   format: (v) => v },
  { key: "pressure",    label: "Pression",    icon: Gauge,        unit: " hPa", format: (v) => v },
  { key: "clouds",      label: "Nuages",      icon: Cloud,        unit: "%",   format: (v) => v },
  { key: "wind_speed",  label: "Vent",        icon: Wind,         unit: " m/s", format: (v) => v },
  { key: "visibility",  label: "Visibilité",  icon: Eye,          unit: " km",  format: (v) => (v / 1000).toFixed(1) },
  { key: "feels_like",  label: "Ressenti",    icon: Thermometer,  unit: "°C",  format: (v) => Math.round(v) },
];

export default function WeatherDetails({ weather }) {
  if (!weather) return null;

  return (
    <div className="grid-details animate-in">
      {details.map(({ key, label, icon: Icon, unit, format }) => (
        <div key={key} className="glass detail-card">
          <span className="detail-label">
            <Icon size={13} />
            {label}
          </span>
          <span className="detail-value">
            {format(weather[key])}
            <small style={{ fontSize: "0.65em", opacity: 0.6 }}>{unit}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
