import { T } from "../../lib/designSystem";

/** Barre de progression comparative entre valeur actuelle et cible. */
export function MiniProgress({ val, cible }) {
  const max = Math.max(val, cible) * 1.5;
  const vp  = Math.min((val / max) * 100, 100);
  const cp  = Math.min((cible / max) * 100, 100);
  const ok  = val <= cible;
  return (
    <div style={{ height: 8, background: T.fog, borderRadius: 4, position: "relative", marginTop: 8 }}>
      <div style={{
        position: "absolute", height: "100%", left: 0, width: `${vp}%`,
        background: ok
          ? `linear-gradient(90deg,${T.moss},${T.leaf})`
          : `linear-gradient(90deg,${T.rust},${T.amber})`,
        borderRadius: 4, transition: "width 1.4s ease",
      }} />
      <div style={{
        position: "absolute", top: -3, left: `${cp}%`, width: 2, height: 14,
        background: T.ochre, borderRadius: 2, opacity: 0.8,
      }} />
    </div>
  );
}

/** Tag de statut coloré pour les actions du plan RSE. */
export function StatutTag({ s }) {
  const cfg = {
    a_lancer: { bg: "#FDECEA", c: T.rust,  l: "À lancer" },
    planifie:  { bg: "#FFF8EC", c: T.amber, l: "Planifié" },
    en_cours:  { bg: "#EEF4FF", c: T.slate, l: "En cours" },
    fait:      { bg: "#EEF7EC", c: T.moss,  l: "Réalisé" },
  };
  const x = cfg[s] || cfg.planifie;
  return (
    <span style={{
      background: x.bg, color: x.c, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700,
    }}>{x.l}</span>
  );
}

/** Flèche tendance : ↗ vert / ↘ rouge / → neutre. */
export function Trend({ t }) {
  if (t === "up")   return <span style={{ color: T.fern, fontSize: 13, fontWeight: 700 }}>↗</span>;
  if (t === "down") return <span style={{ color: T.rust, fontSize: 13, fontWeight: 700 }}>↘</span>;
  return <span style={{ color: T.clay, fontSize: 12 }}>→</span>;
}
