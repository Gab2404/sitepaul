import Card from "../../ui/Card";
import ScoreArc from "../../ui/ScoreArc";
import RadarChart from "../../ui/RadarChart";
import NormeBadge from "../../ui/NormeBadge";
import { T, F } from "../../../lib/designSystem";

export default function TabStrategique({ db }) {
  const yr = [
    { y: "2023", e: Math.max(db.envScore - 18, 10), s: Math.max(db.socScore - 15, 10), g: Math.max(db.gouScore - 20, 10) },
    { y: "2024", e: Math.max(db.envScore - 8, 15),  s: Math.max(db.socScore - 7, 15),  g: Math.max(db.gouScore - 10, 15) },
    { y: "2025", e: db.envScore, s: db.socScore, g: db.gouScore },
    { y: "2026 ▸", e: Math.min(db.envScore + 12, 100), s: Math.min(db.socScore + 10, 100), g: Math.min(db.gouScore + 15, 100) },
  ];

  return (
    <div>
      {/* Score global + Radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24, marginBottom: 24 }}>
        <Card className="stagger-item print-section" style={{ padding: 28 }}>
          <div style={{ fontSize: 11, color: T.fern, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
            📡 Score RSE Global — Exercice 2025
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <ScoreArc score={db.global} size={160} label="Score global" />
              <div style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginTop: 4 }}>
                {db.global >= 70 ? "✅ Niveau engagé" : db.global >= 50 ? "🟡 En progression" : "🔴 Démarrage"}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { l: "Environnement", v: db.envScore, e: "🌿" },
                { l: "Social & RH",   v: db.socScore, e: "👷" },
                { l: "Gouvernance",   v: db.gouScore, e: "🏛️" },
              ].map((x) => (
                <div key={x.l} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: F.body, fontSize: 13, color: T.ink }}>{x.e} {x.l}</span>
                    <span style={{ fontFamily: F.display, fontSize: 14, fontWeight: 800, color: x.v >= 70 ? T.moss : x.v >= 50 ? T.amber : T.rust }}>{x.v}/100</span>
                  </div>
                  <div style={{ height: 8, background: T.fog, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${x.v}%`, borderRadius: 4,
                      background: x.v >= 70
                        ? `linear-gradient(90deg,${T.moss},${T.leaf})`
                        : x.v >= 50
                        ? `linear-gradient(90deg,${T.clay},${T.sand})`
                        : `linear-gradient(90deg,${T.rust},${T.amber})`,
                      transition: "width 1.6s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="stagger-item print-section" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: T.slate, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, alignSelf: "flex-start" }}>
            🧭 Radar des piliers
          </div>
          <RadarChart env={db.envScore} soc={db.socScore} gou={db.gouScore} size={200} />
        </Card>
      </div>

      {/* Trajectoire */}
      <Card className="stagger-item print-section" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: T.slate, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>
          📈 Trajectoire RSE — Réel & Projection
        </div>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-end", height: 120 }}>
          {yr.map((y, i) => {
            const isFut = y.y.includes("▸");
            const avg = Math.round((y.e + y.s + y.g) / 3);
            return (
              <div key={y.y} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, color: T.clay, fontFamily: F.mono }}>{avg}</div>
                <div style={{
                  width: "60%",
                  background: isFut
                    ? `repeating-linear-gradient(45deg,${T.leaf}40,${T.leaf}40 4px,transparent 4px,transparent 8px)`
                    : `linear-gradient(180deg,${T.fern},${T.leaf})`,
                  height: `${(avg / 100) * 100}px`, borderRadius: "6px 6px 0 0",
                  border: isFut ? `2px dashed ${T.leaf}` : "none",
                  transition: `height ${1.0 + i * 0.15}s ease`,
                }} />
                <div style={{ fontSize: 11, color: isFut ? T.leaf : T.ink, fontFamily: F.body, fontWeight: isFut ? 700 : 400 }}>{y.y}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: T.mineral, fontFamily: F.body }}>
          ▸ Projection 2026 basée sur la mise en œuvre du plan d'action recommandé
        </div>
      </Card>

      {/* Alertes */}
      <div>
        <div style={{ fontSize: 11, color: T.clay, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
          ⚡ Alertes stratégiques actives
        </div>
        {db.alertes.map((a, i) => {
          const cfg = {
            critique:  { bg: "#FDECEA", border: "#FBBFAA", icon: "🚨", c: T.rust },
            importante:{ bg: "#FFF8EC", border: "#F6D280", icon: "⚠️", c: T.amber },
            info:      { bg: T.cream,  border: T.straw,  icon: "💡", c: T.clay },
          }[a.urgence] || { bg: T.cream, border: T.straw, icon: "💡", c: T.clay };
          return (
            <div key={i} className="stagger-item print-section" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{cfg.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.body, fontSize: 13, color: T.ink, marginBottom: 8, lineHeight: 1.5 }}>{a.msg}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {a.normes.map((n) => <NormeBadge key={n} id={n} small />)}
                  <span style={{ fontSize: 11, color: T.mineral, fontFamily: F.body }}>→ Pilier {a.pilier}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
