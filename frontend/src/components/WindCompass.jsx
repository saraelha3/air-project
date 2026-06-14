import React, { useMemo } from "react";
import { windDescription } from "../utils/windUtils";

export default function WindCompass({ direction, degrees, speed }) {
  const rotation = degrees ?? 0;

  // Render SVG tick marks around the compass ring (every 30 degrees)
  const ticks = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 50 + 41 * Math.sin(angle);
      const y1 = 50 - 41 * Math.cos(angle);
      const x2 = 50 + 45 * Math.sin(angle);
      const y2 = 50 - 45 * Math.cos(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={i % 3 === 0 ? "rgba(74,222,128,0.5)" : "rgba(174,195,176,0.2)"}
          strokeWidth={i % 3 === 0 ? "0.8" : "0.4"}
        />
      );
    });
  }, []);

  return (
    <div className="glass compass-container animate-in" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
      {/* Dynamic Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-scanner {
          0% { border-color: rgba(74,222,128,0.1); box-shadow: 0 0 5px rgba(74,222,128,0.05); }
          50% { border-color: rgba(74,222,128,0.3); box-shadow: 0 0 15px rgba(74,222,128,0.18); }
          100% { border-color: rgba(74,222,128,0.1); box-shadow: 0 0 5px rgba(74,222,128,0.05); }
        }
      ` }} />

      <span className="detail-label" style={{ alignSelf: "flex-start", fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".08em", display: "flex", alignItems: "center", gap: 4 }}>
        🧭 Atmosphère · Direction du Vent
      </span>

      {/* Compass Circular Scanner */}
      <div 
        className="compass" 
        style={{ 
          width: 145, 
          height: 145, 
          borderRadius: "50%", 
          border: "1px solid rgba(174,195,176,0.18)", 
          position: "relative", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "radial-gradient(circle, rgba(10,25,18,0.3) 0%, rgba(5,10,8,0.6) 100%)",
          animation: "pulse-scanner 3.5s ease-in-out infinite",
          overflow: "hidden"
        }}
      >
        {/* Conic Radar Sweep */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(74,222,128,0.12) 0deg, transparent 90deg, transparent 360deg)",
          animation: "radar-sweep 4s linear infinite",
          pointerEvents: "none",
          zIndex: 1
        }} />

        {/* Ring Grids */}
        <div style={{ position: "absolute", width: "80%", height: "80%", borderRadius: "50%", border: "1px dashed rgba(174,195,176,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "50%", height: "50%", borderRadius: "50%", border: "1px solid rgba(174,195,176,0.05)", pointerEvents: "none" }} />

        {/* SVG Ticks & Crosshairs */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} viewBox="0 0 100 100">
          {/* Crosshairs */}
          <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(174,195,176,0.06)" strokeWidth="0.5" strokeDasharray="1 3" />
          <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(174,195,176,0.06)" strokeWidth="0.5" strokeDasharray="1 3" />
          {/* Ticks */}
          {ticks}
        </svg>

        {/* Direction Text Rings */}
        <span style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-primary)", zIndex: 3 }}>N</span>
        <span style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-primary)", zIndex: 3 }}>S</span>
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-primary)", zIndex: 3 }}>E</span>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-primary)", zIndex: 3 }}>O</span>

        {/* Degree Markers */}
        <span style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontSize: "0.45rem", fontWeight: 700, color: "rgba(74,222,128,0.4)", zIndex: 3 }}>0°</span>
        <span style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: "0.45rem", fontWeight: 700, color: "rgba(174,195,176,0.3)", zIndex: 3 }}>180°</span>
        <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: "0.45rem", fontWeight: 700, color: "rgba(174,195,176,0.3)", zIndex: 3 }}>90°</span>
        <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: "0.45rem", fontWeight: 700, color: "rgba(174,195,176,0.3)", zIndex: 3 }}>270°</span>

        {/* Advanced Target Needle */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `rotate(${rotation}deg)`,
          transition: "transform 1.3s cubic-bezier(0.19, 1, 0.22, 1)",
          pointerEvents: "none",
          zIndex: 4
        }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <defs>
              <filter id="needle-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Primary glowing arrow pointer */}
            <polygon points="50,14 46,45 54,45" fill="#4ade80" filter="url(#needle-glow)" />
            {/* Double-dot aviation accent */}
            <circle cx="50" cy="22" r="1.5" fill="#141414" />
            {/* Center hub */}
            <circle cx="50" cy="50" r="5.5" fill="#4ade80" stroke="#102512" strokeWidth="1.5" filter="url(#needle-glow)" />
            <circle cx="50" cy="50" r="2" fill="#141414" />
            {/* Tail dashline indicator */}
            <line x1="50" y1="55" x2="50" y2="80" stroke="rgba(74,222,128,0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
            <polygon points="50,83 48,78 52,78" fill="rgba(74,222,128,0.4)" />
          </svg>
        </div>
      </div>

      {/* Compass Telemetry Info */}
      <div className="compass-info" style={{ textAlign: "center", marginTop: "2px" }}>
        <div className="direction" style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
          {direction || "—"} <span style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>{rotation}°</span>
        </div>
        <div className="speed" style={{ fontSize: ".72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
          <strong>{speed != null ? `${speed} m/s` : ""}</strong> · {windDescription(direction)}
        </div>
      </div>
    </div>
  );
}