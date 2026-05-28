import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Cloud, BarChart2, Wind, Map, Bell, Activity, AlertTriangle, Cpu, Clock, CheckCircle, Table2, Sun, Moon } from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import { useTheme } from "./contexts/ThemeContext";
import { useToast } from "./contexts/ToastContext";

export default function App() {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const handleThemeToggle = () => {
    toggleTheme();
    toast.info(
      theme === "dark" ? "Mode clair activé" : "Mode sombre activé",
      theme === "dark" ? "Interface passée en thème clair" : "Interface passée en thème sombre"
    );
  };

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
            <span className="sidebar-section-label" style={{ marginTop: ".4rem" }}>Données</span>
            {[
              { icon:<Wind size={15}/>, label:"Qualité de l'air" },
              { icon:<Map size={15}/>, label:"Carte radar" },
              { icon:<Bell size={15}/>, label:"Alertes" },
            ].map(item => (
              <span key={item.label} style={{ display:"flex", alignItems:"center", gap:".65rem", padding:".62rem .85rem", fontSize:".855rem", fontWeight:500, color:"var(--text-secondary)", opacity:.35, cursor:"default", borderRadius:"var(--radius-sm)" }}>
                {item.icon} {item.label}
              </span>
            ))}
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
              {/* Theme toggle */}
              <button className="theme-toggle" onClick={handleThemeToggle}
                data-tip={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}>
                {theme === "dark"
                  ? <><Sun size={13}/> Clair</>
                  : <><Moon size={13}/> Sombre</>}
              </button>
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
            <div className="footer-stat" data-tip="Nombre d'alertes actives">
              <div className="fs-label"><AlertTriangle size={9}/> Alertes actives</div>
              <div className="fs-value amber">0</div>
            </div>
            <div className="footer-stat" data-tip="Modèle de prédiction utilisé">
              <div className="fs-label"><Cpu size={9}/> Modèle IA</div>
              <div className="fs-value blue">v1.0 XGBoost</div>
            </div>
            <div className="footer-stat" data-tip="Heure de la dernière mise à jour">
              <div className="fs-label"><Clock size={9}/> Dernière MAJ</div>
              <div className="fs-value" style={{ color:"var(--text-primary)" }}>{timeStr}</div>
            </div>
            <div className="footer-stat" data-tip="Niveau de confiance du modèle IA">
              <div className="fs-label"><CheckCircle size={9}/> Confiance</div>
              <div className="fs-value green">High</div>
            </div>
            <div className="footer-stat" data-tip="État général du système">
              <div className="fs-label"><Activity size={9}/> Santé système</div>
              <div className="fs-value green">Optimal</div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}