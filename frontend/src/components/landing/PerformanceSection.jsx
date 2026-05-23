import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const kpis = [
  { value: 12, suffix: "", label: "Monitoring Stations" },
  { value: 2.4, suffix: "M+", label: "Data Points Collected" },
  { value: 3, suffix: "", label: "Cities Covered" },
  { value: 99.7, suffix: "%", label: "System Uptime" },
];

const timeline = [
  { date: "Jan 2025", title: "Project Inception", desc: "Research and feasibility study for atmospheric monitoring in Safi" },
  { date: "Mar 2025", title: "Data Collection", desc: "Deployed initial weather sensors and air quality monitors" },
  { date: "Jun 2025", title: "ML Model Training", desc: "Built and trained XGBoost prediction model on historical data" },
  { date: "Sep 2025", title: "Platform Launch", desc: "Public dashboard and real-time monitoring system goes live" },
  { date: "Jan 2026", title: "AI Expansion", desc: "Added multi-city support and advanced risk prediction algorithms" },
];

export default function PerformanceSection() {
  const ref = useRef(null);

  useEffect(() => {
    // Animate KPI counters
    ref.current.querySelectorAll(".l-kpi-counter").forEach((el, i) => {
      const target = kpis[i].value;
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target, duration: 2,
        snap: { innerText: target % 1 === 0 ? 1 : 0.1 },
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // Animate timeline items
    ref.current.querySelectorAll(".l-timeline-item").forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });
  }, []);

  return (
    <section className="l-section l-section-alt" id="performance" ref={ref}>
      <div className="l-container">
        <div className="l-section-title">
          <div className="l-badge">🚀 Performance</div>
          <h2>Project Milestones & KPIs</h2>
          <p>Tracking our progress in environmental monitoring excellence</p>
        </div>

        <div className="l-kpi-grid">
          {kpis.map((k, i) => (
            <div key={i} className="l-kpi-card l-glass">
              <div className="l-kpi-value">
                <span className="l-kpi-counter">{0}</span>{k.suffix}
              </div>
              <div className="l-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="l-timeline">
          {timeline.map((t, i) => (
            <div key={i} className="l-timeline-item" style={{ opacity: 0 }}>
              <div className="l-timeline-content">
                <div className="l-timeline-date">{t.date}</div>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
              <div className="l-timeline-dot" />
              <div className="l-timeline-content" style={{ visibility: "hidden" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
