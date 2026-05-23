import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Wind, Thermometer, Droplets, Activity } from "lucide-react";

export default function HeroSection() {
  const canvasRef = useRef(null);
  const statsRef = useRef(null);
  const contentRef = useRef(null);

  // Particle system for smoke/gas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 1.2 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 150;
        this.hue = Math.random() > 0.7 ? 140 : 210;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        this.opacity = Math.max(0, this.opacity * (1 - this.life / this.maxLife));
        if (this.life > this.maxLife) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 60%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(contentRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo(".l-hero-btns > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 }, "-=0.4");

    // Animate stat counters
    const targets = [
      { el: "#stat-wind", end: 12.4 },
      { el: "#stat-temp", end: 28 },
      { el: "#stat-aqi", end: 42 },
      { el: "#stat-humidity", end: 65 },
    ];
    targets.forEach(({ el, end }) => {
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: end,
        duration: 2,
        delay: 0.8,
        snap: { innerText: end % 1 === 0 ? 1 : 0.1 },
        ease: "power2.out",
      });
    });

    gsap.fromTo(statsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
  }, []);

  return (
    <section className="l-hero" id="hero">
      <canvas ref={canvasRef} className="l-hero-canvas" />
      <div className="l-hero-content" ref={contentRef}>
        <h1>
          Monitoring the Air of <span className="highlight">Safi</span> —<br />
          For a <span className="highlight-gold">Cleaner Tomorrow</span>
        </h1>
        <p>
          Real-time climate data, OCP production insights, and AI-powered
          environmental predictions for a sustainable future.
        </p>
        <div className="l-hero-btns">
          <a href="/dashboard" className="l-btn l-btn-primary">
            <Activity size={18} /> View Dashboard
          </a>
          <a href="#about" className="l-btn l-btn-outline">
            Learn More →
          </a>
        </div>
      </div>

      <div className="l-hero-stats" ref={statsRef}>
        <div className="l-hero-stat">
          <div className="l-hero-stat-icon"><Wind size={20} /></div>
          <div className="l-hero-stat-value" id="stat-wind">0</div>
          <div className="l-hero-stat-label">Wind Speed (m/s)</div>
        </div>
        <div className="l-hero-stat">
          <div className="l-hero-stat-icon"><Thermometer size={20} /></div>
          <div className="l-hero-stat-value" id="stat-temp">0</div>
          <div className="l-hero-stat-label">Temperature (°C)</div>
        </div>
        <div className="l-hero-stat">
          <div className="l-hero-stat-icon"><Activity size={20} /></div>
          <div className="l-hero-stat-value" id="stat-aqi">0</div>
          <div className="l-hero-stat-label">Air Quality Index</div>
        </div>
        <div className="l-hero-stat">
          <div className="l-hero-stat-icon"><Droplets size={20} /></div>
          <div className="l-hero-stat-value" id="stat-humidity">0</div>
          <div className="l-hero-stat-label">Humidity (%)</div>
        </div>
      </div>
    </section>
  );
}
