import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons in bundled builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const cityIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ocpIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Safi & OCP defaults
const SAFI = [32.3, -9.2333];
const OCP  = [32.2800, -8.7700];

export default function RadarMap({ weather }) {
  const safiPos = weather?.location
    ? [weather.location.lat, weather.location.lon]
    : SAFI;
  const ocpPos = weather?.ocp
    ? [weather.ocp.lat, weather.ocp.lon]
    : OCP;

  // Wind arrow: short line from OCP towards city, offset by wind direction
  const windDeg = weather?.wind_deg ?? 0;
  const rad = (windDeg * Math.PI) / 180;
  const len = 0.15; // degrees of lat/lon
  const arrowEnd = [
    ocpPos[0] - len * Math.cos(rad),
    ocpPos[1] + len * Math.sin(rad),
  ];

  const center = [
    (safiPos[0] + ocpPos[0]) / 2,
    (safiPos[1] + ocpPos[1]) / 2,
  ];

  return (
    <div className="glass animate-in" style={{ overflow: "hidden", borderRadius: "var(--radius)" }}>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Safi city */}
          <Marker position={safiPos} icon={cityIcon}>
            <Popup>
              <strong>Ville de Safi</strong>
              <br />
              Centre urbain
            </Popup>
          </Marker>

          {/* OCP plant */}
          <Marker position={ocpPos} icon={ocpIcon}>
            <Popup>
              <strong>Usine OCP</strong>
              <br />
              Zone industrielle sud
            </Popup>
          </Marker>

          {/* Wind direction arrow */}
          <Polyline
            positions={[ocpPos, arrowEnd]}
            pathOptions={{
              color: "#7c5cfc",
              weight: 3,
              dashArray: "8 6",
              opacity: 0.8,
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
