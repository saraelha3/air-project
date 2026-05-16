import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Cloud, BarChart2, Wind, Map, Bell, Activity, AlertTriangle, Cpu, Clock, CheckCircle } from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Router>
      <div className="app-layout">
        {/* ── Sidebar ──────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src="/ocp-logo.png" alt="OCP" className="sidebar-logo-img" />
            <div>
              OCP AtmoSafe
              <span className="logo-sub">Usine OCP — Safi</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <span className="sidebar-section-label">Navigation</span>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              <Cloud size={16} /> Météo en direct
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <BarChart2 size={16} /> Simulation IA
            </NavLink>

            <span className="sidebar-section-label" style={{ marginTop: "0.5rem" }}>Données</span>
            <NavLink to="/" end className={() => ""} style={{ pointerEvents: "none", opacity: 0.4 }}>
              <Wind size={16} /> Qualité de l'air
            </NavLink>
            <NavLink to="/" end className={() => ""} style={{ pointerEvents: "none", opacity: 0.4 }}>
              <Map size={16} /> Carte radar
            </NavLink>
            <NavLink to="/" end className={() => ""} style={{ pointerEvents: "none", opacity: 0.4 }}>
              <Bell size={16} /> Alertes
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-status-dot" />
            <div className="sidebar-status-text">
              <strong>Système actif</strong>
              Modèle v1.0 — XGBoost
            </div>
          </div>
        </aside>

        {/* ── Main Content ──────────────────────────── */}
        <div className="main-content">
          {/* Top bar */}
          <header className="topbar">
            <div className="topbar-title">
              Prévision de la qualité de l'air
              <span>— Usine OCP Safi</span>
            </div>
            <div className="topbar-meta">
              <div className="topbar-badge">
                <Activity size={13} />
                Données en temps réel
              </div>
            </div>
          </header>

          {/* Routes */}
          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          {/* ── Footer Status Bar ─────────────────── */}
          <div className="footer-status-bar">
            <div className="footer-stat">
              <div className="fs-label"><AlertTriangle size={10} /> Alertes actives</div>
              <div className="fs-value amber">0</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Cpu size={10} /> Modèle IA</div>
              <div className="fs-value blue">v1.0 XGBoost</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Clock size={10} /> Dernière mise à jour</div>
              <div className="fs-value" style={{ color: "var(--text-primary)" }}>{timeStr}</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><CheckCircle size={10} /> Confiance prédiction</div>
              <div className="fs-value green">High</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Activity size={10} /> Santé système</div>
              <div className="fs-value green">Optimal</div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}
