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
import ForecastPanel from "../components/ForecastPanel";
import { Wind, RotateCcw, Zap, Thermometer, Droplets, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

const DIRECTIONS = ["N","NE","E","SE","S","SO","O","NO"];
const RISK_META = [
  { key:"Pas de risque", color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.3)",   icon:<CheckCircle size={13}/> },
  { key:"Risque faible", color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.3)",   icon:<AlertTriangle size={13}/> },
  { key:"Risque moyen",  color:"#fb923c", bg:"rgba(251,146,60,0.1)",   border:"rgba(251,146,60,0.3)",   icon:<TrendingUp size={13}/> },
  { key:"Risque élevé",  color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)", icon:<AlertTriangle size={13}/> },
];

export default function Dashboard() {
  const { weather, forecast, loading: wLoading, error: wError } = useWeather();
  const { prediction, predictCustom, loading: predicting, error: predError } = useRiskPrediction();
  const [gasFlow, setGasFlow] = useState(1500);
  const [selectedDir, setSelectedDir] = useState("S");

  if (wLoading) return <div className="loading-screen"><div className="loading-spinner"/><span className="loading-text">Chargement…</span></div>;
  if (wError) return <div className="error-box"><p>❌ {wError}</p></div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {prediction && <RiskAlert scenario={prediction.scenario} label={prediction.label} />}

      {/* ── Simulation panel ── */}
      <div className="glass animate-in" style={{ padding:"1.5rem" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1rem", fontWeight:700, marginBottom:"1.4rem", display:"flex", alignItems:"center", gap:".5rem", color:"var(--text-primary)" }}>
          <Zap size={16} style={{ color:"#a78bfa" }}/> Simulation personnalisée IA
        </h2>

        <div className="grid-2" style={{ marginBottom:"1.2rem" }}>
          <GasFlowGauge value={gasFlow} onChange={setGasFlow} />
          <div style={{ background:"rgba(15,35,20,.6)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius-sm)", padding:"1.3rem" }}>
            <div className="detail-label" style={{ marginBottom:".9rem", display:"flex", alignItems:"center", gap:".4rem" }}>
              <Wind size={13}/> Direction du vent simulée
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".4rem" }}>
              {DIRECTIONS.map(d => (
                <button key={d} onClick={()=>setSelectedDir(d)} style={{
                  padding:".4rem .5rem", borderRadius:"var(--radius-xs)",
                  border:`1px solid ${d===selectedDir?"#a78bfa":"var(--glass-border)"}`,
                  background:d===selectedDir?"rgba(167,139,250,0.15)":"transparent",
                  color:d===selectedDir?"#a78bfa":"var(--text-secondary)",
                  cursor:"pointer", fontSize:".8rem", fontWeight:700,
                  transition:"all .15s", fontFamily:"var(--font)",
                  boxShadow:d===selectedDir?"0 0 10px rgba(167,139,250,.2)":"none",
                }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:".65rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
          {[
            { icon:<Thermometer size={12}/>, label:"Temp.", value:`${weather?.temperature?.toFixed(1)??"--"}°C` },
            { icon:<Droplets size={12}/>, label:"Humidité", value:`${weather?.humidity??"--"}%` },
            { icon:<Wind size={12}/>, label:"Vent réel", value:`${weather?.wind_speed?.toFixed(1)??"--"} m/s` },
          ].map(item => (
            <div key={item.label} style={{ display:"flex", alignItems:"center", gap:".4rem", background:"rgba(255,255,255,.04)", border:"1px solid var(--glass-border)", borderRadius:"var(--radius-xs)", padding:".32rem .75rem", fontSize:".75rem", color:"var(--text-secondary)" }}>
              <span style={{ color:"var(--accent)" }}>{item.icon}</span>
              <span style={{ color:"var(--text-muted)" }}>{item.label}</span>
              <strong style={{ color:"var(--text-primary)", marginLeft:2 }}>{item.value}</strong>
            </div>
          ))}
        </div>

        {predError && <div style={{ color:"#f87171", fontSize:".8rem", marginBottom:"1rem", textAlign:"center" }}>⚠️ {predError}</div>}

        <button
          onClick={()=>predictCustom({ gas_flow:gasFlow, direction_vent:selectedDir })}
          disabled={predicting}
          style={{
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

      {/* ── Résultats ── */}
      {prediction && (
        <>
          <div style={{ textAlign:"center" }} className="animate-in">
            <RiskBadge scenario={prediction.scenario} confidence={prediction.confidence} />
          </div>

          {/* 4 cartes probabilité */}
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
            <WindCompass
              direction={prediction.weather?.wind_direction||weather?.wind_direction}
              degrees={prediction.weather?.wind_deg||weather?.wind_deg}
              speed={prediction.weather?.wind_speed||weather?.wind_speed}
            />
          </div>
          <div className="glass animate-in">
            <HourlyChart forecast={forecast} />
          </div>
          <div className="grid-2 animate-in">
            <RadarMap weather={weather} />
            <ForecastPanel forecast={forecast} />
          </div>
        </>
      )}
    </div>
  );
}