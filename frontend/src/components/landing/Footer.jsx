import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="l-footer" id="footer">
      <div className="l-container">
        <div className="l-footer-grid">
          <div className="l-footer-brand">
            <h3><Leaf size={20} style={{ color: "#16a34a" }} /> OCP Air</h3>
            <p>
              Advanced atmospheric surveillance platform for the city of Safi, Morocco.
              Monitoring air quality, predicting environmental risks, and driving
              sustainable industrial practices.
            </p>
            <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "rgba(232,240,254,0.4)" }}>
              Built for Safi. Powered by Data.
            </p>
          </div>

          <div className="l-footer-col">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/performance">Performance</Link>
            <Link to="/qa">Q&A</Link>
          </div>

          <div className="l-footer-col">
            <h4>Resources</h4>
            <a href="#">API Documentation</a>
            <a href="#">Open Data Portal</a>
            <a href="#">Research Papers</a>
            <a href="#">Methodology</a>
          </div>

          <div className="l-footer-col">
            <h4>Contact</h4>
            <a href="#">contact@ocpair.ma</a>
            <a href="#">Safi, Morocco</a>
            <a href="#">OCP Group HQ</a>
          </div>
        </div>

        <div className="l-footer-bottom">
          <span>© 2026 OCP Air Project. All rights reserved.</span>
          <div className="l-footer-socials">
            <a href="#" aria-label="GitHub"><Github size={16} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="#" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
