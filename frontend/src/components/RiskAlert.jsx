import React from "react";
import { getRiskConfig, isHighRisk } from "../utils/riskUtils";
import { ShieldAlert, AlertTriangle } from "lucide-react";

export default function RiskAlert({ scenario, label }) {
  if (!isHighRisk(scenario)) return null;
  const cfg = getRiskConfig(scenario);
  return (
    <div className="risk-alert animate-in" style={{ background:cfg.bg, border:`1px solid ${cfg.color}55`, boxShadow:`0 0 20px ${cfg.color}18` }}>
      <div style={{ width:42, height:42, borderRadius:"50%", background:`${cfg.color}20`, border:`1px solid ${cfg.color}50`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {scenario === 3 ? <ShieldAlert size={18} style={{ color:cfg.color }}/> : <AlertTriangle size={18} style={{ color:cfg.color }}/>}
      </div>
      <div className="alert-text">
        <h3 style={{ color:cfg.color }}>⚠️ Alerte — {cfg.label}</h3>
        <p style={{ color:"var(--text-secondary)" }}>
          {scenario === 3
            ? "Les conditions météorologiques favorisent fortement le transport de polluants vers la ville. Restez à l'intérieur si possible."
            : "Risque modéré de pollution atmosphérique détecté. Surveillez l'évolution des conditions météo."}
        </p>
      </div>
    </div>
  );
}