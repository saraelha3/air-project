import React from "react";
import useWeather from "../hooks/useWeather";
import useRiskPrediction from "../hooks/useRiskPrediction";
import WeatherCard from "../components/WeatherCard";
import WeatherDetails from "../components/WeatherDetails";
import RiskBadge from "../components/RiskBadge";
import RiskAlert from "../components/RiskAlert";
import GasFlowGauge from "../components/GasFlowGauge";
import WindCompass from "../components/WindCompass";
import ForecastCard from "../components/ForecastCard";
import HourlyChart from "../components/HourlyChart";
import RadarMap from "../components/RadarMap";
import { Thermometer, Droplets, Wind, Gauge, Eye, Flame } from "lucide-react";

export default function Home() {
  const { weather, forecast, loading, error, refresh } = useWeather();
  const { prediction } = useRiskPrediction();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Chargement des données météo…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <p>❌ {error}</p>
        <button onClick={refresh}>Réessayer</button>
      </div>
    );
  }

  const riskColor = prediction ? { 0: "green", 1: "amber", 2: "amber", 3: "red" }[prediction.scenario] ?? "purple" : "purple";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Risk Alert */}
      {prediction && (
        <RiskAlert scenario={prediction.scenario} label={prediction.label} />
      )}

      {/* KPI Strip */}
      <div className="kpi-strip animate-in">
        <div className="kpi-card blue">
          <div className="kpi-label"><Thermometer size={11} /> Température</div>
          <div className="kpi-value">{weather?.temperature?.toFixed(1) ?? "--"}°</div>
          <div className="kpi-sub">Ressenti {weather?.feels_like?.toFixed(0) ?? "--"}°C</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label"><Droplets size={11} /> Humidité</div>
          <div className="kpi-value">{weather?.humidity ?? "--"}%</div>
          <div className="kpi-sub">Pression {weather?.pressure ?? "--"} hPa</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label"><Wind size={11} /> Vent</div>
          <div className="kpi-value">{weather?.wind_speed?.toFixed(1) ?? "--"}</div>
          <div className="kpi-sub">m/s — {weather?.wind_direction ?? "--"}</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label"><Flame size={11} /> Débit gaz OCP</div>
          <div className="kpi-value">{weather?.gas_flow?.toFixed(0) ?? "--"}</div>
          <div className="kpi-sub">m³/h (simulé)</div>
        </div>
        <div className={`kpi-card ${riskColor}`}>
          <div className="kpi-label"><Gauge size={11} /> Niveau de risque</div>
          <div className="kpi-value" style={{ fontSize: "1rem", paddingTop: "0.35rem" }}>
            {prediction?.label ?? "--"}
          </div>
          <div className="kpi-sub">{prediction ? `Confiance : ${prediction.confidence}%` : "—"}</div>
        </div>
      </div>

      {/* Risk badge */}
      {prediction && (
        <div style={{ textAlign: "center" }} className="animate-in">
          <RiskBadge scenario={prediction.scenario} confidence={prediction.confidence} />
        </div>
      )}

      {/* Weather Hero + Details */}
      <div className="grid-2 animate-in">
        <WeatherCard weather={weather} />
        <WeatherDetails weather={weather} />
      </div>

      {/* Wind + Gas */}
      <div className="grid-2 animate-in">
        <WindCompass direction={weather?.wind_direction} degrees={weather?.wind_deg} speed={weather?.wind_speed} />
        <GasFlowGauge value={weather?.gas_flow ?? 1500} />
      </div>

      {/* Map */}
      <div className="animate-in">
        <div className="section-title">🗺️ Carte radar</div>
        <RadarMap weather={weather} />
      </div>

      {/* Hourly chart */}
      <div className="animate-in">
        <HourlyChart forecast={forecast} />
      </div>

      {/* 5-day forecast */}
      <div className="animate-in">
        <div className="section-title">📅 Prévisions 5 jours</div>
        <ForecastCard forecast={forecast} />
      </div>
    </div>
  );
}
