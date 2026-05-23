import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const ref = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section className="l-section l-section-alt" id="newsletter" ref={ref}>
      <div className="l-container">
        <div className="l-newsletter">
          <Bell size={32} style={{ color: "var(--accent-green)", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Get Air Quality Alerts
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Get notified when air quality changes in Safi. Stay informed, stay safe.
          </p>
          {submitted ? (
            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(22,163,74,0.1)", borderRadius: "var(--radius-sm)", color: "var(--accent-green)", fontWeight: 600 }}>
              ✅ Subscribed successfully! We'll keep you updated.
            </div>
          ) : (
            <form className="l-newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email" className="l-newsletter-input"
                placeholder="Enter your email address"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="l-btn l-btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
