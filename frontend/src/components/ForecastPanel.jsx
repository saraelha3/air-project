import React, { useState } from "react";
import { getRiskColor } from "../utils/riskUtils";

export default function ForecastPanel({ forecast }) {
  const [tab, setTab] = useState("5j");
  if (!forecast || forecast.length === 0) return null;

  const daily = [];
  const seen = new Set();
  for (const item of forecast) {
    const day = item.dt_txt?.split(" ")[0];
    if (!day || seen.has(day)) continue;
    const midday = forecast.find(f => f.dt_txt?.startsWith(day) && f.dt_txt.includes("12:"));
    daily.push(midday || item);
    seen.add(day);
    if (daily.length >= 5) break;
  }

  const dayName = dtTxt => new Date(dtTxt).toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"short" });

  return (
    <div className="forecast-panel animate-in" style={{ height:"100%" }}>
      <div className="forecast-panel-header">
        <h3>Prévisions météo</h3>
        <div className="forecast-tabs">
          {["5j","15j","30j"].map(t => (
            <button key={t} className={`forecast-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>
              {t==="5j"?"5 Jours":t==="15j"?"15 Jours":"30 Jours"}
            </button>
          ))}
        </div>
      </div>
      <div className="forecast-list">
        {daily.map((item,i) => (
          <div key={i} className="forecast-row">
            <img className="forecast-row-icon" src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`} alt={item.description}/>
            <div className="forecast-row-info">
              <div className="forecast-row-day">{dayName(item.dt_txt)}</div>
              <div className="forecast-row-desc">{item.description}</div>
            </div>
            <div className="forecast-row-temp">{Math.round(item.temperature)}°C</div>
            <div className="forecast-row-risk" style={{ background:getRiskColor(item.risk?.scenario??0), boxShadow:`0 0 6px ${getRiskColor(item.risk?.scenario??0)}`, border:"1.5px solid rgba(255,255,255,0.3)" }}/>
          </div>
        ))}
        {tab !== "5j" && (
          <div style={{ padding:"1rem 1.2rem", textAlign:"center", fontSize:".75rem", color:"var(--text-muted)" }}>
            Données {tab} disponibles avec abonnement météo étendu
          </div>
        )}
      </div>
    </div>
  );
}