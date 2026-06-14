import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(10,25,18,0.96)",
        border: "1px solid rgba(174,195,176,0.18)",
        borderRadius: 12,
        padding: "12px 16px",
        fontSize: ".8rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        color: "var(--text-primary)",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 6, color: "var(--text-muted)", fontSize: "0.75rem" }}>
        ⌛ Prévision de {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
            <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
            <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
              {p.value}{p.name === "Temp" ? "°C" : p.name === "Humidité" ? "%" : " m/s"}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HourlyChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null;
  const data = forecast.slice(0, 8).map((item) => ({
    time: item.dt_txt ? item.dt_txt.split(" ")[1]?.slice(0, 5) : "",
    temp: Math.round(item.temperature),
    humidity: item.humidity,
    wind: item.wind_speed != null ? parseFloat(item.wind_speed.toFixed(1)) : null,
  }));

  return (
    <div className="chart-container animate-in" style={{ padding: "1.25rem" }}>
      <h3 style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-muted)", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
        📈 Prévisions horaires (24h) — Température, Humidité & Vent
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,195,176,.05)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "rgba(174,195,176,.5)", fontSize: 11, fontFamily: "var(--font)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(174,195,176,.45)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="temp" name="Temp" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#tGrad)" />
          <Area type="monotone" dataKey="humidity" name="Humidité" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#hGrad)" />
          <Area type="monotone" dataKey="wind" name="Vent" stroke="#4ade80" strokeWidth={1.5} fillOpacity={1} fill="url(#wGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}