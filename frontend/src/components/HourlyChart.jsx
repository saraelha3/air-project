import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(9,21,16,.97)", border:"1px solid rgba(174,195,176,.18)", borderRadius:10, padding:"10px 14px", fontSize:".8rem", boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
      <p style={{ fontWeight:700, marginBottom:6, color:"var(--text-primary)", fontFamily:"var(--font-display)" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color, marginBottom:2 }}>
          {p.name}: <strong>{p.value}{p.name==="Temp"?"°C":p.name==="Humidité"?"%":" m/s"}</strong>
        </p>
      ))}
    </div>
  );
};

export default function HourlyChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null;
  const data = forecast.slice(0, 8).map(item => ({
    time: item.dt_txt ? item.dt_txt.split(" ")[1]?.slice(0,5) : "",
    temp: Math.round(item.temperature),
    humidity: item.humidity,
    wind: item.wind_speed != null ? parseFloat(item.wind_speed.toFixed(1)) : null,
  }));

  return (
    <div className="chart-container animate-in">
      <h3 style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"var(--text-muted)", marginBottom:"1rem", display:"flex", alignItems:"center", gap:".4rem" }}>
        📈 Prévisions horaires (24h)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top:6, right:8, left:-12, bottom:0 }}>
          <defs>
            <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,195,176,.07)" vertical={false}/>
          <XAxis dataKey="time" tick={{ fill:"rgba(174,195,176,.5)", fontSize:11, fontFamily:"var(--font)" }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:"rgba(174,195,176,.45)", fontSize:11 }} axisLine={false} tickLine={false} width={30}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Area type="monotone" dataKey="temp" name="Temp" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#tGrad)"/>
          <Area type="monotone" dataKey="humidity" name="Humidité" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#hGrad)"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}