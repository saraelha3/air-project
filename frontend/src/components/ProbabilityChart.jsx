import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4ade80", "#fbbf24", "#fb923c", "#f87171"];
const SHORT  = ["Sans risque", "Faible", "Moyen", "Élevé"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "rgba(10,25,18,0.96)",
        border: `1px solid ${d.color}40`,
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: ".78rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        color: "#ffffff",
      }}
    >
      <p style={{ fontWeight: 700, color: d.color, marginBottom: 4 }}>{d.fullName}</p>
      <p style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)", margin: 0, color: "#ffffff" }}>
        {d.value}%
      </p>
    </div>
  );
};

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;
  const data = Object.entries(probabilities).map(([label, value], i) => ({
    name: SHORT[i] ?? label,
    fullName: label,
    value: typeof value === "number" ? parseFloat(value.toFixed(1)) : parseFloat(value),
    color: COLORS[i] ?? "#6B9071",
  }));

  const maxScenario = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, item) => (item.value > max.value ? item : max), data[0]);
  }, [data]);

  return (
    <div className="glass chart-container animate-in" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: ".4rem" }}>
        📊 Probabilités par scénario
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", alignItems: "center", gap: "1rem" }}>
        {/* Donut Chart with Center Gauge */}
        <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={76}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}35)`, outline: "none" }} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered statistics */}
          {maxScenario && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                Dominant
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, fontFamily: "var(--font-display)", color: maxScenario.color, margin: "1px 0" }}>
                {maxScenario.value}%
              </div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                {maxScenario.name}
              </div>
            </div>
          )}
        </div>

        {/* Detailed sidebar metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {data.map((item, i) => (
            <div 
              key={i} 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: 3, 
                background: "rgba(255,255,255,0.02)", 
                padding: "0.4rem 0.6rem", 
                borderRadius: 8, 
                border: "1px solid var(--glass-border)" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                  {item.fullName}
                </span>
                <strong style={{ color: item.color, fontFamily: "var(--font-display)", fontSize: "0.8rem" }}>{item.value}%</strong>
              </div>
              <div style={{ height: 3, borderRadius: 1.5, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.value}%`, background: item.color, borderRadius: 1.5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}