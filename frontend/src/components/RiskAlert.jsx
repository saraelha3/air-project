import React from "react";
import { getRiskConfig, getProductionState, getProductionPct } from "../utils/riskUtils";
import { ShieldAlert, AlertTriangle, CheckCircle, Factory } from "lucide-react";

const ALERT_MESSAGES = {
  0: {
    title: "Conditions atmosphériques normales — OCP Safi",
    body:  "Aucun polluant à risque détecté. La dispersion atmosphérique est favorable. Les émissions de l'usine restent dans les normes réglementaires. Aucune mesure corrective n'est requise.",
    action: "Surveillance continue active — prochain relevé dans 15 min.",
  },
  1: {
    title: "Risque faible de pollution atmosphérique détecté",
    body:  "Les conditions météorologiques présentent un risque modéré de transport de polluants vers les zones habitées. La vitesse du vent et la direction favorisent une légère accumulation locale. Une surveillance renforcée est recommandée.",
    action: "Recommandation : réduire le débit des cheminées secondaires et surveiller les capteurs PM10.",
  },
  2: {
    title: "⚠️ Risque moyen — Vigilance environnementale requise",
    body:  "Les modèles de dispersion indiquent un transport significatif de polluants (SO₂, PM2.5, NOx) vers les quartiers résidentiels de Safi. La stabilité atmosphérique limite la dilution naturelle. Des mesures préventives doivent être activées immédiatement.",
    action: "Action requise : réduire la production, informer les autorités locales, activer le protocole de réduction des émissions.",
  },
  3: {
    title: "🚨 RISQUE ÉLEVÉ — Alerte environnementale critique",
    body:  "Situation critique : les conditions atmosphériques sont extrêmement défavorables à la dispersion des polluants. Les concentrations prédites en SO₂ et PM2.5 dépassent les seuils réglementaires. La population des quartiers proches de l'usine est potentiellement exposée. Un arrêt préventif partiel de la production est fortement recommandé.",
    action: "⛔ Déclencher le protocole d'urgence environnementale. Contacter la Direction HSE. Notifier les autorités (ONEE, RADEEF). Fermeture des cheminées principales.",
  },
};

export default function RiskAlert({ scenario, label, confidence }) {
  const cfg   = getRiskConfig(scenario);
  const prod  = getProductionState(scenario);
  const prodPct = getProductionPct(scenario, scenario * 7 + (confidence ? Math.round(parseFloat(confidence)) : 0));
  const msg   = ALERT_MESSAGES[scenario] ?? ALERT_MESSAGES[0];
  const Icon  = scenario === 3 ? ShieldAlert : scenario === 0 ? CheckCircle : AlertTriangle;

  return (
    <div
      className="animate-in"
      style={{
        background:   `linear-gradient(135deg, ${cfg.bg}, rgba(0,0,0,0.2))`,
        border:       `1.5px solid ${cfg.color}55`,
        borderRadius: "var(--radius)",
        padding:      "1.5rem 1.8rem",
        boxShadow:    `0 0 30px ${cfg.color}18, 0 4px 24px rgba(0,0,0,0.3)`,
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      {/* Fond décoratif */}
      <div style={{
        position:"absolute", top:-30, right:-30, width:140, height:140,
        borderRadius:"50%", background:`${cfg.color}08`, border:`1px solid ${cfg.color}15`,
        pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", top:-60, right:-60, width:200, height:200,
        borderRadius:"50%", background:`${cfg.color}04`, pointerEvents:"none",
      }}/>

      {/* ── Ligne principale ── */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:"1.2rem" }}>

        {/* Icône niveau */}
        <div style={{
          width:52, height:52, borderRadius:"50%", flexShrink:0,
          background:`${cfg.color}18`, border:`2px solid ${cfg.color}55`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon size={22} style={{ color:cfg.color }}/>
        </div>

        {/* Texte gauche */}
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", flexWrap:"wrap", marginBottom:".65rem" }}>
            <h3 style={{ color:cfg.color, fontWeight:700, fontSize:".95rem", lineHeight:1.3, margin:0 }}>
              {msg.title}
            </h3>
            {confidence && (
              <span style={{
                fontSize:".65rem", fontWeight:700, padding:"2px 8px",
                borderRadius:20, background:`${cfg.color}22`, color:cfg.color,
                letterSpacing:".06em", textTransform:"uppercase", border:`1px solid ${cfg.color}40`,
              }}>
                {confidence}% confiance
              </span>
            )}
          </div>

          {/* Corps du message */}
          <p style={{
            color:"var(--text-secondary)", fontSize:".85rem", lineHeight:1.7,
            margin:"0 0 .75rem 0", maxWidth:700,
          }}>
            {msg.body}
          </p>

          {/* Recommandation */}
          <div style={{
            background:"rgba(0,0,0,0.2)", borderRadius:"var(--radius-sm)",
            padding:".6rem .9rem", border:`1px solid ${cfg.color}25`,
            fontSize:".78rem", color:"var(--text-muted)", lineHeight:1.5,
          }}>
            <span style={{ color:cfg.color, fontWeight:700 }}>→ </span>
            {msg.action}
          </div>
        </div>

        {/* ── Bloc état de production ── */}
        <div style={{
          flexShrink:0, minWidth:150,
          background:"rgba(0,0,0,0.25)", border:`1.5px solid ${prod.color}44`,
          borderRadius:"var(--radius-sm)", padding:"1rem 1.2rem",
          textAlign:"center",
          boxShadow:`0 0 16px ${prod.color}15`,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginBottom:".5rem" }}>
            <Factory size={13} style={{ color:prod.color }}/>
            <span style={{ fontSize:".65rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:".08em" }}>
              État de production
            </span>
          </div>

          {/* Jauge circulaire simple */}
          <div style={{ position:"relative", width:80, height:80, margin:"0 auto .6rem" }}>
            <svg viewBox="0 0 80 80" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke={prod.color} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - prodPct / 100)}`}
                style={{ transition:"stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div style={{
              position:"absolute", inset:0, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ fontFamily:"var(--font-display)", fontSize:"1.4rem", fontWeight:700, color:prod.color, lineHeight:1 }}>
                {prodPct}%
              </span>
            </div>
          </div>

          <div style={{ fontSize:".78rem", fontWeight:700, color:prod.color, marginBottom:".2rem" }}>
            {prod.badge} {prod.label}
          </div>
          <div style={{ fontSize:".68rem", color:"var(--text-muted)" }}>
            Capacité nominale : 100%
          </div>
        </div>
      </div>
    </div>
  );
}