import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext();

const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
  info:    "ℹ️",
};

const COLORS = {
  success: { bg:"rgba(74,222,128,0.1)",  border:"rgba(74,222,128,0.35)",  bar:"#4ade80",  text:"#4ade80"  },
  error:   { bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.35)", bar:"#f87171",  text:"#f87171"  },
  warning: { bg:"rgba(251,191,36,0.1)",  border:"rgba(251,191,36,0.35)",  bar:"#fbbf24",  text:"#fbbf24"  },
  info:    { bg:"rgba(56,189,248,0.1)",  border:"rgba(56,189,248,0.35)",  bar:"#38bdf8",  text:"#38bdf8"  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback(({ message, type = "info", duration = 4000, description = "" }) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type, duration, description, progress: 100 }]);

    // Auto-remove
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message, description, duration) => addToast({ message, type:"success", description, duration }),
    error:   (message, description, duration) => addToast({ message, type:"error",   description, duration }),
    warning: (message, description, duration) => addToast({ message, type:"warning", description, duration }),
    info:    (message, description, duration) => addToast({ message, type:"info",    description, duration }),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: ".65rem",
      maxWidth: "360px",
      pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const { id, message, type, duration, description } = toast;
  const c = COLORS[type] || COLORS.info;
  const [progress, setProgress] = React.useState(100);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Slide in
    const t0 = setTimeout(() => setVisible(true), 10);
    // Progress bar
    const interval = 50;
    const steps = duration / interval;
    const decrement = 100 / steps;
    let current = 100;
    const t1 = setInterval(() => {
      current -= decrement;
      setProgress(Math.max(current, 0));
    }, interval);
    return () => { clearTimeout(t0); clearInterval(t1); };
  }, [duration]);

  return (
    <div
      onClick={() => onRemove(id)}
      style={{
        pointerEvents: "all",
        background: "rgba(9,21,16,0.97)",
        border: `1px solid ${c.border}`,
        borderRadius: "12px",
        padding: "1rem 1.1rem 0.8rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${c.border}`,
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.9)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        backdropFilter: "blur(16px)",
        minWidth: "280px",
      }}
    >
      {/* Glow bg */}
      <div style={{ position:"absolute", inset:0, background:c.bg, pointerEvents:"none" }} />

      {/* Content */}
      <div style={{ position:"relative", display:"flex", alignItems:"flex-start", gap:".75rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius:"50%",
          background: `${c.text}18`, border:`1px solid ${c.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink: 0, fontSize: "1rem",
        }}>
          {ICONS[type]}
        </div>
        <div style={{ flex:1, paddingTop:".1rem" }}>
          <p style={{ fontSize:".85rem", fontWeight:700, color:"var(--text-primary)", fontFamily:"var(--font-display)", lineHeight:1.3, marginBottom: description ? ".3rem" : 0 }}>
            {message}
          </p>
          {description && (
            <p style={{ fontSize:".75rem", color:"var(--text-secondary)", lineHeight:1.4 }}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontSize:"1rem", lineHeight:1, padding:0, marginTop:"-.1rem" }}
        >×</button>
      </div>

      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:"rgba(255,255,255,0.06)" }}>
        <div style={{ height:"100%", width:`${progress}%`, background:c.bar, transition:"width 0.05s linear", borderRadius:"0 2px 2px 0", boxShadow:`0 0 6px ${c.bar}` }} />
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}