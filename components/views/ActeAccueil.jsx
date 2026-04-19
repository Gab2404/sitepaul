import { T, F } from "../../lib/designSystem";

/**
 * ACTE 1 — Écran d'accueil
 * Présente la plateforme, les chiffres clés, le CTA "Démarrer".
 */
export default function ActeAccueil({ onStart }) {
  return (
    <div className="act-enter" style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${T.soil} 0%, ${T.bark} 40%, ${T.moss} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px", position: "relative", overflow: "hidden",
    }}>
      {/* Grille de fond subtile */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)`,
        pointerEvents: "none",
      }} />

      {/* Orbes décoratifs */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 400, height: 400,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.moss}30 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.ochre}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 680, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>

        {/* Pill badge */}
        <div className="stagger-item" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: 44,
          padding: "8px 20px", marginBottom: 32,
        }}>
          <span style={{ fontSize: 18 }}>🌿</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, color: `${T.mist}CC`, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Plateforme RSE BTP — 2025
          </span>
        </div>

        {/* Titre */}
        <h1 className="stagger-item" style={{
          fontFamily: F.display, fontSize: "clamp(32px,6vw,58px)", fontWeight: 700,
          color: T.cream, lineHeight: 1.18, marginBottom: 20,
          textShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          Pilotez votre performance<br />
          <em style={{ color: T.sand }}>RSE</em> en 5 minutes
        </h1>

        <p className="stagger-item" style={{
          fontFamily: F.body, fontSize: 17, color: `${T.straw}CC`,
          lineHeight: 1.7, marginBottom: 12, maxWidth: 520, margin: "0 auto 12px",
        }}>
          Diagnostic normatif complet : ISO 26000, GRI, ESRS/CSRD, Code du travail.<br />
          Conçu pour les PME du BTP.
        </p>

        {/* Badges normes */}
        <div className="stagger-item" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 44, marginTop: 20 }}>
          {["ISO 26000", "GRI 305", "ESRS E1", "RE2020", "Loi AGEC", "CSRD"].map((l) => (
            <span key={l} style={{
              background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
              color: `${T.mist}DD`, borderRadius: 20, padding: "4px 12px",
              fontSize: 11, fontFamily: F.mono, fontWeight: 600, letterSpacing: "0.05em",
            }}>{l}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="stagger-item">
          <button className="btn-primary pulse-cta" onClick={onStart} style={{ fontSize: 17, padding: "16px 44px" }}>
            <span>Démarrer le diagnostic</span>
            <span style={{ fontSize: 20 }}>→</span>
          </button>
        </div>

        {/* Stats */}
        <div className="stagger-item" style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[{ v: "10", l: "questions clés" }, { v: "19", l: "référentiels normatifs" }, { v: "3", l: "piliers RSE analysés" }].map((x) => (
            <div key={x.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 800, color: T.sand }}>{x.v}</div>
              <div style={{ fontFamily: F.body, fontSize: 12, color: `${T.mist}99`, marginTop: 2 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
