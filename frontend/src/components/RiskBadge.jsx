import React from "react";
import { getRiskConfig } from "../utils/riskUtils";
export default function RiskBadge({ scenario, confidence }) {
  const cfg = getRiskConfig(scenario);
  return (
    <span className="risk-badge animate-in" style={{ background:`linear-gradient(135deg,${cfg.color}cc,${cfg.color})`, boxShadow:`0 4px 20px ${cfg.color}44` }}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
      {confidence!=null&&<span className="confidence">({confidence}%)</span>}
    </span>
  );
}