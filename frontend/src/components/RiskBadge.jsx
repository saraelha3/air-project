import React from "react";
import { getRiskConfig } from "../utils/riskUtils";

export default function RiskBadge({ scenario, confidence }) {
  const cfg = getRiskConfig(scenario);

  return (
    <span
      className="risk-badge"
      style={{ background: cfg.color }}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
      {confidence != null && (
        <span className="confidence">({confidence}%)</span>
      )}
    </span>
  );
}
