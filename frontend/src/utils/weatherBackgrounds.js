import { CLOUDY_SKY_IMG } from "./cloudyImage";

/**
 * Weather background system for OCP AtmoSafe
 * - Local images: embedded as base64 (always load)
 * - External: Unsplash CDN (may fail on some networks)
 * - gradient: always shown as CSS fallback
 */
export const WEATHER_BG = {
  sunny: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=72&auto=format&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1504608524841-42584120d693?w=1400&q=72&auto=format",
    ],
    overlay: "radial-gradient(ellipse at 30% 20%, rgba(255,210,80,0.15) 0%, transparent 55%)",
    gradient: "linear-gradient(135deg, #1a2e1c 0%, #0f1f0f 100%)",
  },

  // Nuageux / Partiellement nuageux / Couvert / Peu nuageux
  // → utilise l'image réelle embarquée en base64
  cloudy: {
    url: CLOUDY_SKY_IMG,
    fallbacks: [],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(120,135,160,0.06) 0%, transparent 60%)",
    gradient: "linear-gradient(135deg, #141820 0%, #1a1e28 100%)",
  },

  rainy: {
    url: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1400&q=72&auto=format&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1400&q=72&auto=format",
    ],
    overlay: "radial-gradient(ellipse at 50% 40%, rgba(100,140,200,0.08) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0a1e3c 0%, #0f1a30 100%)",
  },

  stormy: {
    // Stormy also uses our dramatic cloud photo
    url: CLOUDY_SKY_IMG,
    fallbacks: [],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(80,40,160,0.08) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0f0a22 0%, #1a1030 100%)",
  },

  foggy: {
    url: CLOUDY_SKY_IMG,
    fallbacks: [],
    overlay: "radial-gradient(ellipse at 50% 50%, rgba(180,185,200,0.07) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #141418 0%, #1c1c22 100%)",
  },

  night: {
    url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1400&q=72&auto=format&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1400&q=72&auto=format",
    ],
    overlay: "radial-gradient(ellipse at 50% 20%, rgba(80,100,200,0.1) 0%, transparent 60%)",
    gradient: "linear-gradient(135deg, #05080f 0%, #0a1020 100%)",
  },
};

export function getWeatherBg(description, icon) {
  const d = (description || "").toLowerCase();
  const isNight = icon && icon.endsWith("n");

  if (d.includes("orage") || d.includes("thunder") || d.includes("storm"))
    return WEATHER_BG.stormy;

  if (d.includes("pluie") || d.includes("rain") || d.includes("bruine") || d.includes("drizzle"))
    return WEATHER_BG.rainy;

  if (d.includes("brouillard") || d.includes("fog") || d.includes("mist") || d.includes("brume"))
    return WEATHER_BG.foggy;

  // Toutes variantes nuageuses → image réelle embarquée
  if (
    d.includes("nuage") || d.includes("nuageux") ||
    d.includes("cloud") || d.includes("couvert") ||
    d.includes("overcast") || d.includes("partiellement") ||
    d.includes("peu") || d.includes("mostly") || d.includes("clair")
  ) return WEATHER_BG.cloudy;

  if (isNight) return WEATHER_BG.night;

  return WEATHER_BG.sunny;
}