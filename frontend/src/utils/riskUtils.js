/**
 * Risk-level helpers — Neon theme.
 */

export const RISK_CONFIG = {
  0: { label: "Pas de risque", color: "#00e676", bg: "rgba(0,230,118,0.1)",  icon: "✅" },
  1: { label: "Risque faible", color: "#ffab00", bg: "rgba(255,171,0,0.1)",  icon: "⚠️" },
  2: { label: "Risque moyen",  color: "#ff6d00", bg: "rgba(255,109,0,0.1)",  icon: "🔶" },
  3: { label: "Risque élevé",  color: "#ff3d57", bg: "rgba(255,61,87,0.12)", icon: "🚨" },
};

export function getRiskConfig(scenario) {
  return RISK_CONFIG[scenario] ?? RISK_CONFIG[0];
}

export function getRiskColor(scenario) {
  return getRiskConfig(scenario).color;
}

export function isHighRisk(scenario) {
  return scenario >= 2;
}
