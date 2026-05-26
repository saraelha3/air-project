import React from "react";
import useWeather from "../hooks/useWeather";
import useRiskPrediction from "../hooks/useRiskPrediction";
import WeatherHeroWidget from "../components/WeatherHeroWidget";
import ForecastPanel from "../components/ForecastPanel";
import WeatherTiles from "../components/WeatherTiles";
import WeatherDetails from "../components/WeatherDetails";
import HourlyChart from "../components/HourlyChart";
import ProbabilityChart from "../components/ProbabilityChart";
import RadarMap from "../components/RadarMap";
import WindCompass from "../components/WindCompass";
import GasFlowGauge from "../components/GasFlowGauge";
import RiskAlert from "../components/RiskAlert";
import RiskBadge from "../components/RiskBadge";
import { Thermometer, Droplets, Wind, Activity } from "lucide-react";

export default function Home() {
  const { weather, forecast, loading, error, refresh } = useWeather();
  const { prediction } = useRiskPrediction();

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span className="loading-text">Chargement des données météo…</span>
    </div>
  );
  if (error) return (
    <div className="error-box">
      <p>❌ {error}</p>
      <button onClick={refresh}>Réessayer</button>
    </div>
  );

  const riskColor = prediction ? ["green","amber","amber","red"][prediction.scenario] ?? "purple" : "purple";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* Alerte */}
      {prediction && <RiskAlert scenario={prediction.scenario} label={prediction.label} />}

      {/* Hero + Prévisions 5j */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem", alignItems:"stretch" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <WeatherHeroWidget weather={weather} />

          {/* KPI strip */}
          <div className="kpi-strip animate-in" style={{ gridTemplateColumns:"repeat(5,1fr)" }}>
            <div className="kpi-card blue">
              <div className="kpi-label"><Thermometer size={10}/> Température</div>
              <div className="kpi-value">{weather?.temperature?.toFixed(1)??"--"}°</div>
              <div className="kpi-sub">Ressenti {Math.round(weather?.feels_like??0)}°C</div>
            </div>
            <div className="kpi-card purple">
              <div className="kpi-label"><Droplets size={10}/> Humidité</div>
              <div className="kpi-value">{weather?.humidity??"--"}%</div>
              <div className="kpi-sub">Pression {weather?.pressure??"--"} hPa</div>
            </div>
            <div className="kpi-card blue">
              <div className="kpi-label"><Wind size={10}/> Vent</div>
              <div className="kpi-value">{weather?.wind_speed?.toFixed(1)??"--"}</div>
              <div className="kpi-sub">m/s — {weather?.wind_direction??"--"}</div>
            </div>
            <div className="kpi-card amber">
              <div className="kpi-label"><Activity size={10}/> Nuages</div>
              <div className="kpi-value">{weather?.clouds??"--"}%</div>
              <div className="kpi-sub">Vis. {weather?.visibility??"-"} km</div>
            </div>
            <div className={`kpi-card ${riskColor}`}>
              <div className="kpi-label">🎯 Risque IA</div>
              <div className="kpi-value" style={{ fontSize:".9rem", paddingTop:".3rem" }}>
                {prediction?.label??"—"}
              </div>
              <div className="kpi-sub">{prediction?`${prediction.confidence}% conf.`:"—"}</div>
            </div>
          </div>
        </div>

        {/* Prévisions 5 jours */}
        <ForecastPanel forecast={forecast} />
      </div>

      {/* Badge risque */}
      {prediction && (
        <div style={{ textAlign:"center" }} className="animate-in">
          <RiskBadge scenario={prediction.scenario} confidence={prediction.confidence} />
        </div>
      )}

      {/* Graphique horaire */}
      <div className="glass animate-in">
        <HourlyChart forecast={forecast} />
      </div>

      {/* Probabilités + Carte radar */}
      <div className="grid-2 animate-in">
        <ProbabilityChart probabilities={prediction?.probabilities} />
        <RadarMap weather={weather} />
      </div>

      {/* Boussole + Débit gaz + Tuiles */}
      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:"1rem", alignItems:"start" }}>
        <WindCompass direction={weather?.wind_direction} degrees={weather?.wind_deg} speed={weather?.wind_speed} />
        <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          <GasFlowGauge value={weather?.gas_flow ?? 1970} />
          <WeatherTiles weather={weather} prediction={prediction} />
        </div>
      </div>

      {/* Détails météo */}
      <div className="animate-in">
        <div className="section-title">🌤️ Détails météorologiques</div>
        <WeatherDetails weather={weather} />
      </div>
    </div>
  );
}