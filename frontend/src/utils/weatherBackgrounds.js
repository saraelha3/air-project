export const WEATHER_BG = {
  sunny:  { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 30% 20%, rgba(255,210,80,0.18) 0%, transparent 55%)", gradient:"linear-gradient(135deg,rgba(20,50,25,0.55) 0%,rgba(30,90,30,0.35) 100%)" },
  cloudy: { url:"https://images.unsplash.com/photo-1534274988757-a28bf1a4c817?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 50% 30%, rgba(180,200,220,0.1) 0%, transparent 60%)", gradient:"linear-gradient(135deg,rgba(30,50,70,0.6) 0%,rgba(50,70,90,0.4) 100%)" },
  rainy:  { url:"https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 50% 40%, rgba(100,150,200,0.1) 0%, transparent 70%)", gradient:"linear-gradient(135deg,rgba(10,30,60,0.7) 0%,rgba(20,50,90,0.5) 100%)" },
  stormy: { url:"https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 50% 30%, rgba(120,80,200,0.08) 0%, transparent 70%)", gradient:"linear-gradient(135deg,rgba(15,10,35,0.75) 0%,rgba(40,25,70,0.55) 100%)" },
  foggy:  { url:"https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 50% 50%, rgba(200,210,205,0.12) 0%, transparent 70%)", gradient:"linear-gradient(135deg,rgba(30,40,35,0.65) 0%,rgba(50,60,55,0.45) 100%)" },
  night:  { url:"https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1600&h=900&fit=crop&q=80", overlay:"radial-gradient(ellipse at 50% 20%, rgba(80,100,180,0.12) 0%, transparent 60%)", gradient:"linear-gradient(135deg,rgba(5,10,25,0.8) 0%,rgba(10,20,45,0.6) 100%)" },
};

export function getWeatherBg(description, icon) {
  const d = (description || "").toLowerCase();
  const isNight = icon && icon.endsWith("n");
  if (d.includes("orage") || d.includes("thunder")) return WEATHER_BG.stormy;
  if (d.includes("pluie") || d.includes("rain") || d.includes("bruine") || d.includes("drizzle")) return WEATHER_BG.rainy;
  if (d.includes("brouillard") || d.includes("fog") || d.includes("mist") || d.includes("brume")) return WEATHER_BG.foggy;
  if (d.includes("nuageux") || d.includes("cloud") || d.includes("couvert") || d.includes("overcast")) return WEATHER_BG.cloudy;
  if (isNight) return WEATHER_BG.night;
  return WEATHER_BG.sunny;
}