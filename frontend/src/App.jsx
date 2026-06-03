import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Cloud, BarChart2, Wind, Map, Bell, Activity, AlertTriangle, Cpu, Clock, CheckCircle, Table2, Sun, Moon } from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import RiskAlert from "./components/RiskAlert";
import { useTheme } from "./contexts/ThemeContext";
import { useToast } from "./contexts/ToastContext";
import useRiskPrediction from "./hooks/useRiskPrediction";

// Composant interne qui a accès au hook de prédiction
function AppInner() {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const { prediction } = useRiskPrediction();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });

  const handleThemeToggle = () => {
    toggleTheme();
    toast.info(theme==="dark"?"Mode clair activé ☀️":"Mode sombre activé 🌙", theme==="dark"?"Interface passée en thème clair":"Interface passée en thème sombre");
  };

  const navItems = [
    { to:"/",          label:"Météo en direct", icon:<Cloud size={15}/>,    end:true },
    { to:"/dashboard", label:"Simulation IA",   icon:<BarChart2 size={15}/> },
    { to:"/history",   label:"Historique",      icon:<Table2 size={15}/>    },
  ];
  const disabledItems = [
    { label:"Qualité de l'air", icon:<Wind size={15}/> },
    { label:"Carte radar",      icon:<Map size={15}/>  },
    { label:"Alertes",          icon:<Bell size={15}/> },
  ];

  return (
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
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive?"active":""}>
              {item.icon} {item.label}
            </NavLink>
          ))}
          <span className="sidebar-section-label" style={{ marginTop:".4rem" }}>Données</span>
          {disabledItems.map(item => (
            <span key={item.label} style={{ display:"flex", alignItems:"center", gap:".65rem", padding:".62rem .85rem", fontSize:".855rem", fontWeight:500, color:"var(--text-secondary)", opacity:.32, cursor:"default", borderRadius:"var(--radius-sm)" }}>
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
            <button className="theme-toggle" onClick={handleThemeToggle}>
              {theme==="dark"?<><Sun size={13}/> Clair</>:<><Moon size={13}/> Sombre</>}
            </button>
            <div className="topbar-badge">
              <Activity size={12}/>
              Données en temps réel
            </div>
          </div>
        </header>

        {/* ── Bandeau RiskAlert global — visible sur TOUTES les pages ── */}
        {prediction && (
          <div style={{ padding:"0 1.5rem", paddingTop:"1rem" }}>
            <RiskAlert
              scenario={prediction.scenario}
              label={prediction.label}
              confidence={prediction.confidence}
            />
          </div>
        )}

        <main className="page">
          <Routes>
            <Route path="/"          element={<Home />}      />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history"   element={<History />}   />
          </Routes>
        </main>

        <div className="footer-status-bar">
          {[
            { tip:"Alertes environnementales actives", label:<><AlertTriangle size={9}/> Alertes actives</>, val:"0", cls:"amber" },
            { tip:"Modèle de prédiction utilisé",      label:<><Cpu size={9}/> Modèle IA</>,               val:"v1.0 XGBoost", cls:"blue" },
            { tip:"Heure de la dernière mise à jour",  label:<><Clock size={9}/> Dernière MAJ</>,           val:timeStr, cls:"" },
            { tip:"Niveau de confiance moyen",         label:<><CheckCircle size={9}/> Confiance</>,        val:"High", cls:"green" },
            { tip:"État de santé du système",          label:<><Activity size={9}/> Santé système</>,       val:"Optimal", cls:"green" },
          ].map((s,i) => (
            <div key={i} className="footer-stat" data-tip={s.tip}>
              <div className="fs-label">{s.label}</div>
              <div className={`fs-value ${s.cls}`}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}