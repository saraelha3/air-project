export const WEATHER_BG = {
  sunny: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?w=1400",
    ],
    overlay: "radial-gradient(ellipse at 30% 20%, rgba(255,210,80,0.15) 0%, transparent 55%)",
    gradient: "linear-gradient(135deg, #1a2e1c 0%, #0f1f0f 100%)",
  },

  // ── Cloudy + Partiellement nuageux + Couvert ──
  // Utilise ton image locale bg-cloudy.jpg dans frontend/public/
  cloudy: {
    url: "/bg-cloudy.jpg",
    fallbacks: [],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(140,155,175,0.08) 0%, transparent 60%)",
    gradient: "linear-gradient(135deg, #141820 0%, #1a1e28 100%)",
  },

  rainy: {
    url: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?w=1400",
    ],
    overlay: "radial-gradient(ellipse at 50% 40%, rgba(100,140,200,0.08) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0a1e3c 0%, #0f1a30 100%)",
  },

  stormy: {
    url: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?w=1400",
    ],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(100,60,180,0.06) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0f0a22 0%, #1a1030 100%)",
  },

  // foggy utilise aussi bg-cloudy.jpg comme fallback réaliste
  foggy: {
    url: "/bg-cloudy.jpg",
    fallbacks: [],
    overlay: "radial-gradient(ellipse at 50% 50%, rgba(160,170,180,0.06) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #141418 0%, #1c1c22 100%)",
  },

  night: {
    url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?w=1400",
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

  // Toutes les variantes nuageuses → bg-cloudy.jpg
  if (
    d.includes("nuageux") || d.includes("nuage") ||
    d.includes("cloud") || d.includes("couvert") ||
    d.includes("overcast") || d.includes("partiellement") ||
    d.includes("peu nuageux") || d.includes("mostly")
  ) return WEATHER_BG.cloudy;

  if (isNight) return WEATHER_BG.night;

  return WEATHER_BG.sunny;
}