import React from "react";

/* Pulse keyframe injected once */
const style = `
@keyframes shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
.skeleton {
  background: linear-gradient(90deg,
    rgba(55,85,52,0.18) 25%,
    rgba(107,144,113,0.22) 50%,
    rgba(55,85,52,0.18) 75%
  );
  background-size: 600px 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: 8px;
}
`;

function injectStyle() {
  if (document.getElementById("skeleton-style")) return;
  const el = document.createElement("style");
  el.id = "skeleton-style";
  el.textContent = style;
  document.head.appendChild(el);
}

function Bone({ width = "100%", height = 16, radius = 8, style: s = {} }) {
  injectStyle();
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, flexShrink: 0, ...s }}
    />
  );
}

/* ── Pre-built skeletons ────────────────────────────────────── */

export function SkeletonHero() {
  injectStyle();
  return (
    <div style={{ background:"rgba(55,85,52,0.12)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:16, padding:"1.5rem 1.75rem", display:"flex", justifyContent:"space-between", alignItems:"center", minHeight:160 }}>
      <div style={{ display:"flex", flexDirection:"column", gap:".75rem", flex:1 }}>
        <Bone width={100} height={11} />
        <Bone width={180} height={42} radius={12} />
        <Bone width={140} height={11} />
        <div style={{ marginTop:".5rem" }}>
          <Bone width={120} height={13} />
          <Bone width={180} height={10} style={{ marginTop:8 }} />
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:".75rem" }}>
        <Bone width={72} height={72} radius={50} />
        <Bone width={80} height={38} radius={12} />
        <Bone width={60} height={11} />
      </div>
    </div>
  );
}

export function SkeletonKPI({ count = 4 }) {
  injectStyle();
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${count},1fr)`, gap:".8rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background:"rgba(15,35,20,.7)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:11, padding:"1rem 1.1rem", display:"flex", flexDirection:"column", gap:".55rem" }}>
          <Bone width={70} height={10} />
          <Bone width={80} height={30} radius={6} />
          <Bone width={100} height={9} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ height = 200 }) {
  injectStyle();
  return (
    <div style={{ background:"rgba(15,35,20,.7)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:16, padding:"1.1rem 1.4rem", height, display:"flex", flexDirection:"column", gap:".75rem" }}>
      <Bone width={120} height={12} />
      <div style={{ flex:1, marginTop:8 }}>
        <Bone width="100%" height="100%" radius={10} />
      </div>
    </div>
  );
}

export function SkeletonForecastPanel() {
  injectStyle();
  return (
    <div style={{ background:"rgba(15,35,20,.7)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:16, overflow:"hidden", height:"100%" }}>
      <div style={{ padding:"1rem 1.2rem .8rem", borderBottom:"1px solid rgba(174,195,176,.08)", display:"flex", justifyContent:"space-between" }}>
        <Bone width={120} height={13} />
        <Bone width={90} height={22} radius={50} />
      </div>
      {Array.from({ length:5 }).map((_,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:".9rem", padding:".7rem 1.2rem", borderBottom:"1px solid rgba(174,195,176,.05)" }}>
          <Bone width={36} height={36} radius={50} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <Bone width={120} height={11} />
            <Bone width={80} height={9} />
          </div>
          <Bone width={40} height={18} radius={6} />
          <Bone width={8} height={8} radius={50} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  injectStyle();
  return (
    <div style={{ background:"rgba(15,35,20,.7)", border:"1px solid rgba(174,195,176,0.1)", borderRadius:16, overflow:"hidden" }}>
      <div style={{ padding:"1rem 1.4rem", borderBottom:"1px solid rgba(174,195,176,.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Bone width={200} height={16} />
        <Bone width={120} height={28} radius={50} />
      </div>
      {Array.from({ length:6 }).map((_,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr 0.6fr 1fr 0.7fr 0.6fr 0.6fr 0.8fr", gap:"1rem", padding:".75rem 1.2rem", borderBottom:"1px solid rgba(174,195,176,.05)", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}><Bone width={70} height={11}/><Bone width={45} height={9}/></div>
          <Bone width={100} height={20} radius={50}/>
          <Bone width={40} height={16} radius={6}/>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}><Bone width={70} height={11}/><Bone width="100%" height={3}/></div>
          <Bone width={50} height={13}/>
          <Bone width={40} height={13}/>
          <Bone width={35} height={13}/>
          <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:20 }}>
            {[0,1,2,3].map(j=><Bone key={j} width={6} height={[16,8,4,2][j]} radius={2}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Bone;