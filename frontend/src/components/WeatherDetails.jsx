import React from "react";
import { Droplets, Gauge, Cloud, Wind, Eye, Thermometer } from "lucide-react";
import Tooltip from "./Tooltip";

const details = [
  { key:"humidity",   label:"Humidité",   icon:Droplets,    unit:"%",    format:v=>v,                          tip:"Taux d'humidité relative. >70% = diffusion polluants réduite." },
  { key:"pressure",   label:"Pression",   icon:Gauge,       unit:" hPa", format:v=>v,                          tip:"Pression atmosphérique. Une haute pression favorise la stagnation des polluants." },
  { key:"clouds",     label:"Nuages",     icon:Cloud,       unit:"%",    format:v=>v,                          tip:"Couverture nuageuse. Influence la photochimie des polluants." },
  { key:"wind_speed", label:"Vent",       icon:Wind,        unit:" m/s", format:v=>v,                          tip:"Vitesse du vent. Un vent >5 m/s disperse efficacement les polluants." },
  { key:"visibility", label:"Visibilité", icon:Eye,         unit:" km",  format:v=>(v/1000).toFixed(1),        tip:"Visibilité en km. Indicateur indirect de la qualité de l'air." },
  { key:"feels_like", label:"Ressenti",   icon:Thermometer, unit:"°C",   format:v=>Math.round(v),             tip:"Température ressentie, tenant compte du vent et de l'humidité." },
];

export default function WeatherDetails({ weather }) {
  if (!weather) return null;
  return (
    <div className="grid-details animate-in">
      {details.map(({ key, label, icon: Icon, unit, format, tip }) => (
        <Tooltip key={key} content={tip} position="top">
          <div className="glass detail-card" style={{ cursor:"help", width:"100%" }}>
            <span className="detail-label">
              <Icon size={13} /> {label}
            </span>
            <span className="detail-value">
              {format(weather[key])}
              <small style={{ fontSize:"0.65em", opacity:.6 }}>{unit}</small>
            </span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}