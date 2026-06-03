import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const OCP_CENTER = [32.230966669524555, -9.250801692361742];
const SAFI_CITY  = [32.6333, -8.7667];

const OCP_PERIMETER = [
  [32.2420, -9.2650], [32.2450, -9.2500], [32.2440, -9.2340],
  [32.2370, -9.2260], [32.2270, -9.2240], [32.2180, -9.2280],
  [32.2120, -9.2380], [32.2100, -9.2520], [32.2130, -9.2660],
  [32.2210, -9.2720], [32.2320, -9.2700], [32.2420, -9.2650],
];

const EMISSION_SOURCES = [
  { pos: [32.2380, -9.2560], name: "Cheminée Acide Sulfurique", type: "SO₂",   flow: "haute" },
  { pos: [32.2320, -9.2630], name: "Unité Superphosphate",      type: "PM10",  flow: "haute" },
  { pos: [32.2260, -9.2480], name: "Cheminée Principale",       type: "NOx",   flow: "très haute" },
  { pos: [32.2200, -9.2580], name: "Atelier Engrais DAP/MAP",   type: "NH₃",   flow: "moyenne" },
  { pos: [32.2340, -9.2700], name: "Unité de Fluoration",       type: "HF",    flow: "haute" },
  { pos: [32.2160, -9.2660], name: "Source Secondaire Sud",     type: "PM2.5", flow: "faible" },
];

const FORECASTS = {
  now: { label: "Temps réel",         windSpeed: 5,   windDeg: 270, temp: 22, hum: 68, pm25: 38,  pm10: 72,  so2: 85,  nox: 45, aqi: 78  },
  h6:  { label: "Prévision IA +6h",  windSpeed: 6.5, windDeg: 265, temp: 21, hum: 72, pm25: 52,  pm10: 95,  so2: 110, nox: 62, aqi: 108 },
  h12: { label: "Prévision IA +12h", windSpeed: 4,   windDeg: 280, temp: 20, hum: 75, pm25: 44,  pm10: 83,  so2: 97,  nox: 50, aqi: 90  },
  h24: { label: "Prévision IA +24h", windSpeed: 7.2, windDeg: 255, temp: 23, hum: 62, pm25: 66,  pm10: 115, so2: 132, nox: 78, aqi: 130 },
};

const AQI_LEVELS = [
  { max: 50,  label: "Bon",          color: "#22c55e", icon: "🟢" },
  { max: 100, label: "Modéré",       color: "#eab308", icon: "🟡" },
  { max: 150, label: "Mauvais",      color: "#f97316", icon: "🟠" },
  { max: 999, label: "Très mauvais", color: "#ef4444", icon: "🔴" },
];
const getAqiLevel = (aqi) => AQI_LEVELS.find(l => aqi <= l.max) || AQI_LEVELS[3];

const MAP_THEMES = {
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '© Esri',
  },

   light: {
    name: "Clair",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '© CartoDB',
  },

  dark: {
    name: "Sombre",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '© CartoDB',
  }, 
};

function buildPlumeLayers(windDeg, windSpeed, aqi) {
  const intensity = Math.min(aqi / 150, 1);
  const reach     = 0.08 + windSpeed * 0.005 + intensity * 0.025;
  const spread    = 0.020 + intensity * 0.010;
  const angleRad  = ((windDeg + 180) % 360) * Math.PI / 180;
  const ZONES = 7, STEPS = 64;
  const layers = [];

  for (let z = ZONES; z >= 1; z--) {
    const t     = z / ZONES;
    const dist  = reach * t;
    const width = spread * t * (1 + t * 0.5);
    const coords = [];
    for (let i = 0; i <= STEPS; i++) {
      const frac = i / STEPS;
      const d = dist * (1 - frac * 0.55), w = width * (1 - frac * 0.3);
      const cx = OCP_CENTER[1] + d * Math.sin(angleRad);
      const cy = OCP_CENTER[0] + d * Math.cos(angleRad) * 0.75;
      const px = -Math.cos(angleRad) * w * 0.5;
      const py =  Math.sin(angleRad) * w * 0.5 * 0.75;
      coords.push([cy + py, cx + px]);
    }
    for (let i = STEPS; i >= 0; i--) {
      const frac = i / STEPS;
      const d = dist * (1 - frac * 0.55), w = width * (1 - frac * 0.3);
      const cx = OCP_CENTER[1] + d * Math.sin(angleRad);
      const cy = OCP_CENTER[0] + d * Math.cos(angleRad) * 0.75;
      const px = -Math.cos(angleRad) * w * 0.5;
      const py =  Math.sin(angleRad) * w * 0.5 * 0.75;
      coords.push([cy - py, cx - px]);
    }
    coords.push(coords[0]);
    const conc = 1 - (z - 1) / ZONES;
    const [color, opacity] =
      conc > 0.80 ? ["#dc2626", 0.38] :
      conc > 0.62 ? ["#f97316", 0.30] :
      conc > 0.46 ? ["#eab308", 0.26] :
      conc > 0.30 ? ["#22c55e", 0.22] :
      conc > 0.16 ? ["#38bdf8", 0.18] :
                    ["#3b82f6", 0.13];
    layers.push({ coords, color, opacity });
  }
  return layers;
}

