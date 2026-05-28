import React, { useState, useEffect } from "react";
import useWeather from "../hooks/useWeather";
import useRiskPrediction from "../hooks/useRiskPrediction";
import { useToast } from "../contexts/ToastContext";
import RiskBadge from "../components/RiskBadge";
import RiskAlert from "../components/RiskAlert";
import GasFlowGauge from "../components/GasFlowGauge";
import WindCompass from "../components/WindCompass";
import ProbabilityChart from "../components/ProbabilityChart";
import HourlyChart from "../components/HourlyChart";
import RadarMap from "../components/RadarMap";
import ForecastPanel from "../components/ForecastPanel";
import Tooltip from "../components/Tooltip";
import { SkeletonCard, SkeletonKPI } from "../components/SkeletonLoader";
import { Wind, RotateCcw, Zap, Thermometer, Droplets, CheckCircle, AlertTriangle, TrendingUp, Info } from "lucide-react";

const DIRECTIONS = ["N","NE","E","SE","S","SO","O","NO"];
const DIR_TIPS = {
  N:"Vent du Nord — polluants dirigés vers le Sud (ville)",
  NE:"Vent du Nord-Est — risque modéré pour Safi",
  E:"Vent d'Est — polluants dirigés vers l'Atlantique",
  SE:"Vent du Sud-Est — risque faible",
  S:"Vent du Sud — polluants dirigés vers le Nord",
  SO:"Vent du Sud-Ouest — dispersion en mer, risque faible",
  O:"Vent d'Ouest (mer) — dilution des polluants",
  NO:"Vent du Nord-Ouest — risque modéré",
};
const RISK_META = [
  { key:"Pas de risque", color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.3)",   icon:<CheckCircle size={13}/> },
  { key:"Risque faible", color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.3)",   icon:<AlertTriangle size={13}/> },
  { key:"Risque moyen",  color:"#fb923c", bg:"rgba(251,146,60,0.1)",   border:"rgba(251,146,60,0.3)",   icon:<TrendingUp size={13}/> },
  { key:"Risque élevé",  color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)", icon:<AlertTriangle size={13}/> },
];

