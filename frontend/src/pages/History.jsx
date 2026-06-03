import React, { useState, useMemo, useEffect } from "react";
import { Clock, Download, TrendingUp, AlertTriangle, CheckCircle, Info, Factory } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import Tooltip from "../components/Tooltip";
import { SkeletonTable } from "../components/SkeletonLoader";
import { getProductionState, getProductionPct } from "../utils/riskUtils";

const RISK_META = [
  { label:"Pas de risque", color:"#4ade80", bg:"rgba(74,222,128,0.12)",   border:"rgba(74,222,128,0.35)"  },
  { label:"Risque faible", color:"#fbbf24", bg:"rgba(251,191,36,0.12)",   border:"rgba(251,191,36,0.35)"  },
  { label:"Risque moyen",  color:"#fb923c", bg:"rgba(251,146,60,0.12)",   border:"rgba(251,146,60,0.35)"  },
  { label:"Risque élevé",  color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)" },
];

function genHistory() {
  const rows = [];
  const scs  = [0,0,0,1,0,0,2,0,1,0,0,0,3,0,1,0,0,2,0,0,1,0,0,0,1,0,0,3,0,0,1,0,0,2,0,1,0,0,0,1];
  const dirs = ["N","NE","E","SE","S","SO","O","NO"];
  for (let i = 0; i < 40; i++) {
    const d    = new Date(Date.now() - i * 3600000 * 4);
    const sc   = scs[i];
    const conf = (85 + Math.random() * 14).toFixed(1);
    const probs = [0,0,0,0].map((_,idx) => idx===sc ? (85+Math.random()*14).toFixed(1) : (Math.random()*5).toFixed(1));
    const prodPct = getProductionPct(sc, i);
    const prod    = getProductionState(sc);
    rows.push({
      id:i,
      date:d.toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}),
      time:d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),
      scenario:sc, label:RISK_META[sc].label, color:RISK_META[sc].color,
      bg:RISK_META[sc].bg, border:RISK_META[sc].border,
      confidence:conf,
      gasFlow:Math.round(800+Math.random()*2200),
      windDir:dirs[Math.floor(Math.random()*8)],
      windSpeed:(2+Math.random()*8).toFixed(1),
      temperature:(16+Math.random()*14).toFixed(1),
      humidity:Math.round(40+Math.random()*50),
      probabilities:{"Pas de risque":probs[0],"Risque faible":probs[1],"Risque moyen":probs[2],"Risque élevé":probs[3]},
      productionPct: prodPct,
      productionLabel: prod.label,
      productionColor: prod.color,
      productionBadge: prod.badge,
    });
  }
  return rows;
}
const ALL = genHistory();

