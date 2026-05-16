import React from "react";
import { getRiskColor } from "../utils/riskUtils";

export default function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  // Group by day — take the midday entry (12:00) per day
  const daily = [];
  const seen = new Set();
  for (const item of forecast) {
    const day = item.dt_txt?.split(" ")[0];
    if (!day || seen.has(day)) continue;
    // prefer 12:00, but accept any
    const midday = forecast.find(
      (f) => f.dt_txt?.startsWith(day) && f.dt_txt.includes("12:")
    );
    daily.push(midday || item);
    seen.add(day);
    if (daily.length >= 5) break;
  }

  const dayName = (dtTxt) => {
    const d = new Date(dtTxt);
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  };

  return (
    <div className="forecast-scroll">
      {daily.map((item, i) => {
        const scenario = item.risk?.scenario ?? 0;
        const iconUrl = `https://openweathermap.org/img/wn/${item.icon}@2x.png`;
        return (
          <div key={i} className="glass forecast-item">
            <span className="forecast-time">{dayName(item.dt_txt)}</span>
            <img className="forecast-icon" src={iconUrl} alt={item.description} />
            <span className="forecast-temp">{Math.round(item.temperature)}°</span>
            <span
              className="forecast-risk-dot"
              style={{ background: getRiskColor(scenario) }}
              title={item.risk?.label}
            />
          </div>
        );
      })}
    </div>
  );
}
