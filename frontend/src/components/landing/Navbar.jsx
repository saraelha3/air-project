import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Leaf, Factory, Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`l-navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <NavLink to="/" className="l-navbar-logo">
        <Leaf size={22} />
        <span>OCP</span>&nbsp;Air
        <Factory size={16} style={{ opacity: 0.5, marginLeft: -4 }} />
      </NavLink>

      <ul className={`l-navbar-links${mobileOpen ? " mobile-open" : ""}`}>
        <li><NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/about" onClick={() => setMobileOpen(false)}>About</NavLink></li>
        <li><NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink></li>
        <li><NavLink to="/performance" onClick={() => setMobileOpen(false)}>Performance</NavLink></li>
        <li><NavLink to="/qa" onClick={() => setMobileOpen(false)}>Q&A</NavLink></li>
        <li>
          <button
            className="l-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          />
        </li>
      </ul>

      <button className="l-navbar-mobile" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}