function buildWindArrows(windDeg) {
  const angleRad = ((windDeg + 180) % 360) * Math.PI / 180;
  const arrowLen = 0.025;
  const grid = [
    [-0.18, -0.12], [-0.18, 0.00], [-0.18, 0.12],
    [-0.08, -0.06], [-0.08, 0.06],
    [ 0.04, -0.10], [ 0.04, 0.04],
  ];
  return grid.map(([dy, dx]) => {
    const lat0 = OCP_CENTER[0] + dy, lon0 = OCP_CENTER[1] + dx;
    return [[lat0, lon0], [lat0 + arrowLen * Math.cos(angleRad), lon0 + arrowLen * Math.sin(angleRad)]];
  });
}

export default function RadarMap({ weather }) {
  const mapRef     = useRef(null);
  const leafletRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersRef  = useRef({ plume: [], arrows: [], perimeter: null, sources: [], city: null });
  const [activeFc, setActiveFc]  = useState("now");
  const [liveData, setLiveData]  = useState(FORECASTS.now);
  const [isLoading,setIsLoading] = useState(true);
  const [mapTheme, setMapTheme]  = useState("satellite");

  const getData = (key) => {
    const base = { ...FORECASTS[key] };
    if (key === "now" && weather) {
      base.windSpeed = weather.wind_speed  ?? base.windSpeed;
      base.windDeg   = weather.wind_deg    ?? base.windDeg;
      base.temp      = weather.temperature ?? base.temp;
      base.hum       = weather.humidity    ?? base.hum;
    }
    return base;
  };

  useEffect(() => {
    if (leafletRef.current) return;
    const map = L.map(mapRef.current, {
      center: OCP_CENTER, zoom: 14,
      zoomControl: false, attributionControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false })
      .addTo(map).setPrefix('© OpenStreetMap contributors');
    
    // Ajouter la tuile initiale
    const theme = MAP_THEMES.satellite;
    tileLayerRef.current = L.tileLayer(theme.url, { maxZoom: 18, subdomains: "abcd" }).addTo(map);
    
    leafletRef.current = map;
    setTimeout(() => { map.invalidateSize(); setIsLoading(false); renderLayers("now"); }, 300);
    return () => { map.remove(); leafletRef.current = null; };
  }, []);

  // Changer le thème de la carte
  const changeMapTheme = (theme) => {
    setMapTheme(theme);
    const map = leafletRef.current;
    if (!map || !tileLayerRef.current) return;
    
    map.removeLayer(tileLayerRef.current);
    const tileData = MAP_THEMES[theme];
    tileLayerRef.current = L.tileLayer(tileData.url, { maxZoom: 18, subdomains: "abcd" }).addTo(map);
  };

  const renderLayers = (key) => {
    const map = leafletRef.current;
    if (!map) return;
    const data = getData(key);
    const refs = layersRef.current;

    refs.plume.forEach(l => map.removeLayer(l));
    refs.arrows.forEach(l => map.removeLayer(l));
    if (refs.perimeter) map.removeLayer(refs.perimeter);
    refs.sources.forEach(l => map.removeLayer(l));
    if (refs.city) map.removeLayer(refs.city);
    refs.plume = []; refs.arrows = []; refs.sources = [];

    // Plume
    buildPlumeLayers(data.windDeg, data.windSpeed, data.aqi).forEach(({ coords, color, opacity }) => {
      refs.plume.push(L.polygon(coords, { color: "transparent", fillColor: color, fillOpacity: opacity, weight: 0 }).addTo(map));
    });

    // Périmètre OCP
    refs.perimeter = L.polygon(OCP_PERIMETER, {
      color: "#4ade80", weight: 2.5, fillColor: "#4ade80", fillOpacity: 0.06, dashArray: "8 5",
    }).addTo(map);
    refs.perimeter.bindPopup(`<div style="font-family:sans-serif"><strong style="color:#4ade80">⬛ Périmètre OCP Safi</strong><br/><small>Zone industrielle — Safi, Maroc</small><br/><small>📍 32.231°N, 9.251°O</small></div>`);

    // Flèches vent
    buildWindArrows(data.windDeg).forEach(pts => {
      const line = L.polyline(pts, { color: "rgba(255,255,255,0.5)", weight: 1.5 }).addTo(map);
      const [p0, p1] = pts;
      const dy = p1[0]-p0[0], dx = p1[1]-p0[1], len = Math.sqrt(dy*dy+dx*dx)||1, sz = 0.007;
      const ndx = dx/len, ndy = dy/len;
      const head = [p1, [p1[0]-ndy*sz-ndx*sz*0.5, p1[1]+ndx*sz-ndy*sz*0.5], [p1[0]-ndy*sz+ndx*sz*0.5, p1[1]+ndx*sz+ndy*sz*0.5], p1];
      const arrow = L.polygon(head, { color: "rgba(255,255,255,0.6)", fillColor: "rgba(255,255,255,0.6)", fillOpacity: 1, weight: 0 }).addTo(map);
      refs.arrows.push(line, arrow);
    });

    
    // Marqueur principal OCP
    const ocpIcon = L.divIcon({
      html: `<div style="background:#15532e;border:3px solid #4ade80;border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 16px #4ade8077">🏗</div>`,
      iconSize: [34,34], iconAnchor: [17,17], className: "",
    });
    L.marker(OCP_CENTER, { icon: ocpIcon }).addTo(map)
      .bindPopup(`<div style="font-family:sans-serif"><strong style="color:#4ade80">🏗 Usine OCP Safi</strong><br/><small>📍 32.2310°N, 9.2508°O</small><br/><small>Zone industrielle phosphates</small></div>`);

    setLiveData(data);
  };

  const handleForecast = (key) => { setActiveFc(key); renderLayers(key); };

  useEffect(() => { if (weather && activeFc === "now") renderLayers("now"); }, [weather]);

  useEffect(() => {
    const id = setInterval(() => {
      if (activeFc !== "now") return;
      setLiveData(prev => ({
        ...prev,
        pm25: +(Math.max(20, Math.min(80,  prev.pm25 + (Math.random()-0.5)*4))).toFixed(1),
        pm10: +(Math.max(40, Math.min(130, prev.pm10 + (Math.random()-0.5)*5))).toFixed(1),
        so2:  +(Math.max(50, Math.min(150, prev.so2  + (Math.random()-0.5)*6))).toFixed(1),
        aqi:  Math.round(Math.max(30, Math.min(180, prev.aqi + (Math.random()-0.5)*5))),
      }));
    }, 3500);
    return () => clearInterval(id);
  }, [activeFc]);

  const aqiLevel = getAqiLevel(liveData.aqi);
  const aqiPct   = Math.min((liveData.aqi / 200) * 100, 100).toFixed(0);
  const panelStyle = {
    position: "absolute", background: "rgba(8,20,36,0.88)",
    border: "0.5px solid rgba(255,255,255,0.13)", backdropFilter: "blur(10px)",
    borderRadius: 12, color: "#e2e8f0", zIndex: 1000,
  };
  const tabs = [
    { key:"now", label:"Actuel" }, { key:"h6",  label:"+6h"  },
    { key:"h12", label:"+12h"  }, { key:"h24", label:"+24h" },
  ];

  return (
    <div className="glass animate-in" style={{ overflow:"hidden", borderRadius:"var(--radius)", position:"relative" }}>
      <div style={{ padding:".8rem 1.1rem .5rem", borderBottom:"1px solid var(--glass-border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <h3 style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"var(--text-muted)", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"rmPulse 1.8s ease-in-out infinite" }}/>
          🗺️ Supervision atmosphérique — OCP Safi
        </h3>
        <span style={{ fontSize:".65rem", color:"#4ade80", fontWeight:600 }}>{liveData.label}</span>
      </div>

      {/* Sélecteur de thème de carte */}
      <div style={{ padding:"8px 11px", borderBottom:"0.5px solid var(--glass-border)", display:"flex", gap:"6px", alignItems:"center" }}>
        <span style={{ fontSize:"11px", color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>Carte :</span>
        {Object.entries(MAP_THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => changeMapTheme(key)}
            style={{
              padding:"5px 12px",
              fontSize:"11px",
              borderRadius:"6px",
              border: `1.5px solid ${mapTheme === key ? "#4ade80" : "rgba(255,255,255,0.2)"}`,
              background: mapTheme === key ? "rgba(74,222,128,0.15)" : "transparent",
              color: mapTheme === key ? "#4ade80" : "#cbd5e1",
              cursor:"pointer",
              fontWeight: mapTheme === key ? 600 : 400,
              transition:"all .2s",
              letterSpacing:".02em",
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <div
  style={{
    position: "relative",
    height: "calc(120vh - 120px)",
    width: "100%",
  }}
>
        {isLoading && (
          <div style={{ position:"absolute", inset:0, background:"#0a1628", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000 }}>
            <div style={{ textAlign:"center", color:"#94a3b8" }}>
              <div style={{ width:32, height:32, border:"3px solid #4ade8044", borderTopColor:"#4ade80", borderRadius:"50%", animation:"rmSpin 0.8s linear infinite", margin:"0 auto 12px" }}/>
              <div style={{ fontSize:13 }}>Chargement de la carte…</div>
            </div>
          </div>
        )}

        <div ref={mapRef} style={{ width:"100%", height:"100%" }}/>

        {/* Onglets prévision */}
        <div style={{ ...panelStyle, top:10, left:10, display:"flex", gap:5, padding:7 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => handleForecast(t.key)} style={{
              fontSize:12, padding:"7px 14px", borderRadius:8, cursor:"pointer", fontWeight: activeFc===t.key ? 700 : 500,
              border:`2px solid ${activeFc===t.key ? "#4ade80" : "rgba(255,255,255,0.25)"}`,
              background: activeFc===t.key ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.05)",
              color: activeFc===t.key ? "#4ade80" : "#cbd5e1",
              transition:"all .2s", letterSpacing:".03em",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Panel métriques */}
        <div style={{ ...panelStyle, top:10, right:10, width:182, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#4ade80", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", display:"inline-block", animation:"rmPulse 1.8s ease-in-out infinite" }}/>
            Supervision OCP
          </div>
          {[
            ["🌡", "Temp.",     `${liveData.temp}°C`],
            ["💧", "Humidité",  `${liveData.hum}%`],
            ["💨", "Vent",      `${liveData.windSpeed} m/s`],
            ["🧭", "Direction", `${liveData.windDeg}°`],
            ["☁",  "PM2.5",    `${typeof liveData.pm25==="number" ? liveData.pm25.toFixed(1) : liveData.pm25} µg/m³`],
            ["🌫", "PM10",     `${typeof liveData.pm10==="number" ? liveData.pm10.toFixed(1) : liveData.pm10} µg/m³`],
            ["⚗",  "SO₂",     `${typeof liveData.so2 ==="number" ? liveData.so2.toFixed(1)  : liveData.so2} µg/m³`],
            ["🔬", "NOx",      `${liveData.nox} µg/m³`],
          ].map(([ico, label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"0.5px solid rgba(255,255,255,0.06)", fontSize:11 }}>
              <span style={{ color:"#94a3b8" }}>{ico} {label}</span>
              <span style={{ color:"#e2e8f0", fontWeight:600 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#94a3b8", marginBottom:3 }}>
              <span>IQA</span>
              <span style={{ color:aqiLevel.color, fontWeight:700 }}>{aqiLevel.label} ({liveData.aqi})</span>
            </div>
            <div style={{ height:4, borderRadius:2, background:"linear-gradient(to right,#22c55e,#eab308,#f97316,#ef4444)", position:"relative" }}>
              <div style={{ position:"absolute", top:-3, left:`calc(${aqiPct}% - 5px)`, width:10, height:10, borderRadius:"50%", background:"#fff", border:"2px solid #0a1628", transition:"left .6s" }}/>
            </div>
          </div>
        </div>

        {/* Alerte */}
        <div style={{ ...panelStyle, bottom:10, left:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>{aqiLevel.icon}</span>
          <div>
            <div style={{ fontSize:12, fontWeight:700 }}>Alerte : {aqiLevel.label.toUpperCase()}</div>
            <div style={{ fontSize:10, color:"#94a3b8" }}>Vent {liveData.windDeg}° — {liveData.windSpeed} m/s</div>
          </div>
        </div>

        {/* Légende */}
        <div style={{ ...panelStyle, bottom:10, right:10, padding:"8px 12px", minWidth:130 }}>
          <div style={{ fontSize:9, color:"#94a3b8", letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontWeight:700 }}>Concentration</div>
          {[["#dc2626","Très élevée"],["#f97316","Élevée"],["#eab308","Modérée"],["#22c55e","Faible"],["#38bdf8","Très faible"],["#3b82f6","Minimale"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:"#cbd5e1", marginBottom:3 }}>
              <div style={{ width:26, height:6, borderRadius:3, background:c }}/>
              {l}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rmPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes rmSpin  { to{transform:rotate(360deg)} }
        .leaflet-popup-content-wrapper { background:rgba(8,20,36,0.95)!important; border:0.5px solid rgba(255,255,255,0.15)!important; border-radius:8px!important; color:#e2e8f0!important; }
        .leaflet-popup-tip { background:rgba(8,20,36,0.95)!important; }
        .leaflet-popup-close-button { color:#94a3b8!important; }
      `}</style>
    </div>
  );
}