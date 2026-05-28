import React, { useState, useRef, useEffect } from "react";

export default function Tooltip({ children, content, position = "top", delay = 300 }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timerRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const tr = triggerRef.current.getBoundingClientRect();
      const tt = tooltipRef.current.getBoundingClientRect();
      let top = 0, left = 0;
      const gap = 8;
      if (position === "top") {
        top  = tr.top - tt.height - gap + window.scrollY;
        left = tr.left + tr.width / 2 - tt.width / 2 + window.scrollX;
      } else if (position === "bottom") {
        top  = tr.bottom + gap + window.scrollY;
        left = tr.left + tr.width / 2 - tt.width / 2 + window.scrollX;
      } else if (position === "left") {
        top  = tr.top + tr.height / 2 - tt.height / 2 + window.scrollY;
        left = tr.left - tt.width - gap + window.scrollX;
      } else if (position === "right") {
        top  = tr.top + tr.height / 2 - tt.height / 2 + window.scrollY;
        left = tr.right + gap + window.scrollX;
      }
      setCoords({ top, left });
    }
    return () => clearTimeout(timerRef.current);
  }, [visible, position]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {children}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 10000,
            background: "rgba(9,21,16,0.98)",
            border: "1px solid rgba(174,195,176,0.22)",
            borderRadius: "9px",
            padding: ".55rem .85rem",
            fontSize: ".75rem",
            color: "var(--text-primary)",
            fontFamily: "var(--font)",
            maxWidth: "240px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            lineHeight: 1.5,
            pointerEvents: "none",
            animation: "tooltipIn .15s ease forwards",
          }}
        >
          {content}
          {/* Arrow */}
          <div style={{
            position: "absolute",
            ...(position === "top"    ? { bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" } : {}),
            ...(position === "bottom" ? { top:    -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" } : {}),
            ...(position === "left"   ? { right:  -5, top:  "50%", transform: "translateY(-50%) rotate(45deg)" } : {}),
            ...(position === "right"  ? { left:   -5, top:  "50%", transform: "translateY(-50%) rotate(45deg)" } : {}),
            width: 10, height: 10,
            background: "rgba(9,21,16,0.98)",
            border: "1px solid rgba(174,195,176,0.22)",
            clipPath: position === "top" ? "polygon(100% 0, 100% 100%, 0 100%)" : position === "bottom" ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%)",
          }} />
        </div>
      )}

      <style>{`@keyframes tooltipIn { from { opacity:0; transform:scale(.92) translateY(4px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </>
  );
}