import React, { useEffect } from "react";
import useWeather from "../hooks/useWeather";
import useRiskPrediction from "../hooks/useRiskPrediction";
import { useToast } from "../contexts/ToastContext";
import ModernWeatherHero from "../components/ModernWeatherHero";
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
import Tooltip from "../components/Tooltip";
import { SkeletonHero, SkeletonKPI, SkeletonCard, SkeletonForecastPanel } from "../components/SkeletonLoader";
import { Thermometer, Droplets, Wind, Activity, RefreshCw, Info } from "lucide-react";

const KPI_TIPS = {
  temperature: "Température de l'air à Safi. Mesurée en temps réel par l'API météo.",
  humidity:    "Humidité relative de l'air. Une humidité élevée peut favoriser la concentration des polluants.",
  wind:        "Vitesse et direction du vent. Un vent fort disperse les polluants, un vent faible les concentre.",
  clouds:      "Couverture nuageuse en %. Influence la photochimie des polluants atmosphériques.",
  risk:        "Niveau de risque prédit par le modèle XGBoost basé sur les conditions météo actuelles.",
};

export default function Home() {
  const { weather, forecast, loading: wLoading, error: wError, refresh } = useWeather();
  const { prediction, loading: pLoading } = useRiskPrediction();
  const toast = useToast();
  const loading = wLoading || pLoading;

  useEffect(() => {
    if (weather && !wLoading) {
      toast.success("Données météo chargées", `Safi — ${weather.temperature?.toFixed(1)}°C, ${weather.description}`, 3000);
    }
  }, [weather]);

  useEffect(() => {
    if (prediction && !pLoading && prediction.scenario >= 2) {
      toast.warning(`Alerte — ${prediction.label}`, `Confiance: ${prediction.confidence}% — Surveillance requise.`, 6000);
    }
  }, [prediction]);

  useEffect(() => {
    if (wError) toast.error("Erreur de chargement", wError, 5000);
  }, [wError]);

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <SkeletonHero />
          <SkeletonKPI count={5} />
        </div>
        <SkeletonForecastPanel />
      </div>
      <SkeletonCard height={230} />
      <div className="grid-2"><SkeletonCard height={260}/><SkeletonCard height={260}/></div>
    </div>
  );

  if (wError) return <div className="error-box"><p>❌ {wError}</p><button onClick={refresh}>Réessayer</button></div>;

  const riskCls = prediction ? ["green","amber","amber","red"][prediction.scenario] ?? "purple" : "purple";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {prediction && <RiskAlert scenario={prediction.scenario} label={prediction.label} />}

      {/* Hero + Prévisions 5j */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1rem", alignItems:"stretch" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {/* Modern immersive hero */}
          <ModernWeatherHero weather={weather} />

          {/* KPI strip */}
          <div className="kpi-strip animate-in" style={{ gridTemplateColumns:"repeat(5,1fr)" }}>
            {[
              { label:"Température", value:`${weather?.temperature?.toFixed(1)??"--"}°`, sub:`Ressenti ${Math.round(weather?.feels_like??0)}°C`, cls:"blue", icon:<Thermometer size={10}/>, tip:KPI_TIPS.temperature },
              { label:"Humidité",    value:`${weather?.humidity??"--"}%`, sub:`${weather?.pressure??"--"} hPa`, cls:"purple", icon:<Droplets size={10}/>, tip:KPI_TIPS.humidity },
              { label:"Vent",        value:`${weather?.wind_speed?.toFixed(1)??"--"}`, sub:`m/s — ${weather?.wind_direction??"--"}`, cls:"blue", icon:<Wind size={10}/>, tip:KPI_TIPS.wind },
              { label:"Nuages",      value:`${weather?.clouds??"--"}%`, sub:`Vis. ${weather?.visibility??"-"} km`, cls:"amber", icon:<Activity size={10}/>, tip:KPI_TIPS.clouds },
              { label:"Risque IA",   value:prediction?.label??"—", sub:prediction?`${prediction.confidence}% conf.`:"—", cls:riskCls, icon:"🎯", tip:KPI_TIPS.risk, small:true },
            ].map(k => (
              <div key={k.label} className={`kpi-card ${k.cls} animate-in`}>
                <div className="kpi-label">
                  {k.icon} {k.label}
                  <Tooltip content={k.tip} position="top">
                    <Info size={9} style={{ marginLeft:"auto", opacity:.45, cursor:"help" }}/>
                  </Tooltip>
                </div>
                <div className="kpi-value" style={k.small?{fontSize:".88rem",paddingTop:".3rem"}:{}}>{k.value}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
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
        <div style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".11em", color:"var(--text-muted)", marginBottom:".7rem", display:"flex", alignItems:"center", gap:".4rem" }}>
          🌤️ Détails météorologiques
        </div>
        <WeatherDetails weather={weather} />
      </div>

      {/* Refresh */}
      <div style={{ textAlign:"center", paddingTop:".5rem" }}>
        <button
          onClick={() => { refresh(); toast.info("Rafraîchissement en cours…", "Mise à jour des données météo", 2000); }}
          style={{ display:"inline-flex", alignItems:"center", gap:".5rem", padding:".5rem 1.4rem", borderRadius:50, border:"1px solid var(--glass-border)", background:"var(--bg-card)", color:"var(--text-secondary)", cursor:"pointer", fontSize:".78rem", fontWeight:600, fontFamily:"var(--font)", transition:"all .2s" }}>
          <RefreshCw size={13}/> Rafraîchir les données
        </button>
      </div>
    </div>
  );
}