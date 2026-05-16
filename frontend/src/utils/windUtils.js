/**
 * Convert wind degrees to a compass direction label.
 */
export function degreeToDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
  return dirs[idx];
}

/**
 * Return a human-readable description of wind blowing
 * from the given direction.
 */
export function windDescription(direction) {
  const map = {
    N: "Vent du Nord",
    NE: "Vent du Nord-Est",
    E: "Vent d'Est",
    SE: "Vent du Sud-Est",
    S: "Vent du Sud",
    SO: "Vent du Sud-Ouest",
    O: "Vent d'Ouest",
    NO: "Vent du Nord-Ouest",
  };
  return map[direction] || direction;
}

/**
 * Check if wind blows from the OCP plant (south) towards
 * the city (north).  Southern winds (135°–225°) carry risk.
 */
export function isWindDangerous(deg) {
  return deg >= 135 && deg <= 225;
}
