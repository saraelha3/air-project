import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";

const COLORS = ["#00e676", "#ffab00", "#ff6d00", "#ff3d57"];

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;

  const data = Object.entries(probabilities).map(([label, value], i) => ({
    name: label,
    value: value,
    color: COLORS[i] || "#7c5cfc",
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: "rgba(7,11,20,0.95)",
        border: `1px solid ${d.color}40`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: "0.78rem",
        boxShadow: `0 0 15px ${d.color}20`,
      }}>
        <p style={{ fontWeight: 700, color: d.color }}>{d.name}</p>
        <p style={{ color: "#e8f0fe" }}>{d.value}%</p>
      </div>
    );
  };

  return (
    <div className="glass chart-container animate-in">
      <h3>📊 Probabilités par scénario</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(232,240,254,0.4)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(232,240,254,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
