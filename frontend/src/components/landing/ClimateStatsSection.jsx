import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Thermometer, Droplets, Wind, Activity, Cloud, Flame, Gauge } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: <Thermometer size={20}/>, label: "Temperature", value: "28°C", color: "red", sparkData: [22,24,26,28,27,29,28,30,28,26,25,28] },
  { icon: <Droplets size={20}/>, label: "Humidity", value: "65%", color: "blue", sparkData: [60,62,65,63,68,65,70,67,65,64,66,65] },
  { icon: <Wind size={20}/>, label: "Wind Speed", value: "12.4 m/s", color: "teal", sparkData: [8,10,12,11,14,12,10,13,12,11,12,12] },
  { icon: <Activity size={20}/>, label: "Air Quality (AQI)", value: "42", color: "green", sparkData: [50,48,45,42,44,40,42,38,40,43,41,42] },
  { icon: <Cloud size={20}/>, label: "CO₂ Levels", value: "385 ppm", color: "purple", sparkData: [380,382,385,383,387,385,390,388,385,384,386,385] },
  { icon: <Flame size={20}/>, label: "PM2.5", value: "18 µg/m³", color: "orange", sparkData: [20,19,18,17,19,18,22,20,18,17,16,18] },
  { icon: <Gauge size={20}/>, label: "PM10", value: "35 µg/m³", color: "gold", sparkData: [30,32,35,33,38,35,40,37,35,34,33,35] },
];

const colorMap = {
  red: "#ef4444", blue: "#3b82f6", teal: "#14b8a6", green: "#16a34a",
  purple: "#8b5cf6", orange: "#f97316", gold: "#D4AF37"
};

export default function ClimateStatsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const cards = ref.current.querySelectorAll(".l-stat-card");
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" }
    });
  }, []);

  return (
    <section className="l-section l-section-alt" id="climate-stats" ref={ref}>
      <div className="l-container">
        <div className="l-section-title">
          <div className="l-badge">📊 Live Data</div>
          <h2>Climate & Air Quality Stats</h2>
          <p>Real-time environmental data from monitoring stations in Safi</p>
        </div>
        <div className="l-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="l-stat-card l-glass">
              <div className="l-stat-card-header">
                <div className={`l-stat-card-icon ${s.color}`}>{s.icon}</div>
                <div className="l-pulse-dot" />
              </div>
              <div className="l-stat-card-value">{s.value}</div>
              <div className="l-stat-card-label">{s.label}</div>
              <div className="l-stat-sparkline">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={s.sparkData.map((v, j) => ({ v }))}>
                    <Line type="monotone" dataKey="v" stroke={colorMap[s.color]} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
