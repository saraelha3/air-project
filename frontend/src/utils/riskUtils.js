export const RISK_CONFIG = {
  0: { label:"Pas de risque", color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.3)",   icon:"✅" },
  1: { label:"Risque faible", color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.3)",   icon:"⚠️" },
  2: { label:"Risque moyen",  color:"#fb923c", bg:"rgba(251,146,60,0.1)",   border:"rgba(251,146,60,0.3)",   icon:"🔶" },
  3: { label:"Risque élevé",  color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)", icon:"🚨" },
};
export const getRiskConfig = s => RISK_CONFIG[s] ?? RISK_CONFIG[0];
export const getRiskColor   = s => getRiskConfig(s).color;
export const isHighRisk     = s => s >= 1; // Visible sur tous les niveaux

// ── État de production selon le niveau de risque ──────────────────────────
// scenario 0 : Pas de risque → production normale
// scenario 1 : Risque faible → légère réduction
// scenario 2 : Risque moyen  → réduction importante
// scenario 3 : Risque élevé  → quasi-arrêt
export const PRODUCTION_STATES = {
  0: { min:90, max:100, label:"Normale",     color:"#4ade80", badge:"🟢" },
  1: { min:60, max:89,  label:"Réduite",     color:"#fbbf24", badge:"🟡" },
  2: { min:20, max:59,  label:"Très réduite",color:"#fb923c", badge:"🟠" },
  3: { min:0,  max:19,  label:"Arrêt préventif", color:"#f87171", badge:"🔴" },
};

/**
 * Retourne un pourcentage de production cohérent avec le niveau de risque.
 * La valeur est semi-aléatoire mais déterministe par rapport au niveau.
 */
export function getProductionPct(scenario, seed = 0) {
  const { min, max } = PRODUCTION_STATES[scenario] ?? PRODUCTION_STATES[0];
  // Pseudo-aléatoire reproductible
  const rng = (Math.sin(seed * 9301 + 49297) * 233280);
  const pct = Math.round(min + ((rng - Math.floor(rng)) * (max - min)));
  return Math.min(max, Math.max(min, pct));
}

export const getProductionState = s => PRODUCTION_STATES[s] ?? PRODUCTION_STATES[0];