import { useState } from "react";
import { T, F } from "../../lib/designSystem";
import TabStrategique   from "./tabs/TabStrategique";
import TabEnvironnement from "./tabs/TabEnvironnement";
import TabSocial        from "./tabs/TabSocial";
import TabGouvernance   from "./tabs/TabGouvernance";
import TabActions       from "./tabs/TabActions";
import TabActus         from "./tabs/TabActus";

/**
 * ACTE 3 — Dashboard RSE complet.
 * Reçoit le profil calculé par l'API et orchestre les 5 onglets.
 * Contient le bouton Export PDF et le bouton Modifier.
 */
export default function ActeDashboard({ db, onReset }) {
  const [tab, setTab] = useState("strategique");

  const tabs = [
    { id: "strategique",  l: "Vue Stratégique", e: "📡" },
    { id: "environnement",l: "Environnement",   e: "🌿" },
    { id: "social",       l: "Social & RH",     e: "👷" },
    { id: "gouvernance",  l: "Gouvernance",     e: "🏛️" },
    { id: "actions",      l: "Plan d'action",   e: "🚀" },
    { id: "actus",        l: "Actualités RSE",  e: "📰" },
  ];

  const scoreColor = db.global >= 70 ? T.fern : db.global >= 50 ? T.amber : T.rust;

  const handleExport = () => {
    const prev = document.title;
    document.title = `Rapport RSE — ${db.nom} — ${new Date().getFullYear()}`;
    window.print();
    document.title = prev;
  };

  return (
    <div className="act-enter" style={{ minHeight: "100vh", background: T.fog }}>

      {/* Header sombre */}
      <div style={{ background: `linear-gradient(135deg,${T.soil},${T.bark})`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 20 }}>

          {/* Identité entreprise */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg,${T.moss},${T.fern})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: `0 4px 16px rgba(46,74,42,0.40)` }}>
              🌿
            </div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.cream, lineHeight: 1.2 }}>{db.nom}</div>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: `${T.sage}CC`, marginTop: 2, letterSpacing: "0.06em" }}>
                Tableau de bord RSE · Exercice 2025
              </div>
            </div>
          </div>

          {/* Score global */}
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: F.body, fontSize: 12, color: `${T.mist}99` }}>Score global</span>
            <span style={{ fontFamily: F.display, fontSize: 32, fontWeight: 800, color: scoreColor }}>{db.global}</span>
            <span style={{ fontFamily: F.body, fontSize: 12, color: `${T.mist}80` }}>/100</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="no-print">
            <button className="btn-export" onClick={handleExport}>
              <span>📄</span> Exporter la synthèse (PDF)
            </button>
            <button className="btn-ghost" onClick={onReset} style={{ color: T.sage, borderColor: `${T.sage}60`, background: "transparent" }}>
              ✏️ Modifier
            </button>
          </div>
        </div>

        {/* Tabs de navigation */}
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }} className="no-print">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                border: "none",
                borderBottom: active ? `2.5px solid ${T.leaf}` : "2.5px solid transparent",
                color: active ? T.cream : `${T.mist}80`,
                padding: "12px 18px", cursor: "pointer",
                fontFamily: F.body, fontSize: 13, fontWeight: active ? 700 : 400,
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s ease", whiteSpace: "nowrap",
                borderRadius: "8px 8px 0 0",
              }}>
                {t.e} {t.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>
        <div key={tab} className="act-enter-fast">
          {tab === "strategique"   && <TabStrategique   db={db} />}
          {tab === "environnement" && <TabEnvironnement db={db} />}
          {tab === "social"        && <TabSocial        db={db} />}
          {tab === "gouvernance"   && <TabGouvernance   db={db} />}
          {tab === "actions"       && <TabActions        db={db} />}
          {tab === "actus"        && <TabActus />}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.straw}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: F.body, fontSize: 11, color: T.mineral }}>
            Rapport généré le {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} · Plateforme RSE BTP 2025
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["ISO 26000", "GRI Standards", "ESRS/CSRD", "RE2020", "Code du travail"].map((l) => (
              <span key={l} style={{ background: T.fog, border: `1px solid ${T.straw}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontFamily: F.mono, color: T.mineral }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
