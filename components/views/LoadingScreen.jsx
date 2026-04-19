import { useState, useEffect } from "react";
import { T, F } from "../../lib/designSystem";

/**
 * Écran de chargement animé affiché pendant l'appel API.
 * Simule l'analyse RSE avec des étapes qui défilent.
 */
export default function LoadingScreen() {
  const steps = [
    "Calcul des scores RSE…",
    "Analyse des référentiels normatifs…",
    "Génération des recommandations…",
    "Construction du tableau de bord…",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setCurrent((c) => (c + 1) % steps.length), 600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="act-enter" style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg,${T.soil},${T.bark} 60%,${T.moss})`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
    }}>
      {/* Spinner */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <div className="spin" style={{
          width: 80, height: 80, borderRadius: "50%",
          border: `4px solid ${T.moss}40`, borderTopColor: T.leaf,
        }} />
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 28 }}>
          🌿
        </span>
      </div>

      {/* Texte */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 22, color: T.cream, marginBottom: 12 }}>Analyse en cours</div>
        <div key={current} className="act-enter-fast" style={{ fontFamily: F.mono, fontSize: 13, color: `${T.mist}99`, letterSpacing: "0.05em" }}>
          {steps[current]}
        </div>
      </div>

      {/* Dots pulsants */}
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: T.leaf,
            animation: `dotPulse 1.2s ease ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
