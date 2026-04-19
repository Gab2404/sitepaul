import { useState } from "react";
import { T, F } from "../../lib/designSystem";
import NormeBadge from "./NormeBadge";
import { MiniProgress, Trend } from "./Misc";

/**
 * Carte d'indicateur RSE cliquable.
 * Affiche la valeur, une barre de progression vs cible,
 * et un panneau dépliable avec détail normatif + recommandation.
 */
export default function IndicCard({ title, value, unit, cible, trend, normeRef, why, action, pilier }) {
  const [open, setOpen] = useState(false);
  const ok = value <= cible;
  const pilCol = { Environnement: T.fern, Social: T.amber, Gouvernance: T.slate }[pilier] || T.clay;

  return (
    <div
      className="indic-card-hover"
      style={{
        background: T.white, borderRadius: 18,
        border: `1.5px solid ${open ? T.leaf : T.straw}`,
        boxShadow: open ? `0 6px 24px rgba(78,112,68,0.15)` : `0 2px 10px rgba(30,18,8,0.05)`,
        overflow: "hidden",
      }}
    >
      {/* En-tête cliquable */}
      <div onClick={() => setOpen((o) => !o)} style={{ padding: "18px 20px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: pilCol, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {pilier}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Trend t={trend} />
            <span style={{ fontSize: 11, color: T.mineral, fontFamily: F.mono }}>
              {open ? "▲ Fermer" : "▼ Détail norme"}
            </span>
          </div>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: T.clay, marginBottom: 6 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: F.display, fontSize: 28, fontWeight: 800, color: ok ? T.moss : T.rust }}>{value}</span>
          <span style={{ fontSize: 12, color: T.mineral }}>{unit}</span>
        </div>
        <MiniProgress val={value} cible={cible} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: T.mineral, fontFamily: F.body }}>
          <span>Actuel</span>
          <span>Cible : {cible}{unit}</span>
        </div>
      </div>

      {/* Panneau normatif (dépliable) */}
      {open && (
        <div style={{ borderTop: `1px solid ${T.fog}`, padding: "16px 20px", background: T.cream, animation: "fadeSlideUp 0.3s ease forwards" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: T.clay, fontFamily: F.body, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Référentiel normatif
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {normeRef.map((id) => <NormeBadge key={id} id={id} />)}
            </div>
          </div>
          <div style={{ background: "#EEF7EC", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: T.moss, fontFamily: F.body, fontWeight: 700, marginBottom: 4 }}>🎯 Critère RSE associé</div>
            <div style={{ fontSize: 12, color: T.ink, fontFamily: F.body, lineHeight: 1.6 }}>{why}</div>
          </div>
          <div style={{ background: "#FFF8EC", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: T.amber, fontFamily: F.body, fontWeight: 700, marginBottom: 4 }}>→ Recommandation concrète</div>
            <div style={{ fontSize: 12, color: T.ink, fontFamily: F.body, lineHeight: 1.6 }}>{action}</div>
          </div>
        </div>
      )}
    </div>
  );
}
