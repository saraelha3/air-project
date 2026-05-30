import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl:markerIcon2x, iconUrl:markerIcon, shadowUrl:markerShadow });

const cityIcon = new L.Icon({ iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", shadowUrl:markerShadow, iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34] });
const ocpIcon  = new L.Icon({ iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",   shadowUrl:markerShadow, iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34] });

const SAFI = [32.3, -9.2333];
const OCP  = [32.2800, -8.7700];

export default function RadarMap({ weather }) {
  const safiPos = weather?.location ? [weather.location.lat, weather.location.lon] : SAFI;
  const ocpPos  = weather?.ocp ? [weather.ocp.lat, weather.ocp.lon] : OCP;
  const windDeg = weather?.wind_deg ?? 0;
  const rad = (windDeg * Math.PI) / 180;
  const arrowEnd = [ocpPos[0] - 0.12 * Math.cos(rad), ocpPos[1] + 0.12 * Math.sin(rad)];
  const center = [(safiPos[0] + ocpPos[0]) / 2, (safiPos[1] + ocpPos[1]) / 2];

  return (
    <div className="glass animate-in" style={{ overflow:"hidden", borderRadius:"var(--radius)" }}>
      <div style={{ padding:".8rem 1.1rem .5rem", borderBottom:"1px solid var(--glass-border)" }}>
        <h3 style={{ fontSize:".72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"var(--text-muted)" }}>
          🗺️ Carte radar météo — Safi & OCP
        </h3>
      </div>
      <div className="map-container" style={{ height:280, borderRadius:0, border:"none" }}>
        <MapContainer center={center} zoom={10} scrollWheelZoom={false} style={{ height:"100%", width:"100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Circle center={ocpPos} radius={8000} pathOptions={{ color:"#f87171", fillColor:"#f87171", fillOpacity:.06, weight:1.5, dashArray:"6 4" }}/>
          <Circle center={ocpPos} radius={3000} pathOptions={{ color:"#fb923c", fillColor:"#fb923c", fillOpacity:.1, weight:1, dashArray:"4 3" }}/>
          <Marker position={safiPos} icon={cityIcon}>
            <Popup>
              <strong>Ville de Safi</strong><br/>Centre urbain
              {weather && <><br/>🌡️ {weather.temperature?.toFixed(1)}°C · 💨 {weather.wind_speed} m/s</>}
            </Popup>
          </Marker>
          <Marker position={ocpPos} icon={ocpIcon}>
            <Popup><strong>Usine OCP — Safi</strong><br/>Zone industrielle</Popup>
          </Marker>
          <Polyline positions={[ocpPos, arrowEnd]} pathOptions={{ color:"#6B9071", weight:3, dashArray:"8 5", opacity:.85 }}/>
        </MapContainer>
      </div>
    </div>
  );
}