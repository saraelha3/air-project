import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HourlyChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  // Take first 8 entries (≈ 24 h at 3h intervals)
  const data = forecast.slice(0, 8).map((item) => {
    const hour = item.dt_txt ? item.dt_txt.split(" ")[1]?.slice(0, 5) : "";
    return {
      time: hour,
      temp: Math.round(item.temperature),
      humidity: item.humidity,
      wind: item.wind_speed,
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: "rgba(15,12,41,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
            {p.name === "Temp" ? "°C" : p.name === "Humidité" ? "%" : " m/s"}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="glass chart-container animate-in">
      <h3>📈 Prévisions horaires (24h)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="temp"
            name="Temp"
            stroke="#7c5cfc"
            fillOpacity={1}
            fill="url(#tempGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="humidity"
            name="Humidité"
            stroke="#00d2ff"
            fillOpacity={1}
            fill="url(#humGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
