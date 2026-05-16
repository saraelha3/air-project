import React from "react";
import { Flame } from "lucide-react";

export default function GasFlowGauge({ value, onChange }) {
  const maxFlow = 3000;
  const pct = Math.min((value / maxFlow) * 100, 100);

  let barColor = "#28a745";
  if (value > 2000) barColor = "#dc3545";
  else if (value > 1500) barColor = "#fd7e14";
  else if (value > 1000) barColor = "#ffc107";

  return (
    <div className="glass gas-gauge animate-in">
      <div className="gauge-header">
        <span className="detail-label">
          <Flame size={14} />
          Débit de gaz (OCP)
        </span>
        <span className="gauge-value">
          {Math.round(value)}
          <span className="gauge-unit"> m³/h</span>
        </span>
      </div>

      <div className="gauge-bar">
        <div
          className="gauge-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          }}
        />
      </div>

      {onChange && (
        <>
          <p className="slider-label">Ajuster le débit manuellement</p>
          <input
            type="range"
            min={0}
            max={maxFlow}
            step={50}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </>
      )}
    </div>
  );
}
