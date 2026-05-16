import React, { useState } from "react";
import useWeather from "../hooks/useWeather";
import useRiskPrediction from "../hooks/useRiskPrediction";
import RiskBadge from "../components/RiskBadge";
import RiskAlert from "../components/RiskAlert";
import GasFlowGauge from "../components/GasFlowGauge";
import WindCompass from "../components/WindCompass";
import ProbabilityChart from "../components/ProbabilityChart";
import HourlyChart from "../components/HourlyChart";
import RadarMap from "../components/RadarMap";
import ForecastCard from "../components/ForecastCard";
import { Wind, RotateCcw, Zap, Thermometer, Droplets } from "lucide-react";

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export default function Dashboard() {
  const { weather, forecast, loading: weatherLoading, error: weatherError } = useWeather();
  const { prediction, predictCustom, loading: predicting, error: predictionError } = useRiskPrediction();

  const [gasFlow, setGasFlow] = useState(1500);
  const [selectedDir, setSelectedDir] = useState("S");

  const handlePredict = () => {
    predictCustom({ gas_flow: gasFlow, direction_vent: selectedDir });
  };

  if (weatherLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Chargement du dashboard…</span>
      </div>
    );
  }

  if (weatherError) {
    return (
      <div className="error-box">
        <p>❌ {weatherError}</p>
      </div>
    );
  }

  const riskColors = { 0: "#00e676", 1: "#ffab00", 2: "#ff6d00", 3: "#ff3d57" };
  const currentColor = prediction ? riskColors[prediction.scenario] ?? "#7c5cfc" : "#7c5cfc";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Alert */}
      {prediction && (
        <RiskAlert scenario={prediction.scenario} label={prediction.label} />
      )}

      {/* ── Simulation panel ──────────────────────────────────── */}
      <div className="glass animate-in" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap size={16} style={{ color: "var(--neon-purple)" }} />
          Simulation personnalisée IA
        </h2>

        <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
          {/* Gas slider */}
          <GasFlowGauge value={gasFlow} onChange={setGasFlow} />

          {/* Direction picker */}
          <div className="glass" style={{ padding: "1.5rem" }}>
            <span className="detail-label" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Wind size={13} /> Direction du vent simulée
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDir(d)}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "var(--radius-xs)",
                    border: `1px solid ${d === selectedDir ? "var(--neon-purple)" : "var(--glass-border)"}`,
                    background: d === selectedDir ? "rgba(124,92,252,0.2)" : "transparent",
                    color: d === selectedDir ? "var(--neon-purple)" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                    boxShadow: d === selectedDir ? "0 0 10px rgba(124,92,252,0.25)" : "none",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conditions météo actuelles (info) */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {[
            { icon: <Thermometer size={12} />, label: "Temp.", value: `${weather?.temperature?.toFixed(1) ?? "--"}°C` },
            { icon: <Droplets size={12} />, label: "Humidité", value: `${weather?.humidity ?? "--"}%` },
            { icon: <Wind size={12} />, label: "Vent réel", value: `${weather?.wind_speed?.toFixed(1) ?? "--"} m/s` },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-xs)", padding: "0.35rem 0.75rem",
              fontSize: "0.75rem", color: "var(--text-secondary)"
            }}>
              {item.icon}
              <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
              <strong style={{ color: "var(--text-primary)", marginLeft: 2 }}>{item.value}</strong>
            </div>
          ))}
        </div>

        {predictionError && (
          <div style={{ color: "#ff3d57", fontSize: "0.82rem", marginBottom: "1rem", textAlign: "center", fontWeight: 600 }}>
            ⚠️ {predictionError}
          </div>
        )}

        <button
          onClick={handlePredict}
          disabled={predicting}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(124,92,252,0.4)",
            background: predicting
              ? "rgba(124,92,252,0.1)"
              : "linear-gradient(135deg, rgba(124,92,252,0.8), rgba(90,63,214,0.9))",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: predicting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
            opacity: predicting ? 0.7 : 1,
            boxShadow: predicting ? "none" : "0 0 20px rgba(124,92,252,0.3)",
            letterSpacing: "0.03em",
          }}
        >
          {predicting ? (
            <>
              <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              Calcul en cours...
            </>
          ) : (
            <>
              <RotateCcw size={15} /> Lancer la prédiction IA
            </>
          )}
        </button>
      </div>

      {/* ── Results ───────────────────────────────────────────── */}
      {prediction && (
        <>
          {/* Risk badge centered */}
          <div style={{ textAlign: "center" }} className="animate-in">
            <RiskBadge scenario={prediction.scenario} confidence={prediction.confidence} />
          </div>

          {/* Result strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "0.75rem",
          }} className="animate-in">
            {Object.entries(prediction.probabilities).map(([label, pct]) => {
              const colors = { "Pas de risque": "#00e676", "Risque faible": "#ffab00", "Risque moyen": "#ff6d00", "Risque élevé": "#ff3d57" };
              const c = colors[label] ?? "#7c5cfc";
              return (
                <div key={label} style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${prediction.label === label ? c : "var(--glass-border)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "0.875rem 1rem",
                  boxShadow: prediction.label === label ? `0 0 15px ${c}30` : "none",
                }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: prediction.label === label ? c : "var(--text-primary)" }}>{pct}%</div>
                  <div style={{ marginTop: "0.5rem", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-grid animate-in">
            <ProbabilityChart probabilities={prediction.probabilities} />
            <WindCompass
              direction={prediction.weather?.wind_direction || weather?.wind_direction}
              degrees={prediction.weather?.wind_deg || weather?.wind_deg}
              speed={prediction.weather?.wind_speed || weather?.wind_speed}
            />
            <div className="full-width">
              <HourlyChart forecast={forecast} />
            </div>
            <div className="full-width">
              <div className="section-title">🗺️ Carte radar</div>
              <RadarMap weather={weather} />
            </div>
            <div className="full-width">
              <div className="section-title">📅 Prévisions 5 jours</div>
              <ForecastCard forecast={forecast} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
