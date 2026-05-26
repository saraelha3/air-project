export const RISK_CONFIG = {
  0: { label:"Pas de risque", color:"#4ade80", bg:"rgba(74,222,128,0.1)",   border:"rgba(74,222,128,0.3)",   icon:"✅" },
  1: { label:"Risque faible", color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.3)",   icon:"⚠️" },
  2: { label:"Risque moyen",  color:"#fb923c", bg:"rgba(251,146,60,0.1)",   border:"rgba(251,146,60,0.3)",   icon:"🔶" },
  3: { label:"Risque élevé",  color:"#f87171", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.35)", icon:"🚨" },
};
export const getRiskConfig = s => RISK_CONFIG[s] ?? RISK_CONFIG[0];
export const getRiskColor   = s => getRiskConfig(s).color;
export const isHighRisk     = s => s >= 2;