export default function History() {
  const [filter,   setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      toast.success("Historique chargé", `${ALL.length} sessions récupérées`, 3000);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => filter==="all" ? ALL : ALL.filter(r => r.scenario===parseInt(filter)), [filter]);
  const counts   = useMemo(() => { const c=[0,0,0,0]; ALL.forEach(r=>c[r.scenario]++); return c; }, []);
  const avgConf  = (ALL.reduce((s,r) => s+parseFloat(r.confidence),0) / ALL.length).toFixed(1);
  const avgProd  = Math.round(ALL.reduce((s,r) => s+r.productionPct, 0) / ALL.length);

  const handleExport = () => {
    const header = "Date,Heure,Scénario,Confiance,État production,Production %,Débit gaz,Direction vent,Vitesse vent,Température,Humidité,Pas de risque %,Risque faible %,Risque moyen %,Risque élevé %\n";
    const rows   = ALL.map(r => `${r.date},${r.time},${r.label},${r.confidence}%,${r.productionLabel},${r.productionPct}%,${r.gasFlow},${r.windDir},${r.windSpeed} m/s,${r.temperature}°C,${r.humidity}%,${r.probabilities["Pas de risque"]},${r.probabilities["Risque faible"]},${r.probabilities["Risque moyen"]},${r.probabilities["Risque élevé"]}`).join("\n");
    const blob   = new Blob([header+rows], { type:"text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a"); a.href=url; a.download="historique_ocp_atmosafe.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV réussi", `${ALL.length} lignes exportées`, 3000);
  };

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div className="kpi-strip" style={{ gridTemplateColumns:"repeat(6,1fr)" }}>
        {Array.from({length:6}).map((_,i) => (
          <div key={i} style={{ background:"rgba(15,35,20,.7)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:11, padding:"1rem 1.1rem", display:"flex", flexDirection:"column", gap:".55rem" }}>
            <div style={{ height:10, width:70, borderRadius:6, background:"linear-gradient(90deg,rgba(55,85,52,.18) 25%,rgba(107,144,113,.22) 50%,rgba(55,85,52,.18) 75%)", backgroundSize:"600px 100%", animation:"shimmer 1.6s ease-in-out infinite" }}/>
            <div style={{ height:30, width:80, borderRadius:6, background:"linear-gradient(90deg,rgba(55,85,52,.18) 25%,rgba(107,144,113,.22) 50%,rgba(55,85,52,.18) 75%)", backgroundSize:"600px 100%", animation:"shimmer 1.6s ease-in-out infinite" }}/>
          </div>
        ))}
      </div>
      <SkeletonTable />
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {/* KPI strip */}
      <div className="kpi-strip animate-in" style={{ gridTemplateColumns:"repeat(6,1fr)" }}>
        {[
          { label:"Sans risque",    val:counts[0],    cls:"green", icon:<CheckCircle size={10}/>, tip:"Sessions sans détection de risque" },
          { label:"Risque faible",  val:counts[1],    cls:"amber", icon:<AlertTriangle size={10}/>, tip:"Sessions avec risque faible" },
          { label:"Risque moyen",   val:counts[2],    cls:"amber", icon:<TrendingUp size={10}/>, tip:"Sessions avec risque modéré" },
          { label:"Risque élevé",   val:counts[3],    cls:"red",   icon:<AlertTriangle size={10}/>, tip:"Sessions avec risque élevé — action requise" },
          { label:"Confiance moy.", val:`${avgConf}%`,cls:"blue",  icon:<TrendingUp size={10}/>, tip:"Confiance moyenne du modèle XGBoost" },
          { label:"Prod. moyenne",  val:`${avgProd}%`,cls:"green", icon:<Factory size={10}/>, tip:"Taux de production moyen sur toutes les sessions" },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.cls} animate-in`}>
            <div className="kpi-label">
              {k.icon} {k.label}
              <Tooltip content={k.tip} position="top">
                <Info size={9} style={{ marginLeft:"auto", opacity:.45, cursor:"help" }}/>
              </Tooltip>
            </div>
            <div className="kpi-value">{k.val}</div>
            <div className="kpi-sub">sessions</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="history-table-wrap animate-in">
        <div className="history-table-header">
          <h2><Clock size={15} style={{ marginRight:6, verticalAlign:"middle" }}/>Historique des prédictions</h2>
          <div style={{ display:"flex", alignItems:"center", gap:".65rem", flexWrap:"wrap" }}>
            <div style={{ display:"flex", gap:".4rem", flexWrap:"wrap" }}>
              <button className={`filter-btn${filter==="all"?" active":""}`} onClick={() => setFilter("all")}>Tous ({ALL.length})</button>
              {RISK_META.map((m,i) => (
                <button key={i} className={`filter-btn${filter===String(i)?" active":""}`}
                  onClick={() => setFilter(String(i))}
                  style={filter===String(i)?{borderColor:m.border,background:m.bg,color:m.color}:{}}>
                  {m.label} ({counts[i]})
                </button>
              ))}
            </div>
            <Tooltip content="Télécharger toutes les données en CSV" position="top">
              <button onClick={handleExport} style={{ display:"flex", alignItems:"center", gap:".35rem", padding:".3rem .85rem", borderRadius:"var(--radius-xs)", border:"1px solid rgba(107,144,113,.3)", background:"rgba(107,144,113,.1)", color:"var(--g300)", cursor:"pointer", fontSize:".73rem", fontWeight:600, fontFamily:"var(--font)" }}>
                <Download size={12}/> CSV
              </button>
            </Tooltip>
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date / Heure</th>
                <th>Scénario</th>
                <th>
                  <Tooltip content="Niveau de confiance du modèle XGBoost" position="top">
                    Confiance <Info size={9} style={{ verticalAlign:"middle", opacity:.55 }}/>
                  </Tooltip>
                </th>
                <th>
                  <Tooltip content="État de production de l'usine OCP selon le niveau de risque" position="top">
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Factory size={11}/> État production <Info size={9} style={{ opacity:.55 }}/>
                    </span>
                  </Tooltip>
                </th>
                <th>
                  <Tooltip content="Débit de gaz OCP simulé en m³/h" position="top">
                    Débit gaz <Info size={9} style={{ verticalAlign:"middle", opacity:.55 }}/>
                  </Tooltip>
                </th>
                <th>Vent</th>
                <th>Temp.</th>
                <th>Humidité</th>
                <th>
                  <Tooltip content="Mini-graphique des 4 probabilités de risque" position="top">
                    Probabilités <Info size={9} style={{ verticalAlign:"middle", opacity:.55 }}/>
                  </Tooltip>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <React.Fragment key={row.id}>
                  <tr onClick={() => setExpanded(expanded===row.id ? null : row.id)} style={{ cursor:"pointer" }}>
                    <td>
                      <div style={{ fontWeight:600, color:"var(--text-primary)", fontSize:".82rem" }}>{row.date}</div>
                      <div style={{ fontSize:".7rem", color:"var(--text-muted)" }}>{row.time}</div>
                    </td>
                    <td>
                      <span className="risk-pill" style={{ background:row.bg, border:`1px solid ${row.border}`, color:row.color }}>
                        {["✅","⚠️","🔶","🚨"][row.scenario]} {row.label}
                      </span>
                    </td>
                    <td style={{ fontFamily:"var(--font-display)", color:row.color, fontWeight:700 }}>{row.confidence}%</td>

                    {/* ── Colonne état de production ── */}
                    <td>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ fontSize:12 }}>{row.productionBadge}</span>
                          <span style={{ fontSize:".75rem", fontWeight:700, color:row.productionColor }}>{row.productionPct}%</span>
                        </div>
                        <div style={{ fontSize:".65rem", color:"var(--text-muted)", whiteSpace:"nowrap" }}>{row.productionLabel}</div>
                        <div style={{ width:72, height:4, borderRadius:2, background:"rgba(255,255,255,.07)", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${row.productionPct}%`, background:row.productionColor, borderRadius:2, transition:"width .6s" }}/>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight:600, color:"var(--text-primary)" }}>{row.gasFlow} m³/h</div>
                      <div style={{ height:3, borderRadius:2, background:"rgba(174,195,176,.1)", marginTop:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${(row.gasFlow/3000)*100}%`, background:row.gasFlow>2000?"#f87171":row.gasFlow>1500?"#fb923c":"#4ade80", borderRadius:2 }}/>
                      </div>
                    </td>
                    <td>
                      <span style={{ color:"var(--text-primary)", fontWeight:600 }}>{row.windDir}</span>
                      <span style={{ color:"var(--text-muted)", fontSize:".75rem", marginLeft:4 }}>{row.windSpeed} m/s</span>
                    </td>
                    <td style={{ color:"var(--text-primary)", fontWeight:600 }}>{row.temperature}°C</td>
                    <td style={{ color:"var(--text-primary)", fontWeight:600 }}>{row.humidity}%</td>
                    <td>
                      <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:22 }}>
                        {Object.entries(row.probabilities).map(([k,v],i) => (
                          <Tooltip key={k} content={`${k}: ${v}%`} position="top">
                            <div style={{ width:6, height:`${Math.max(parseFloat(v)/100*20,2)}px`, borderRadius:2, background:RISK_META[i].color, opacity:.85, cursor:"help" }}/>
                          </Tooltip>
                        ))}
                      </div>
                    </td>
                    <td style={{ color:"var(--text-muted)", fontSize:".75rem" }}>{expanded===row.id?"▲":"▼"}</td>
                  </tr>

                  {/* Ligne détail expandée */}
                  {expanded === row.id && (
                    <tr>
                      <td colSpan={10} style={{ background:"rgba(107,144,113,.04)", padding:"1rem 1.2rem" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:".75rem" }}>
                          {/* Probas */}
                          {Object.entries(row.probabilities).map(([k,v],i) => (
                            <div key={k} style={{ background:RISK_META[i].bg, border:`1px solid ${RISK_META[i].border}`, borderRadius:"var(--radius-sm)", padding:".75rem 1rem" }}>
                              <div style={{ fontSize:".62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:RISK_META[i].color, marginBottom:".35rem" }}>{k}</div>
                              <div style={{ fontFamily:"var(--font-display)", fontSize:"1.4rem", fontWeight:700, color:RISK_META[i].color }}>{v}%</div>
                              <div style={{ marginTop:".45rem", height:3, borderRadius:2, background:"rgba(255,255,255,.08)", overflow:"hidden" }}>
                                <div style={{ height:"100%", width:`${v}%`, background:RISK_META[i].color, borderRadius:2 }}/>
                              </div>
                            </div>
                          ))}
                          {/* État de production détaillé */}
                          <div style={{ background:`${row.productionColor}14`, border:`1px solid ${row.productionColor}44`, borderRadius:"var(--radius-sm)", padding:".75rem 1rem", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                            <div style={{ fontSize:".62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:row.productionColor, marginBottom:".5rem", display:"flex", alignItems:"center", gap:4 }}>
                              <Factory size={10}/> État production
                            </div>
                            <div style={{ position:"relative", width:64, height:64, margin:"0 auto .5rem" }}>
                              <svg viewBox="0 0 64 64" style={{ transform:"rotate(-90deg)" }}>
                                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
                                <circle cx="32" cy="32" r="26" fill="none" stroke={row.productionColor} strokeWidth="6" strokeLinecap="round"
                                  strokeDasharray={`${2*Math.PI*26}`}
                                  strokeDashoffset={`${2*Math.PI*26*(1-row.productionPct/100)}`}
                                />
                              </svg>
                              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"1.1rem", fontWeight:700, color:row.productionColor }}>
                                {row.productionPct}%
                              </div>
                            </div>
                            <div style={{ fontSize:".72rem", fontWeight:700, color:row.productionColor }}>{row.productionBadge} {row.productionLabel}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="history-stats">
          <div className="hstat"><div className="hstat-val">{ALL.length}</div><div className="hstat-lbl">Total sessions</div></div>
          <div className="hstat"><div className="hstat-val" style={{ color:"#4ade80" }}>{((counts[0]/ALL.length)*100).toFixed(0)}%</div><div className="hstat-lbl">Sans risque</div></div>
          <div className="hstat"><div className="hstat-val" style={{ color:"#f87171" }}>{counts[2]+counts[3]}</div><div className="hstat-lbl">Risques critiques</div></div>
          <div className="hstat"><div className="hstat-val" style={{ color:"var(--g300)" }}>{avgConf}%</div><div className="hstat-lbl">Confiance moyenne</div></div>
          <div className="hstat"><div className="hstat-val" style={{ color:"#4ade80" }}>{avgProd}%</div><div className="hstat-lbl">Production moy.</div></div>
        </div>
      </div>
    </div>
  );
}