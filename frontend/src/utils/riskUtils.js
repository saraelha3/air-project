/**
 * Risk-level helpers — OCP Green theme.
 */

export const RISK_CONFIG = {
  0: { label: "Pas de risque", color: "#4ade80", bg: "rgba(74,222,128,0.12)", icon: "✅", gradient: "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.05))" },
  1: { label: "Risque faible",  color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  icon: "⚠️", gradient: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))" },
  2: { label: "Risque moyen",   color: "#fb923c", bg: "rgba(251,146,60,0.12)",  icon: "🔶", gradient: "linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))" },
  3: { label: "Risque élevé",   color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: "🚨", gradient: "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.05))" },
};

export const RISK_LABELS = ["Pas de risque", "Risque faible", "Risque moyen", "Risque élevé"];
export const RISK_COLORS = ["#4ade80", "#fbbf24", "#fb923c", "#f87171"];

export function getRiskConfig(scenario) {
  return RISK_CONFIG[scenario] ?? RISK_CONFIG[0];
}

export function getRiskColor(scenario) {
  return getRiskConfig(scenario).color;
}

export function getRiskColorByLabel(label) {
  const entry = Object.values(RISK_CONFIG).find(r => r.label === label);
  return entry?.color ?? "#6B9071";
}

export function isHighRisk(scenario) {
  return scenario >= 2;
}