export default function Dashboard() {
  const { weather, forecast, loading: wLoading, error: wError } = useWeather();
  const { prediction, predictCustom, loading: predicting, error: predError } = useRiskPrediction();
  const toast = useToast();
  const [gasFlow, setGasFlow]     = useState(1500);
  const [selectedDir, setSelectedDir] = useState("S");

  useEffect(() => {
    if (predError) toast.error("Erreur de prédiction", predError, 5000);
  }, [predError]);

  useEffect(() => {
    if (prediction && !predicting) {
      const msg = ["Aucun risque détecté 🎉","Risque faible détecté","Risque moyen — Vigilance requise","⚠️ Risque élevé — Alerte!"][prediction.scenario];
      const type = prediction.scenario >= 2 ? "warning" : "success";
      toast[type](msg, `Confiance: ${prediction.confidence}%`, 5000);
    }
  }, [prediction]);

  if (wLoading) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <SkeletonCard height={360} />
      <SkeletonKPI count={4} />
    </div>
  );
  if (wError) return <div className="error-box"><p>❌ {wError}</p></div>;

  const handlePredict = async () => {
    toast.info("Prédiction en cours…", `Débit: ${gasFlow} m³/h · Vent: ${selectedDir}`, 2000);
    await predictCustom({ gas_flow: gasFlow, direction_vent: selectedDir });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {prediction && <RiskAlert scenario={prediction.scenario} label={prediction.label} />}

      {/* ── Simulation panel ── */}
      <div className="glass animate-in" style={{ padding:"1.5rem" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1rem", fontWeight:700, marginBottom:"1.4rem", display:"flex", alignItems:"center", gap:".5rem", color:"var(--text-primary)" }}>
          <Zap size={16} style={{ color:"#a78bfa" }}/> Simulation personnalisée IA
          <Tooltip content="Simulez différents scénarios de débit de gaz OCP et de direction du vent pour prédire le risque de pollution à Safi." position="right">
            <Info size={14} style={{ color:"var(--text-muted)", cursor:"help", marginLeft:4 }}/>
          </Tooltip>
        </h2>

        <div className="grid-2" style={{ marginBottom:"1.2rem" }}>
          <GasFlowGauge value={gasFlow} onChange={setGasFlow} />
          <div style={{ background:"rgba(15,35,20,.6)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius-sm)", padding:"1.3rem" }}>
            <div className="detail-label" style={{ marginBottom:".9rem", display:"flex", alignItems:"center", gap:".4rem" }}>
              <Wind size={13}/> Direction du vent simulée
              <Tooltip content="La direction du vent détermine vers où se dispersent les polluants depuis l'usine OCP." position="top">
                <Info size={11} style={{ color:"var(--text-muted)", cursor:"help", marginLeft:4 }}/>
              </Tooltip>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".4rem" }}>
              {DIRECTIONS.map(d => (
                <Tooltip key={d} content={DIR_TIPS[d]} position="top">
                  <button onClick={()=>setSelectedDir(d)} style={{
                    width:"100%", padding:".4rem .3rem", borderRadius:"var(--radius-xs)",
                    border:`1px solid ${d===selectedDir?"#a78bfa":"var(--glass-border)"}`,
                    background:d===selectedDir?"rgba(167,139,250,0.15)":"transparent",
                    color:d===selectedDir?"#a78bfa":"var(--text-secondary)",
                    cursor:"pointer", fontSize:".8rem", fontWeight:700,
                    transition:"all .15s", fontFamily:"var(--font)",
                    boxShadow:d===selectedDir?"0 0 10px rgba(167,139,250,.2)":"none",
                  }}>
                    {d}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:".65rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
          {[
            { icon:<Thermometer size={12}/>, label:"Temp.", value:`${weather?.temperature?.toFixed(1)??"--"}°C`, tip:"Température actuelle à Safi utilisée dans la simulation" },
            { icon:<Droplets size={12}/>, label:"Humidité", value:`${weather?.humidity??"--"}%`, tip:"Humidité relative actuelle" },
            { icon:<Wind size={12}/>, label:"Vent réel", value:`${weather?.wind_speed?.toFixed(1)??"--"} m/s`, tip:"Vitesse du vent mesurée en temps réel" },
          ].map(item => (
            <Tooltip key={item.label} content={item.tip} position="top">
              <div style={{ display:"flex", alignItems:"center", gap:".4rem", background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius-xs)", padding:".32rem .75rem", fontSize:".75rem", color:"var(--text-secondary)", cursor:"help" }}>
                <span style={{ color:"var(--accent)" }}>{item.icon}</span>
                <span style={{ color:"var(--text-muted)" }}>{item.label}</span>
                <strong style={{ color:"var(--text-primary)", marginLeft:2 }}>{item.value}</strong>
              </div>
            </Tooltip>
          ))}
        </div>

        <button onClick={handlePredict} disabled={predicting} style={{
          width:"100%", padding:".8rem", borderRadius:"var(--radius-sm)",
          border:"1px solid rgba(107,144,113,.4)",
          background:predicting?"rgba(107,144,113,.1)":"linear-gradient(135deg,#375534,#6B9071)",
          color:"var(--text-primary)", fontWeight:700, fontSize:".9rem",
          cursor:predicting?"not-allowed":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          transition:"all .2s", opacity:predicting?.7:1,
          boxShadow:predicting?"none":"0 4px 20px rgba(107,144,113,.25)",
          letterSpacing:".02em", fontFamily:"var(--font)",
        }}>
          {predicting
            ? <><div className="loading-spinner" style={{ width:16, height:16, borderWidth:2 }}/> Calcul en cours…</>
            : <><RotateCcw size={15}/> Lancer la prédiction IA</>}
        </button>
      </div>

      {prediction && (
        <>
          <div style={{ textAlign:"center" }} className="animate-in">
            <RiskBadge scenario={prediction.scenario} confidence={prediction.confidence} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".75rem" }} className="animate-in">
            {RISK_META.map(({ key, color, bg, border, icon }) => {
              const pct = prediction.probabilities?.[key] ?? 0;
              const isActive = prediction.label === key;
              return (
                <div key={key} style={{ background:isActive?bg:"var(--bg-card-solid)", border:`1px solid ${isActive?border:"var(--glass-border)"}`, borderRadius:"var(--radius-sm)", padding:"1rem 1.1rem", boxShadow:isActive?`0 0 18px ${color}22`:"none", transition:"all .2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:isActive?color:"var(--text-muted)", marginBottom:".45rem" }}>
                    <span style={{ color }}>{icon}</span> {key}
                  </div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"1.7rem", fontWeight:700, color:isActive?color:"var(--text-primary)", lineHeight:1 }}>{pct}%</div>
                  <div style={{ marginTop:".55rem", height:3, borderRadius:2, background:"rgba(255,255,255,.07)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:2, transition:"width .8s ease" }}/>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid-2 animate-in">
            <ProbabilityChart probabilities={prediction.probabilities} />
            <WindCompass direction={prediction.weather?.wind_direction||weather?.wind_direction} degrees={prediction.weather?.wind_deg||weather?.wind_deg} speed={prediction.weather?.wind_speed||weather?.wind_speed} />
          </div>
          <div className="glass animate-in"><HourlyChart forecast={forecast} /></div>
          <div className="grid-2 animate-in">
            <RadarMap weather={weather} />
            <ForecastPanel forecast={forecast} />
          </div>
        </>
      )}
    </div>
  );
}