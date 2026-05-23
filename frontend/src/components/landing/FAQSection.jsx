import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "How is AQI calculated?",
    a: "The Air Quality Index is calculated using concentrations of major pollutants including PM2.5, PM10, CO, SO₂, NO₂, and O₃. Each pollutant is converted to a sub-index, and the highest sub-index determines the overall AQI value on a scale from 0 (Good) to 500 (Hazardous)."
  },
  {
    q: "What triggers a production stop alert?",
    a: "A stop alert is triggered when the AI model detects a combination of adverse conditions: high pollutant concentrations exceeding WHO guidelines, unfavorable wind directions pointing toward populated areas, temperature inversions trapping emissions, or regulatory threshold breaches."
  },
  {
    q: "How often is the data updated?",
    a: "Climate and weather data is updated every 15 minutes from our monitoring stations. Air quality measurements are refreshed every 30 minutes. The ML prediction model recalculates production probabilities hourly using the latest aggregated data."
  },
  {
    q: "Is this data publicly available?",
    a: "Yes, all environmental monitoring data is publicly accessible through our dashboard. We believe in transparency and open data. Historical datasets can be downloaded for research purposes through our API. Sensitive operational data from OCP is anonymized."
  },
  {
    q: "What machine learning model is used?",
    a: "We use an XGBoost (Extreme Gradient Boosting) classifier trained on 3+ years of historical weather, air quality, and OCP production data from the Safi region. The model achieves 94% accuracy in predicting production continuation or stoppage recommendations."
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const answersRef = useRef([]);

  useEffect(() => {
    const items = ref.current.querySelectorAll(".l-faq-item");
    gsap.fromTo(items, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 80%" }
    });
  }, []);

  const toggle = (i) => {
    const el = answersRef.current[i];
    if (open === i) {
      gsap.to(el, { maxHeight: 0, duration: 0.35, ease: "power2.inOut" });
      setOpen(null);
    } else {
      if (open !== null && answersRef.current[open]) {
        gsap.to(answersRef.current[open], { maxHeight: 0, duration: 0.3, ease: "power2.inOut" });
      }
      gsap.to(el, { maxHeight: el.scrollHeight + 20, duration: 0.4, ease: "power2.out" });
      setOpen(i);
    }
  };

  return (
    <section className="l-section" id="faq" ref={ref}>
      <div className="l-container">
        <div className="l-section-title">
          <div className="l-badge">❓ FAQ</div>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about OCP Air monitoring</p>
        </div>

        <div className="l-faq-list">
          {faqs.map((f, i) => (
            <div key={i} className="l-faq-item">
              <button
                className={`l-faq-question${open === i ? " active" : ""}`}
                onClick={() => toggle(i)}
              >
                {f.q}
                <ChevronDown size={20} className="l-faq-chevron" />
              </button>
              <div className="l-faq-answer" ref={el => answersRef.current[i] = el}>
                <div className="l-faq-answer-inner">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
