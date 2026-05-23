import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Shield, BarChart3, Radio } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const els = sectionRef.current.querySelectorAll(".gs-hidden, .gs-hidden-left, .gs-hidden-right");
    els.forEach(el => {
      const isLeft = el.classList.contains("gs-hidden-left");
      const isRight = el.classList.contains("gs-hidden-right");
      gsap.to(el, {
        opacity: 1, x: 0, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
      });
    });
  }, []);

  return (
    <section className="l-section" id="about" ref={sectionRef}>
      <div className="l-container">
        <div className="l-about-grid">
          <div className="l-about-map gs-hidden-left">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified Morocco map outline */}
              <path d="M120 60 L200 40 L280 55 L310 100 L320 160 L330 200 L340 260 L300 320 L240 360 L180 370 L130 340 L100 290 L80 230 L90 170 L100 120 Z"
                stroke="var(--accent-green)" strokeWidth="2" fill="rgba(22,163,74,0.06)" strokeLinejoin="round"/>
              {/* Safi marker */}
              <circle cx="145" cy="215" r="8" fill="var(--accent-green)" opacity="0.3">
                <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="145" cy="215" r="5" fill="var(--accent-green)"/>
              <text x="160" y="210" fill="var(--accent-gold)" fontSize="14" fontWeight="700" fontFamily="Inter">Safi</text>
              <text x="160" y="226" fill="var(--text-muted)" fontSize="10" fontFamily="Inter">OCP Industrial Zone</text>
              {/* Other cities for reference */}
              <circle cx="165" cy="155" r="3" fill="var(--text-muted)" opacity="0.5"/>
              <text x="175" y="158" fill="var(--text-muted)" fontSize="9" fontFamily="Inter" opacity="0.5">Casablanca</text>
              <circle cx="200" cy="135" r="3" fill="var(--text-muted)" opacity="0.5"/>
              <text x="210" y="138" fill="var(--text-muted)" fontSize="9" fontFamily="Inter" opacity="0.5">Rabat</text>
              <circle cx="170" cy="260" r="3" fill="var(--text-muted)" opacity="0.5"/>
              <text x="180" y="263" fill="var(--text-muted)" fontSize="9" fontFamily="Inter" opacity="0.5">Marrakech</text>
              {/* Dashed connection lines */}
              <line x1="145" y1="215" x2="165" y2="155" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4"/>
              <line x1="145" y1="215" x2="170" y2="260" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="4"/>
            </svg>
          </div>

          <div className="l-about-text gs-hidden-right">
            <h3>Protecting Safi's Environment Through Data & AI</h3>
            <p>
              OCP Air is an advanced atmospheric surveillance platform designed for the
              city of Safi, Morocco — home to one of the world's largest phosphate
              processing facilities operated by OCP Group.
            </p>
            <p>
              Our mission is to monitor real-time air quality, predict environmental
              risks using machine learning, and provide actionable insights that help
              balance industrial productivity with public health and environmental protection.
            </p>

            <div className="l-about-features">
              <div className="l-about-feature">
                <div className="l-about-feature-icon"><Cpu size={18} /></div>
                <div>
                  <h4>AI-Powered Predictions</h4>
                  <p>XGBoost ML model for risk analysis</p>
                </div>
              </div>
              <div className="l-about-feature">
                <div className="l-about-feature-icon"><Radio size={18} /></div>
                <div>
                  <h4>Real-time Monitoring</h4>
                  <p>Live climate & air quality data</p>
                </div>
              </div>
              <div className="l-about-feature">
                <div className="l-about-feature-icon"><Shield size={18} /></div>
                <div>
                  <h4>Safety Alerts</h4>
                  <p>Instant production risk notifications</p>
                </div>
              </div>
              <div className="l-about-feature">
                <div className="l-about-feature-icon"><BarChart3 size={18} /></div>
                <div>
                  <h4>Data Analytics</h4>
                  <p>Historical trends & reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
