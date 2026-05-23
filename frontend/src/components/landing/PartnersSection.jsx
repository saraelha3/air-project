import React from "react";

const partners = [
  "OCP Group", "Ministry of Environment", "WHO", "Université Cadi Ayyad",
  "Commune de Safi", "ONEE", "Direction Météo Nationale", "IRESEN",
];

export default function PartnersSection() {
  // Duplicate for seamless infinite scroll
  const all = [...partners, ...partners];

  return (
    <section className="l-section" id="partners">
      <div className="l-container">
        <div className="l-section-title">
          <div className="l-badge">🤝 Partners</div>
          <h2>Trusted By Leading Institutions</h2>
          <p>Collaborating with key stakeholders for environmental excellence</p>
        </div>

        <div className="l-partners-wrapper">
          <div className="l-partners-track">
            {all.map((name, i) => (
              <div key={i} style={{
                padding: "1rem 2.5rem",
                background: "var(--bg-card)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
