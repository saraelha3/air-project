import React from "react";
import { Flame } from "lucide-react";
import Tooltip from "./Tooltip";

export default function GasFlowGauge({ value, onChange }) {
  const maxFlow = 3000;
  const pct = Math.min((value / maxFlow) * 100, 100);
  let barColor = "#4ade80", statusLabel = "Normal", statusTip = "Débit normal — risque faible";
  if (value > 2000) { barColor = "#f87171"; statusLabel = "Critique"; statusTip = "Débit très élevé — risque de pollution élevé"; }
  else if (value > 1500) { barColor = "#fb923c"; statusLabel = "Élevé"; statusTip = "Débit élevé — surveillance requise"; }
  else if (value > 1000) { barColor = "#fbbf24"; statusLabel = "Modéré"; statusTip = "Débit modéré — risque faible à moyen"; }

  return (
    <div className="glass gas-gauge animate-in">
      <div className="gauge-header">
        <Tooltip content="Débit de gaz émis par l'usine OCP Safi. Un débit élevé combiné à un vent défavorable augmente le risque de pollution." position="top">
          <span className="detail-label" style={{ cursor:"help" }}>
            <Flame size={13} style={{ color: barColor }}/> Débit de gaz (OCP)
          </span>
        </Tooltip>
        <div style={{ textAlign:"right" }}>
          <span className="gauge-value">{Math.round(value)}</span>
          <span className="gauge-unit"> m³/h</span>
          <Tooltip content={statusTip} position="left">
            <div style={{ fontSize:".65rem", fontWeight:700, color:barColor, textTransform:"uppercase", letterSpacing:".08em", marginTop:2, cursor:"help" }}>
              {statusLabel}
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="gauge-bar">
        <div className="gauge-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${barColor}99,${barColor})`, boxShadow:`0 0 8px ${barColor}55` }}/>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", fontSize:".6rem", color:"var(--text-muted)", marginBottom:".6rem" }}>
        <span>0</span>
        <span style={{ color:"#fbbf24" }}>1000</span>
        <span style={{ color:"#fb923c" }}>1500</span>
        <span style={{ color:"#f87171" }}>2000</span>
        <span>3000 m³/h</span>
      </div>

      {onChange && (
        <>
          <p className="slider-label">Ajuster le débit manuellement</p>
          <input type="range" min={0} max={maxFlow} step={50} value={value}
            onChange={e => onChange(Number(e.target.value))}/>
        </>
      )}
    </div>
  );
}