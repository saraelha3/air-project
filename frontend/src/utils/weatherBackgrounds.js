/**
 * Weather backgrounds system
 * Each condition has:
 *  - url: primary image (local or CDN)
 *  - fallbacks: backup URLs if primary fails
 *  - gradient: CSS gradient (always shown, image overlaid on top)
 *  - overlay: extra radial glow
 */

export const WEATHER_BG = {
  sunny: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?w=1400",
      "https://picsum.photos/seed/sunny/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 30% 20%, rgba(255,210,80,0.15) 0%, transparent 55%)",
    gradient: "linear-gradient(135deg, #1a2e1c 0%, #0f1f0f 100%)",
  },
  cloudy: {
    url: "https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?w=1400",
      "https://picsum.photos/seed/cloudy/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(180,200,220,0.08) 0%, transparent 60%)",
    gradient: "linear-gradient(135deg, #1a2030 0%, #121820 100%)",
  },
  rainy: {
    url: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?w=1400",
      "https://picsum.photos/seed/rainy/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 50% 40%, rgba(100,140,200,0.08) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0a1e3c 0%, #0f1a30 100%)",
  },
  stormy: {
    url: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?w=1400",
      "https://picsum.photos/seed/storm/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 50% 30%, rgba(100,60,180,0.06) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #0f0a22 0%, #1a1030 100%)",
  },
  foggy: {
    // Ton image personnalisée — doit être dans frontend/public/bg-cloudy.jpg
    url: "/bg-cloudy.jpg",
    fallbacks: [
      "https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=1400&q=75&auto=format",
      "https://picsum.photos/seed/foggy/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 50% 50%, rgba(160,170,180,0.06) 0%, transparent 70%)",
    gradient: "linear-gradient(135deg, #141418 0%, #1c1c22 100%)",
  },
  night: {
    url: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1400&q=75&auto=format",
    fallbacks: [
      "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?w=1400",
      "https://picsum.photos/seed/night/1400/800",
    ],
    overlay: "radial-gradient(ellipse at 50% 20%, rgba(80,100,200,0.1) 0%, transparent 60%)",
    gradient: "linear-gradient(135deg, #05080f 0%, #0a1020 100%)",
  },
};

export function getWeatherBg(description, icon) {
  const d = (description || "").toLowerCase();
  const isNight = icon && icon.endsWith("n");
  if (d.includes("orage") || d.includes("thunder") || d.includes("storm")) return WEATHER_BG.stormy;
  if (d.includes("pluie") || d.includes("rain") || d.includes("bruine") || d.includes("drizzle")) return WEATHER_BG.rainy;
  if (d.includes("brouillard") || d.includes("fog") || d.includes("mist") || d.includes("brume")) return WEATHER_BG.foggy;
  if (d.includes("nuageux") || d.includes("cloud") || d.includes("couvert") || d.includes("overcast") || d.includes("nuage")) return WEATHER_BG.cloudy;
  if (isNight) return WEATHER_BG.night;
  return WEATHER_BG.sunny;
}