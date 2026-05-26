import React from "react";

function ArcGauge({ value, max, color, icon }) {
  const pct = Math.min(value / max, 1);
  const r = 28, cx = 34, cy = 34;
  const startAngle = -220, totalArc = 260, fillArc = totalArc * pct;
  const toRad = d => d * Math.PI / 180;
  const arcPath = (start, sweep) => {
    const x1 = cx + r*Math.cos(toRad(start)), y1 = cy + r*Math.sin(toRad(start));
    const x2 = cx + r*Math.cos(toRad(start+sweep)), y2 = cy + r*Math.sin(toRad(start+sweep));
    return `M${x1},${y1} A${r},${r},0,${Math.abs(sweep)>180?1:0},1,${x2},${y2}`;
  };
  return (
    <svg width="68" height="60" viewBox="0 0 68 60">
      <path d={arcPath(startAngle, totalArc)} fill="none" stroke="rgba(174,195,176,0.12)" strokeWidth="5" strokeLinecap="round"/>
      {pct>0 && <path d={arcPath(startAngle, fillArc)} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/>}
      <text x={cx} y={cy+5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-display)">{icon}</text>
    </svg>
  );
}

function SunArc({ sunrise="06:36", sunset="20:31" }) {
  const now = new Date();
  const toMin = t => { const [h,m]=t.split(":"); return +h*60+ +m; };
  const pct = Math.max(0,Math.min((now.getHours()*60+now.getMinutes()-toMin(sunrise))/(toMin(sunset)-toMin(sunrise)),1));
  const r=26,cx=40,cy=36;
  const toRad=d=>d*Math.PI/180;
  const arc=(start,sweep)=>{
    const x1=cx+r*Math.cos(toRad(start)),y1=cy+r*Math.sin(toRad(start));
    const x2=cx+r*Math.cos(toRad(start+sweep)),y2=cy+r*Math.sin(toRad(start+sweep));
    return `M${x1},${y1} A${r},${r},0,0,${sweep<0?0:1},${x2},${y2}`;
  };
  const dotAngle=180+(-180)*pct;
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

export default function WeatherTiles({ weather, prediction }) {
  if (!weather) return null;
  const uvVal = 3;
  const uvColor = uvVal<=2?"#4ade80":uvVal<=5?"#fbbf24":uvVal<=7?"#fb923c":"#f87171";
  const pressColor = weather.pressure>1013?"#38bdf8":"#fb923c";
  const riskColors = ["#4ade80","#fbbf24","#fb923c","#f87171"];
  const sc = prediction?.scenario ?? 0;
  return (
    <div className="weather-tiles animate-in">
      <div className="weather-tile">
        <div className="weather-tile-label">UV</div>
        <div className="weather-tile-value">{uvVal<=2?"Faible":uvVal<=5?"Modéré":"Élevé"}</div>
        <div className="tile-gauge-arc"><ArcGauge value={uvVal} max={11} color={uvColor} icon={uvVal}/></div>
      </div>
      <div className="weather-tile">
        <div className="weather-tile-label">Humidité</div>
        <div className="weather-tile-value">{weather.humidity}%</div>
        <div className="tile-gauge-arc"><ArcGauge value={weather.humidity} max={100} color="#38bdf8" icon="💧"/></div>
      </div>
      <div className="weather-tile">
        <div className="weather-tile-label">Ressenti</div>
        <div className="weather-tile-value">{Math.round(weather.feels_like)}°</div>
        <div className="tile-gauge-arc"><ArcGauge value={weather.feels_like+10} max={50} color="#a78bfa" icon="🌡️"/></div>
      </div>
      <div className="weather-tile">
        <div className="weather-tile-label">Coucher</div>
        <div className="weather-tile-value">20:31</div>
        <div className="tile-gauge-arc"><SunArc/></div>
      </div>
      <div className="weather-tile">
        <div className="weather-tile-label">Pression</div>
        <div className="weather-tile-value">{weather.pressure}</div>
        <div style={{ fontSize:".68rem", color:"var(--text-muted)" }}>mbar</div>
        <div className="tile-gauge-arc"><ArcGauge value={weather.pressure} max={1050} color={pressColor} icon="↑"/></div>
      </div>
      <div className="weather-tile">
        <div className="weather-tile-label">Niveau risque</div>
        <div className="weather-tile-value" style={{ fontSize:"1rem", color:riskColors[sc] }}>{prediction?.label ?? "—"}</div>
        <div style={{ fontSize:".68rem", color:"var(--text-muted)" }}>{prediction?`Conf. ${prediction.confidence}%`:"—"}</div>
        <div className="tile-gauge-arc"><ArcGauge value={sc+1} max={4} color={riskColors[sc]} icon={["✅","⚠️","🔶","🚨"][sc]}/></div>
      </div>
    </div>
  );
}