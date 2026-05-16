import React from "react";
import { getRiskConfig, isHighRisk } from "../utils/riskUtils";

export default function RiskAlert({ scenario, label }) {
  if (!isHighRisk(scenario)) return null;

  const cfg = getRiskConfig(scenario);

  return (
    <div
      className="risk-alert animate-in"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.color}`,
      }}
    >
      <span className="alert-icon">{cfg.icon}</span>
      <div className="alert-text">
        <h3 style={{ color: cfg.color }}>Alerte — {cfg.label}</h3>
        <p>
          {scenario === 3
            ? "Les conditions météorologiques actuelles favorisent fortement le transport de polluants vers la ville. Restez à l'intérieur si possible."
            : "Risque modéré de pollution atmosphérique détecté. Surveillez l'évolution des conditions."}
        </p>
      </div>
    </div>
  );
}
