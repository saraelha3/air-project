import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Cloud, BarChart2, Wind, Map, Bell, Activity, AlertTriangle, Cpu, Clock, CheckCircle, Table2 } from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

export default function App() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src="/ocp-logo.png" alt="OCP" className="sidebar-logo-img" />
            <div className="logo-text">
              <span className="logo-name">OCP AtmoSafe</span>
              <span className="logo-sub">Usine OCP — Safi</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <span className="sidebar-section-label">Navigation</span>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              <Cloud size={15} /> Météo en direct
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              <BarChart2 size={15} /> Simulation IA
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "active" : ""}>
              <Table2 size={15} /> Historique
            </NavLink>
            <span className="sidebar-section-label" style={{ marginTop: "0.4rem" }}>Données</span>
            <span style={{ display:"flex", alignItems:"center", gap:".65rem", padding:".62rem .85rem", fontSize:".855rem", fontWeight:500, color:"var(--text-secondary)", opacity:.35, cursor:"default" }}>
              <Wind size={15} /> Qualité de l'air
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:".65rem", padding:".62rem .85rem", fontSize:".855rem", fontWeight:500, color:"var(--text-secondary)", opacity:.35, cursor:"default" }}>
              <Map size={15} /> Carte radar
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:".65rem", padding:".62rem .85rem", fontSize:".855rem", fontWeight:500, color:"var(--text-secondary)", opacity:.35, cursor:"default" }}>
              <Bell size={15} /> Alertes
            </span>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-status-dot" />
            <div className="sidebar-status-text">
              <strong>Système actif</strong>
              Modèle v1.0 — XGBoost
            </div>
          </div>
        </aside>

        <div className="main-content">
          <header className="topbar">
            <div className="topbar-title">
              Prévision de la qualité de l'air
              <span>— Usine OCP Safi</span>
            </div>
            <div className="topbar-meta">
              <div className="topbar-badge">
                <Activity size={12} />
                Données en temps réel
              </div>
            </div>
          </header>

          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>

          <div className="footer-status-bar">
            <div className="footer-stat">
              <div className="fs-label"><AlertTriangle size={9} /> Alertes actives</div>
              <div className="fs-value amber">0</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Cpu size={9} /> Modèle IA</div>
              <div className="fs-value blue">v1.0 XGBoost</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Clock size={9} /> Dernière MAJ</div>
              <div className="fs-value" style={{ color:"var(--text-primary)" }}>{timeStr}</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><CheckCircle size={9} /> Confiance</div>
              <div className="fs-value green">High</div>
            </div>
            <div className="footer-stat">
              <div className="fs-label"><Activity size={9} /> Santé système</div>
              <div className="fs-value green">Optimal</div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}