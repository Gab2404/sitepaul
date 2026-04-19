import NormeBadge from "../../ui/NormeBadge";
import { StatutTag } from "../../ui/Misc";
import { NORMES } from "../../../lib/normes";
import { T, F } from "../../../lib/designSystem";

export default function TabActions({ db }) {
  const pilCol = { Environnement: T.fern, Social: T.amber, Gouvernance: T.slate };
  const urgCol = {
    haute:  { bg: "#FDECEA", c: T.rust,  dot: "🔴" },
    moyenne:{ bg: "#FFF8EC", c: T.amber, dot: "🟡" },
    basse:  { bg: "#EEF7EC", c: T.moss,  dot: "🟢" },
  };

  return (
    <div>
      <div className="stagger-item" style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginBottom: 20, lineHeight: 1.6, background: T.cream, borderRadius: 12, padding: "12px 16px", border: `1px solid ${T.straw}` }}>
        Plan d'action personnalisé généré à partir de votre diagnostic. Classé par ordre de priorité normative et d'impact opérationnel.
      </div>

      {db.actions.map((a, i) => {
        const uc = urgCol[a.urgence] || urgCol.basse;
        const pc = pilCol[a.pilier] || T.clay;
        const norme = NORMES[a.norme];
        return (
          <div key={i} className="action-card-hover stagger-item print-section" style={{ background: T.white, borderRadius: 18, border: `1.5px solid ${T.straw}`, boxShadow: "0 2px 10px rgba(30,18,8,0.05)", padding: "20px 24px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              {/* Numéro */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${pc}18`, border: `1px solid ${pc}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, fontFamily: F.mono, fontWeight: 700, color: pc }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: T.ink }}>{a.label}</span>
                  <StatutTag s={a.statut} />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: pc, fontFamily: F.body, fontWeight: 700, background: `${pc}12`, border: `1px solid ${pc}20`, borderRadius: 20, padding: "2px 10px" }}>{a.pilier}</span>
                  {norme && <NormeBadge id={a.norme} small />}
                  <span style={{ fontSize: 11, color: T.mineral, fontFamily: F.mono }}>{a.ref}</span>
                </div>
                <div style={{ background: uc.bg, borderRadius: 10, padding: "8px 12px", border: `1px solid ${uc.c}20`, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12 }}>{uc.dot}</span>
                  <span style={{ fontFamily: F.body, fontSize: 12, color: T.ink }}>
                    <strong>Impact estimé :</strong> {a.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
