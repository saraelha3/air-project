import React, { useState, useMemo, useEffect } from "react";
import {
  Clock,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Factory,
  Zap,
  Radio,
  Search,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Filter,
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Database
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { useToast } from "../contexts/ToastContext";
import Tooltip from "../components/Tooltip";
import { SkeletonTable } from "../components/SkeletonLoader";
import { onHistoryChange, deleteHistoryEntry } from "../services/firebase";

const RISK_META = [
  { label: "Pas de risque", color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.35)", icon: <CheckCircle size={14} /> },
  { label: "Risque faible", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)", icon: <AlertTriangle size={14} /> },
  { label: "Risque moyen", color: "#fb923c", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.35)", icon: <TrendingUp size={14} /> },
  { label: "Risque élevé", color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)", icon: <AlertTriangle size={14} /> },
];

const DIR_DEGREES = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SO: 225, O: 270, NO: 315 };

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCharts, setShowCharts] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const toast = useToast();

  // ── Listen to Firebase Realtime Database ──────────────────────────────
  useEffect(() => {
    const unsubscribe = onHistoryChange((rows) => {
      setHistoryData(rows);
      setLoading(false);
    });
    // Timeout fallback — if Firebase responds with 0 rows we still stop loading
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Show a toast once data has loaded
  useEffect(() => {
    if (!loading && historyData.length > 0) {
      toast.success("Historique mis à jour", `${historyData.length} sessions chargées en temps réel`, 3000);
    }
  }, [loading]);

  // Filter calculations
  const filtered = useMemo(() => {
    let rows = historyData;
    if (filter !== "all") rows = rows.filter((r) => r.scenario === parseInt(filter));
    if (sourceFilter !== "all") rows = rows.filter((r) => (r.source || "simulation") === sourceFilter);

    // Date range filter
    if (startDate) {
      const startMs = new Date(startDate).setHours(0, 0, 0, 0);
      rows = rows.filter((r) => r.timestamp && r.timestamp >= startMs);
    }
    if (endDate) {
      const endMs = new Date(endDate).setHours(23, 59, 59, 999);
      rows = rows.filter((r) => r.timestamp && r.timestamp <= endMs);
    }

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) => {
        const dateMatch = r.date?.toLowerCase().includes(q);
        const timeMatch = r.time?.toLowerCase().includes(q);
        const labelMatch = r.label?.toLowerCase().includes(q);
        const windMatch = r.windDir?.toLowerCase().includes(q);
        const sourceMatch = (r.source || "simulation").toLowerCase().includes(q);
        const gasMatch = String(r.gasFlow).includes(q);
        return dateMatch || timeMatch || labelMatch || windMatch || sourceMatch || gasMatch;
      });
    }

    return rows;
  }, [filter, sourceFilter, startDate, endDate, searchQuery, historyData]);

  // Overall statistics (unfiltered database)
  const stats = useMemo(() => {
    const counts = [0, 0, 0, 0];
    historyData.forEach((r) => {
      if (r.scenario >= 0 && r.scenario <= 3) {
        counts[r.scenario]++;
      }
    });
    const avgConf =
      historyData.length > 0
        ? (historyData.reduce((s, r) => s + parseFloat(r.confidence || 0), 0) / historyData.length).toFixed(1)
        : "0.0";
    const avgProd =
      historyData.length > 0
        ? Math.round(historyData.reduce((s, r) => s + (r.productionPct || 0), 0) / historyData.length)
        : 0;

    return { counts, avgConf, avgProd };
  }, [historyData]);

  // Recharts Chronological Data
  const chartData = useMemo(() => {
    return [...filtered]
      .reverse()
      .map((row) => ({
        name: `${row.date} ${row.time}`,
        confidence: parseFloat(row.confidence || 0),
        scenario: row.scenario,
        label: row.label,
        color: RISK_META[row.scenario]?.color || "#888",
        gasFlow: row.gasFlow,
        windDir: row.windDir,
        windSpeed: row.windSpeed,
        temp: row.temperature,
      }));
  }, [filtered]);

  // Risk distribution for filtered data
  const distributionData = useMemo(() => {
    const countsLocal = [0, 0, 0, 0];
    filtered.forEach((r) => {
      if (r.scenario >= 0 && r.scenario <= 3) {
        countsLocal[r.scenario]++;
      }
    });
    return RISK_META.map((meta, i) => ({
      name: meta.label.replace("Risque ", ""),
      count: countsLocal[i],
      color: meta.color,
    }));
  }, [filtered]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.warning("Aucune donnée", "L'historique filtré est vide, rien à exporter.");
      return;
    }
    const header =
      "Date,Heure,Source,Scénario,Confiance,État production,Production %,Débit gaz,Direction vent,Vitesse vent,Température,Humidité,Pas de risque %,Risque faible %,Risque moyen %,Risque élevé %\n";
    const rows = filtered
      .map(
        (r) =>
          `${r.date},${r.time},${r.source || "simulation"},${r.label},${r.confidence}%,${r.productionLabel},${
            r.productionPct
          }%,${r.gasFlow},${r.windDir},${r.windSpeed} m/s,${r.temperature}°C,${r.humidity}%,${
            r.probabilities?.["Pas de risque"] || 0
          },${r.probabilities?.["Risque faible"] || 0},${r.probabilities?.["Risque moyen"] || 0},${
            r.probabilities?.["Risque élevé"] || 0
          }`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historique_ocp_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV réussi", `${filtered.length} lignes exportées avec succès`, 3000);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleConfirmDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteHistoryEntry(id);
      toast.success("Enregistrement supprimé", "La session a été retirée de la base de données", 3000);
      if (expanded === id) setExpanded(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur", "Impossible de supprimer l'enregistrement", 4000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  const TrendTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "rgba(10,25,18,0.96)",
          border: `1px solid ${data.color}40`,
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: ".8rem",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          color: "#ffffff",
        }}
      >
        <p style={{ fontWeight: 700, fontSize: ".85rem", marginBottom: 6, color: "#ffffff" }}>{data.name}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div>
            <span style={{ color: "#a0a0a0", marginRight: 6 }}>Scénario:</span>
            <span style={{ fontWeight: 700, color: data.color }}>{data.label}</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0", marginRight: 6 }}>Confiance:</span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "#ffffff" }}>{data.confidence}%</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0", marginRight: 6 }}>Débit gaz:</span>
            <span style={{ fontWeight: 600, color: "#ffffff" }}>{data.gasFlow} m³/h</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0", marginRight: 6 }}>Vent:</span>
            <span style={{ fontWeight: 600, color: "#ffffff" }}>
              {data.windDir} ({data.windSpeed} m/s)
            </span>
          </div>
        </div>
      </div>
    );
  };

  const RenderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={payload.color}
        stroke="#141414"
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 4px ${payload.color})`, cursor: "pointer" }}
      />
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="kpi-strip" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(15,35,20,.7)",
                border: "1px solid rgba(174,195,176,0.1)",
                borderRadius: 11,
                padding: "1rem 1.1rem",
                display: "flex",
                flexDirection: "column",
                gap: ".55rem",
              }}
            >
              <div
                style={{
                  height: 10,
                  width: 70,
                  borderRadius: 6,
                  background:
                    "linear-gradient(90deg,rgba(55,85,52,.18) 25%,rgba(107,144,113,.22) 50%,rgba(55,85,52,.18) 75%)",
                  backgroundSize: "600px 100%",
                  animation: "shimmer 1.6s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  height: 30,
                  width: 80,
                  borderRadius: 6,
                  background:
                    "linear-gradient(90deg,rgba(55,85,52,.18) 25%,rgba(107,144,113,.22) 50%,rgba(55,85,52,.18) 75%)",
                  backgroundSize: "600px 100%",
                  animation: "shimmer 1.6s ease-in-out infinite",
                }}
              />
            </div>
          ))}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* KPI overview */}
      <div className="kpi-strip animate-in" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
        {[
          { label: "Sans risque", val: stats.counts[0], cls: "green", icon: <CheckCircle size={11} />, tip: "Sessions sans détection de risque" },
          { label: "Risque faible", val: stats.counts[1], cls: "amber", icon: <AlertTriangle size={11} />, tip: "Sessions avec risque faible" },
          { label: "Risque moyen", val: stats.counts[2], cls: "amber", icon: <TrendingUp size={11} />, tip: "Sessions avec risque modéré" },
          { label: "Risque élevé", val: stats.counts[3], cls: "red", icon: <AlertTriangle size={11} />, tip: "Sessions avec risque élevé nécessitant action" },
          { label: "Confiance moy.", val: `${stats.avgConf}%`, cls: "blue", icon: <Activity size={11} />, tip: "Confiance moyenne des prédictions XGBoost" },
          { label: "Prod. moyenne", val: `${stats.avgProd}%`, cls: "green", icon: <Factory size={11} />, tip: "Taux de production moyen sur toutes les sessions" },
        ].map((k) => (
          <div key={k.label} className={`kpi-card ${k.cls} animate-in`} style={{ backdropFilter: "blur(8px)" }}>
            <div className="kpi-label">
              {k.icon} {k.label}
              <Tooltip content={k.tip} position="top">
                <Info size={9} style={{ marginLeft: "auto", opacity: 0.45, cursor: "help" }} />
              </Tooltip>
            </div>
            <div className="kpi-value">{k.val}</div>
            <div className="kpi-sub">sessions totales</div>
          </div>
        ))}
      </div>

      {/* Chart trigger */}
      <div className="glass animate-in" style={{ padding: "0.5rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={16} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>Visualisation des tendances historiques</span>
        </div>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="filter-btn"
          style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
        >
          {showCharts ? "Masquer les graphiques" : "Afficher les graphiques"}
        </button>
      </div>

      {/* Recharts section */}
      {showCharts && filtered.length > 0 && (
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
          {/* Timeline trend */}
          <div className="glass chart-container" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                📈 ÉVOLUTION DE LA CONFIANCE & SÉVÉRITÉ DES RISQUES
              </h3>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} /> Chronologique
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,195,176,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "rgba(174,195,176,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="var(--neon-blue)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConf)"
                  dot={<RenderCustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk distribution */}
          <div className="glass chart-container" style={{ padding: "1.25rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              📊 RÉPARTITION DES NIVEAUX DE RISQUE
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,195,176,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "rgba(174,195,176,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(174,195,176,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={24}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="history-table-wrap animate-in">
        {/* Advanced Filters */}
        <div style={{ padding: "1.25rem 1.4rem", borderBottom: "1px solid var(--glass-border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
              <Database size={15} style={{ color: "var(--accent)" }} />
              Registre Historique ({filtered.length} {filtered.length > 1 ? "sessions filtrées" : "session filtrée"})
            </h2>
            <Tooltip content="Exporter la vue actuelle en fichier CSV" position="top">
              <button
                onClick={handleExport}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".35rem",
                  padding: ".35rem .95rem",
                  borderRadius: "var(--radius-xs)",
                  border: "1px solid rgba(107,144,113,.3)",
                  background: "rgba(107,144,113,.1)",
                  color: "var(--g300)",
                  cursor: "pointer",
                  fontSize: ".75rem",
                  fontWeight: 600,
                }}
              >
                <Download size={13} /> Exporter CSV
              </button>
            </Tooltip>
          </div>

          {/* Filtering controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Row 1: Search & Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={14} style={{ position: "absolute", left: 12, color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Rechercher par date, vent, scénario, débit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.75rem 0.45rem 2.2rem",
                    borderRadius: "var(--radius-xs)",
                    border: "1px solid var(--glass-border)",
                    background: "rgba(0,0,0,0.15)",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Calendar size={13} style={{ position: "absolute", left: 10, color: "var(--text-muted)" }} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.42rem 0.65rem 0.42rem 2.1rem",
                    borderRadius: "var(--radius-xs)",
                    border: "1px solid var(--glass-border)",
                    background: "rgba(0,0,0,0.15)",
                    color: "var(--text-primary)",
                    fontSize: "0.75rem",
                    outline: "none",
                  }}
                  placeholder="Date début"
                />
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Calendar size={13} style={{ position: "absolute", left: 10, color: "var(--text-muted)" }} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.42rem 0.65rem 0.42rem 2.1rem",
                    borderRadius: "var(--radius-xs)",
                    border: "1px solid var(--glass-border)",
                    background: "rgba(0,0,0,0.15)",
                    color: "var(--text-primary)",
                    fontSize: "0.75rem",
                    outline: "none",
                  }}
                  placeholder="Date fin"
                />
              </div>
            </div>

            {/* Row 2: Scenario and Source button-tabs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Risques :</span>
                <button
                  className={`filter-btn${filter === "all" ? " active" : ""}`}
                  onClick={() => setFilter("all")}
                  style={{ padding: "0.25rem 0.65rem", fontSize: "0.7rem" }}
                >
                  Tous ({historyData.length})
                </button>
                {RISK_META.map((m, i) => (
                  <button
                    key={i}
                    className={`filter-btn${filter === String(i) ? " active" : ""}`}
                    onClick={() => setFilter(String(i))}
                    style={{
                      padding: "0.25rem 0.65rem",
                      fontSize: "0.7rem",
                      ...(filter === String(i) ? { borderColor: m.border, background: m.bg, color: m.color } : {}),
                    }}
                  >
                    {m.label} ({stats.counts[i]})
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Sources :</span>
                <button
                  className={`filter-btn${sourceFilter === "all" ? " active" : ""}`}
                  onClick={() => setSourceFilter("all")}
                  style={{ padding: "0.25rem 0.65rem", fontSize: "0.7rem" }}
                >
                  📋 Tout
                </button>
                <button
                  className={`filter-btn${sourceFilter === "réel" ? " active" : ""}`}
                  onClick={() => setSourceFilter("réel")}
                  style={{
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.7rem",
                    ...(sourceFilter === "réel" ? { borderColor: "rgba(96,165,250,0.5)", background: "rgba(96,165,250,0.12)", color: "#60a5fa" } : {}),
                  }}
                >
                  <Radio size={9} style={{ marginRight: 3, verticalAlign: "middle" }} /> Réel
                </button>
                <button
                  className={`filter-btn${sourceFilter === "simulation" ? " active" : ""}`}
                  onClick={() => setSourceFilter("simulation")}
                  style={{
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.7rem",
                    ...(sourceFilter === "simulation" ? { borderColor: "rgba(167,139,250,0.5)", background: "rgba(167,139,250,0.12)", color: "#a78bfa" } : {}),
                  }}
                >
                  <Zap size={9} style={{ marginRight: 3, verticalAlign: "middle" }} /> Simulation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state within filtered view */}
        {filtered.length === 0 ? (
          <div style={{ padding: "3.5rem 1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <Filter size={32} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
            <h3 style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>Aucune session ne correspond à vos filtres</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", maxWidth: 350 }}>
              Essayez de modifier vos dates, de vider la zone de recherche ou de choisir un autre filtre de risque.
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSourceFilter("all");
                setStartDate("");
                setEndDate("");
                setSearchQuery("");
              }}
              className="filter-btn"
              style={{ marginTop: "0.5rem" }}
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          /* Table itself */
          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date / Heure</th>
                  <th>Source</th>
                  <th>Scénario</th>
                  <th>Confiance</th>
                  <th>État production</th>
                  <th>Débit gaz</th>
                  <th>Vent</th>
                  <th>Temp.</th>
                  <th>Humidité</th>
                  <th style={{ width: 80, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                      style={{ cursor: "pointer", background: expanded === row.id ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: ".82rem" }}>{row.date}</div>
                        <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{row.time}</div>
                      </td>
                      <td>
                        {(row.source || "simulation") === "réel" ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: ".18rem .55rem",
                              borderRadius: 20,
                              fontSize: ".68rem",
                              fontWeight: 700,
                              background: "rgba(96,165,250,0.1)",
                              border: "1px solid rgba(96,165,250,0.3)",
                              color: "#60a5fa",
                            }}
                          >
                            <Radio size={9} /> Réel
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: ".18rem .55rem",
                              borderRadius: 20,
                              fontSize: ".68rem",
                              fontWeight: 700,
                              background: "rgba(167,139,250,0.1)",
                              border: "1px solid rgba(167,139,250,0.3)",
                              color: "#a78bfa",
                            }}
                          >
                            <Zap size={9} /> Simulation
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="risk-pill" style={{ background: row.bg, border: `1px solid ${row.border}`, color: row.color }}>
                          {["✅", "⚠️", "🔶", "🚨"][row.scenario]} {row.label}
                        </span>
                      </td>
                      <td style={{ fontFamily: "var(--font-display)", color: row.color, fontWeight: 700 }}>{row.confidence}%</td>

                      <td>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: 12 }}>{row.productionBadge}</span>
                            <span style={{ fontSize: ".75rem", fontWeight: 700, color: row.productionColor }}>{row.productionPct}%</span>
                          </div>
                          <div style={{ width: 72, height: 4, borderRadius: 2, background: "rgba(255,255,255,.07)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${row.productionPct}%`, background: row.productionColor, borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.gasFlow} m³/h</div>
                        <div style={{ height: 3, borderRadius: 2, background: "rgba(174,195,176,.1)", marginTop: 4, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${(row.gasFlow / 3000) * 100}%`,
                              background: row.gasFlow > 2000 ? "#f87171" : row.gasFlow > 1500 ? "#fb923c" : "#4ade80",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{row.windDir}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: ".75rem", marginLeft: 4 }}>{row.windSpeed} m/s</span>
                      </td>
                      <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{row.temperature}°C</td>
                      <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{row.humidity}%</td>
                      {/* Delete actions column */}
                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
                        {deletingId === row.id ? (
                          <div style={{ display: "inline-flex", gap: "0.25rem", alignItems: "center" }}>
                            <button
                              onClick={(e) => handleConfirmDelete(e, row.id)}
                              style={{
                                border: "none",
                                background: "#ef4444",
                                color: "#fff",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                padding: "0.2rem 0.4rem",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Oui
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              style={{
                                border: "1px solid var(--glass-border)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                fontSize: "0.65rem",
                                padding: "0.15rem 0.35rem",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                            >
                              Non
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleDeleteClick(e, row.id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              padding: "0.3rem",
                              borderRadius: "50%",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Detailed expanded panel */}
                    {expanded === row.id && (
                      <tr>
                        <td colSpan={10} style={{ background: "rgba(107,144,113,.04)", padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr 1fr", gap: "1.25rem" }}>
                            {/* Col 1: Meteorologie (including wind compass) */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", padding: "1rem" }}>
                              <h4 style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                                <Wind size={12} style={{ color: "var(--accent)" }} /> Météorologie
                              </h4>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", alignItems: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.03)", padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.03)" }}>
                                    <Thermometer size={12} style={{ color: "#fb923c" }} />
                                    <div>
                                      <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>Temp.</div>
                                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>{row.temperature}°C</div>
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.03)", padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.03)" }}>
                                    <Droplets size={12} style={{ color: "#38bdf8" }} />
                                    <div>
                                      <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>Humidité</div>
                                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>{row.humidity}%</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Vector compass */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div
                                    style={{
                                      width: 76,
                                      height: 76,
                                      borderRadius: "50%",
                                      border: "1px solid rgba(174,195,176,.15)",
                                      position: "relative",
                                      background: "radial-gradient(circle, rgba(107,144,113,.05) 0%, transparent 70%)",
                                    }}
                                  >
                                    <span style={{ position: "absolute", top: 1, left: "50%", transform: "translateX(-50%)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)" }}>N</span>
                                    <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)" }}>S</span>
                                    <span style={{ position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)" }}>E</span>
                                    <span style={{ position: "absolute", left: 2, top: "50%", transform: "translateY(-50%)", fontSize: 7, fontWeight: 700, color: "var(--text-muted)" }}>O</span>
                                    {/* Compass Needle */}
                                    <div
                                      style={{
                                        position: "absolute",
                                        width: 2,
                                        height: 28,
                                        background: "linear-gradient(to top, var(--accent), var(--risk-0))",
                                        borderRadius: 2,
                                        bottom: "50%",
                                        left: "50%",
                                        transformOrigin: "bottom center",
                                        transform: `translateX(-50%) rotate(${DIR_DEGREES[row.windDir] ?? 0}deg)`,
                                        transition: "transform 0.5s ease",
                                      }}
                                    />
                                    <div style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                                  </div>
                                  <div style={{ fontSize: "0.65rem", fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>
                                    Vent {row.windDir} · {row.windSpeed} m/s
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Col 2: IA Probabilities */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", padding: "1rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h4 style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                                  <Activity size={12} style={{ color: "var(--accent)" }} /> Confiance IA : {row.confidence}%
                                </h4>
                                <span style={{ fontSize: "0.62rem", color: row.color, fontWeight: 700 }}>{row.label}</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                                {row.probabilities &&
                                  Object.entries(row.probabilities).map(([k, v], i) => (
                                    <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem" }}>
                                        <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                                        <strong style={{ color: RISK_META[i]?.color || "#888", fontFamily: "var(--font-display)" }}>{v}%</strong>
                                      </div>
                                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${v}%`, background: RISK_META[i]?.color || "#888", borderRadius: 2 }} />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Col 3: OCP Factory Circular gauge */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.15)", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", padding: "1rem" }}>
                              <h4 style={{ margin: "0 0 0.5rem 0", alignSelf: "flex-start", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                                <Factory size={12} style={{ color: row.productionColor }} /> Consigne de production
                              </h4>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ position: "relative", width: 62, height: 62 }}>
                                  <svg viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
                                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                    <circle
                                      cx="32"
                                      cy="32"
                                      r="26"
                                      fill="none"
                                      stroke={row.productionColor}
                                      strokeWidth="6"
                                      strokeLinecap="round"
                                      strokeDasharray={`${2 * Math.PI * 26}`}
                                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - (row.productionPct || 0) / 100)}`}
                                      style={{ transition: "stroke-dashoffset 0.6s ease" }}
                                    />
                                  </svg>
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontFamily: "var(--font-display)",
                                      fontSize: "1rem",
                                      fontWeight: 700,
                                      color: row.productionColor,
                                    }}
                                  >
                                    {row.productionPct}%
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                                    {row.productionBadge}
                                  </div>
                                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>
                                    {row.productionLabel}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Statistics */}
        <div className="history-stats">
          <div className="hstat">
            <div className="hstat-val">{filtered.length}</div>
            <div className="hstat-lbl">Sessions visibles</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" style={{ color: "#4ade80" }}>
              {filtered.length > 0
                ? (
                    (filtered.filter((r) => r.scenario === 0).length / filtered.length) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </div>
            <div className="hstat-lbl">Pas de risque</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" style={{ color: "#f87171" }}>
              {filtered.filter((r) => r.scenario >= 2).length}
            </div>
            <div className="hstat-lbl">Alertes critiques</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" style={{ color: "var(--g300)" }}>
              {filtered.length > 0
                ? (
                    filtered.reduce((s, r) => s + parseFloat(r.confidence || 0), 0) / filtered.length
                  ).toFixed(1)
                : "0.0"}
              %
            </div>
            <div className="hstat-lbl">Confiance moyenne</div>
          </div>
        </div>
      </div>
    </div>
  );
}