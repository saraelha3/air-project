import React from "react";
import { windDescription } from "../utils/windUtils";

export default function WindCompass({ direction, degrees, speed }) {
  const rotation = degrees ?? 0;
  return (
    <div className="glass compass-container animate-in">
      <span className="detail-label" style={{ marginBottom:2, fontSize:".68rem" }}>
        🧭 Direction du vent
      </span>
      <div className="compass">
        <span className="compass-label n">N</span>
        <span className="compass-label s">S</span>
        <span className="compass-label e">E</span>
        <span className="compass-label o">O</span>
        <div className="compass-needle" style={{ transform:`translateX(-50%) rotate(${rotation}deg)` }}/>
        <div className="compass-center"/>
      </div>
      <div className="compass-info">
        <div className="direction">{direction || "—"}</div>
        <div className="speed">
          {speed != null ? `${speed} m/s` : ""} · {windDescription(direction)}
        </div>
      </div>
    </div>
  );
}