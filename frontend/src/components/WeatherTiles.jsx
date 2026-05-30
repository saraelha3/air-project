import React from "react";
import Tooltip from "./Tooltip";

function ArcGauge({ value, max, color, icon }) {
  const pct = Math.min(value / max, 1);
  const r = 28, cx = 34, cy = 34;
  const startAngle = -220, totalArc = 260, fillArc = totalArc * pct;
  const toRad = d => d * Math.PI / 180;
  const arcPath = (start, sweep) => {
    const x1=cx+r*Math.cos(toRad(start)), y1=cy+r*Math.sin(toRad(start));
    const x2=cx+r*Math.cos(toRad(start+sweep)), y2=cy+r*Math.sin(toRad(start+sweep));
    return `M${x1},${y1} A${r},${r},0,${Math.abs(sweep)>180?1:0},1,${x2},${y2}`;
  };
  return (
    <svg width="68" height="60" viewBox="0 0 68 60">
      <path d={arcPath(startAngle,totalArc)} fill="none" stroke="rgba(174,195,176,0.12)" strokeWidth="5" strokeLinecap="round"/>
      {pct>0&&<path d={arcPath(startAngle,fillArc)} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/>}
      <text x={cx} y={cy+5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-display)">{icon}</text>
    </svg>
  );
}

function SunArc({ sunrise="06:36", sunset="20:31" }) {
  const now = new Date();
  const toMin = t => { const [h,m]=t.split(":"); return +h*60+ +m; };
  const pct = Math.max(0,Math.min((now.getHours()*60+now.getMinutes()-toMin(sunrise))/(toMin(sunset)-toMin(sunrise)),1));
  const r=26,cx=40,cy=36,toRad=d=>d*Math.PI/180;
  const arc=(start,sweep)=>{
    const x1=cx+r*Math.cos(toRad(start)),y1=cy+r*Math.sin(toRad(start));
    const x2=cx+r*Math.cos(toRad(start+sweep)),y2=cy+r*Math.sin(toRad(start+sweep));
    return `M${x1},${y1} A${r},${r},0,0,${sweep<0?0:1},${x2},${y2}`;
  };
  const dotAngle = 180+(-180)*pct;
  return (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <path d={arc(180,-180)} fill="none" stroke="rgba(174,195,176,0.12)" strokeWidth="3" strokeLinecap="round"/>
      <path d={arc(180,-180*pct)} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      {pct>0&&pct<1&&<circle cx={cx+r*Math.cos(toRad(dotAngle))} cy={cy+r*Math.sin(toRad(dotAngle))} r="5" fill="#fbbf24"/>}
      <text x="8" y="48" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font)">{sunrise}</text>
      <text x="56" y="48" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font)">{sunset}</text>
    </svg>
  );
}

const TILES = [
  { key:"uv",       label:"UV",          tip:"Indice UV actuel. >5 = risque photochimique élevé." },
  { key:"humidity", label:"Humidité",    tip:"Humidité relative. Influence la concentration des polluants." },
  { key:"feels",    label:"Ressenti",    tip:"Température ressentie selon le vent et l'humidité." },
  { key:"sunset",   label:"Coucher",     tip:"Heure du coucher du soleil à Safi." },
  { key:"pressure", label:"Pression",    tip:"Pression atmosphérique. Une haute pression = stagnation." },
  { key:"risk",     label:"Niveau risque", tip:"Niveau de risque prédit par le modèle XGBoost." },
];

export default function WeatherTiles({ weather, prediction }) {
  if (!weather) return null;
  const uvVal=3, uvColor=uvVal<=2?"#4ade80":uvVal<=5?"#fbbf24":uvVal<=7?"#fb923c":"#f87171";
  const pressColor=weather.pressure>1013?"#38bdf8":"#fb923c";
  const riskColors=["#4ade80","#fbbf24","#fb923c","#f87171"];
  const sc=prediction?.scenario??0;

  const tiles = [
    { key:"uv",       label:"UV",          value:uvVal<=2?"Faible":uvVal<=5?"Modéré":"Élevé", sub:null,      gauge:<ArcGauge value={uvVal} max={11} color={uvColor} icon={uvVal}/> },
    { key:"humidity", label:"Humidité",    value:`${weather.humidity}%`,                       sub:null,      gauge:<ArcGauge value={weather.humidity} max={100} color="#38bdf8" icon="💧"/> },
    { key:"feels",    label:"Ressenti",    value:`${Math.round(weather.feels_like)}°`,          sub:null,      gauge:<ArcGauge value={weather.feels_like+10} max={50} color="#a78bfa" icon="🌡️"/> },
    { key:"sunset",   label:"Coucher",     value:"20:31",                                      sub:null,      gauge:<SunArc/> },
    { key:"pressure", label:"Pression",    value:`${weather.pressure}`,                        sub:"mbar",    gauge:<ArcGauge value={weather.pressure} max={1050} color={pressColor} icon="↑"/> },
    { key:"risk",     label:"Niveau risque", value:prediction?.label??"—",                     sub:prediction?`Conf. ${prediction.confidence}%`:"—", color:riskColors[sc], gauge:<ArcGauge value={sc+1} max={4} color={riskColors[sc]} icon={["✅","⚠️","🔶","🚨"][sc]}/> },
  ];

  return (
    <div className="weather-tiles animate-in">
      {tiles.map((t, i) => (
        <Tooltip key={t.key} content={TILES[i].tip} position="top">
          <div className="weather-tile" style={{ cursor:"help", width:"100%" }}>
            <div className="weather-tile-label">{t.label}</div>
            <div className="weather-tile-value" style={t.color?{fontSize:"1rem",color:t.color}:{}}>{t.value}</div>
            {t.sub && <div style={{ fontSize:".68rem", color:"var(--text-muted)" }}>{t.sub}</div>}
            <div className="tile-gauge-arc">{t.gauge}</div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}