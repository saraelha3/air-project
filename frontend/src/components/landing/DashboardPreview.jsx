import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const lineData = Array.from({ length: 24 }, (_, i) => ({
  h: i, temp: 22 + Math.sin(i / 4) * 6, hum: 55 + Math.cos(i / 3) * 15
}));
const barData = [
  { day: "Mon", pm25: 18, pm10: 35 }, { day: "Tue", pm25: 22, pm10: 40 },
  { day: "Wed", pm25: 15, pm10: 30 }, { day: "Thu", pm25: 25, pm10: 45 },
  { day: "Fri", pm25: 20, pm10: 38 },
];
const pieData = [
  { name: "PM2.5", value: 35 }, { name: "PM10", value: 25 },
  { name: "CO", value: 15 }, { name: "SO₂", value: 15 }, { name: "NO₂", value: 10 },
];
const COLORS = ["#16a34a", "#3b82f6", "#D4AF37", "#8b5cf6", "#f97316"];

export default function DashboardPreview() {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 50, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" }
    });
  }, []);

  return (
    <section className="l-section l-section-alt" id="dashboard-preview">
      <div className="l-container">
        <div className="l-section-title">
          <div className="l-badge">📈 Dashboard</div>
          <h2>Real-Time Dashboard Preview</h2>
          <p>Comprehensive analytics and monitoring at your fingertips</p>
        </div>

        <div className="l-dash-preview" ref={ref}>
          <div className="l-dash-grid">
            <div className="l-dash-thumb">
              <ResponsiveContainer width="90%" height="80%">
                <LineChart data={lineData}>
                  <Line type="monotone" dataKey="temp" stroke="#16a34a" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="hum" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="l-dash-thumb">
              <ResponsiveContainer width="90%" height="80%">
                <BarChart data={barData}>
                  <Bar dataKey="pm25" fill="#D4AF37" radius={[4,4,0,0]} />
                  <Bar dataKey="pm10" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="l-dash-thumb">
              <ResponsiveContainer width="90%" height="80%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="l-dash-thumb" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#16a34a" strokeWidth="6"
                  strokeDasharray={2*Math.PI*32} strokeDashoffset={2*Math.PI*32*0.15}
                  strokeLinecap="round" transform="rotate(-90 40 40)"
                  style={{ filter: "drop-shadow(0 0 6px rgba(22,163,74,0.4))" }}/>
                <text x="40" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">85%</text>
              </svg>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>AQI Gauge</span>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a href="/dashboard" className="l-btn l-btn-primary">
              Open Full Dashboard <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
