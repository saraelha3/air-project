import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const COLORS = ["#4ade80","#fbbf24","#fb923c","#f87171"];
const SHORT   = ["Sans risque","Faible","Moyen","Élevé"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:"rgba(9,21,16,.97)", border:`1px solid ${d.color}40`, borderRadius:10, padding:"10px 14px", fontSize:".78rem", boxShadow:"0 4px 20px rgba(0,0,0,.4)" }}>
      <p style={{ fontWeight:700, color:d.color, marginBottom:4 }}>{d.fullName}</p>
      <p style={{ color:"var(--text-primary)", fontFamily:"var(--font-display)", fontSize:"1.1rem" }}>{d.value}%</p>
    </div>
  );
};

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;
  const data = Object.entries(probabilities).map(([label,value],i) => ({
    name: SHORT[i] ?? label, fullName: label,
    value: typeof value==="number" ? parseFloat(value.toFixed(1)) : parseFloat(value),
    color: COLORS[i] ?? "#6B9071",
  }));

  return (
    <div className="glass chart-container animate-in">
      <h3>📊 Probabilités par scénario</h3>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} barSize={36} margin={{ top:8, right:8, left:-10, bottom:0 }}>
          <defs>
            {COLORS.map((c,i) => (
              <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={c} stopOpacity={0.45}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,195,176,.07)" vertical={false}/>
          <XAxis dataKey="name" tick={{ fill:"rgba(174,195,176,.55)", fontSize:11, fontFamily:"var(--font)" }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:"rgba(174,195,176,.45)", fontSize:11 }} axisLine={false} tickLine={false} domain={[0,100]} width={32}/>
          <Tooltip content={<CustomTooltip/>} cursor={{ fill:"rgba(107,144,113,.06)" }}/>
          <Bar dataKey="value" radius={[6,6,0,0]}>
            {data.map((_,i) => <Cell key={i} fill={`url(#bg${i})`}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}