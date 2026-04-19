import Card from "../../ui/Card";
import IndicCard from "../../ui/IndicCard";
import { T, F } from "../../../lib/designSystem";

export default function TabSocial({ db }) {
  const ind = db.indicateurs;
  return (
    <div>
      <div className="stagger-item" style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginBottom: 20, lineHeight: 1.6, background: T.cream, borderRadius: 12, padding: "12px 16px", border: `1px solid ${T.straw}` }}>
        Référentiels : <strong>GRI 403</strong> (santé-sécurité) · <strong>GRI 404</strong> (formation) · <strong>GRI 405</strong> (diversité) · <strong>ESRS S1</strong> · <strong>Code du travail L.4121-1</strong> · <strong>ISO 45001</strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div className="stagger-item">
          <IndicCard title="Taux de Fréquence accidents (TF)" value={ind.tf} unit="" cible={12}
            trend="down" pilier="Social"
            normeRef={["GRI_OHS", "CT_L4121", "ESRS_S1"]}
            why="GRI 403-9 : TF = nb accidents × 1 000 000 / heures travaillées. Le BTP est le 2ème secteur le plus accidentogène. Obligation de résultat employeur (Code travail L.4121-1). Objectif OPPBTP : TF < 12."
            action="Mettre en place les causeries sécurité hebdomadaires. Renforcer les PPSPS. Viser la démarche MASE (exigée par 80% des grands donneurs d'ordre). Contacter l'OPPBTP pour un accompagnement gratuit." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Taux de Gravité (TG)" value={ind.tg} unit="" cible={1.0}
            trend="down" pilier="Social"
            normeRef={["GRI_OHS", "CT_L4121", "ESRS_S1"]}
            why="GRI 403-9 : TG = nb journées perdues × 1 000 / heures travaillées. Indicateur de sévérité des accidents. Objectif sectoriel : TG < 1,0."
            action="Analyser les accidents graves des 3 dernières années (arbre des causes). Améliorer les équipements de protection collective. Renforcer la formation aux premiers secours (SST)." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Heures de formation / salarié / an" value={ind.hForm} unit="h" cible={35}
            trend={ind.hForm > 20 ? "up" : "stable"} pilier="Social"
            normeRef={["GRI_T", "CT_L6311", "ESRS_S1"]}
            why="GRI 404-1 : moyenne d'heures de formation par employé. Code travail L.6311-1 : droit individuel à la formation. 35h/an est la référence des entreprises engagées BTP (FFB)."
            action="Formaliser le Plan de Développement des Compétences (PDC) annuel. Mobiliser les fonds OPCO Construction. Développer les CQP BTP et contrats d'alternance." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Taux de turnover" value={16} unit="%" cible={10}
            trend="stable" pilier="Social"
            normeRef={["GRI_T", "ESRS_S1", "ISO26000"]}
            why="ISO 26000 §6.4 : pratiques en matière d'emploi. GRI 401-1 : embauches et départs. Un fort turnover BTP (+15%) signale des conditions de travail dégradées et coûte en moyenne 6 mois de salaire par départ."
            action="Mener une enquête de satisfaction interne. Revoir les conditions de pénibilité (C2P). Améliorer l'intégration des nouveaux compagnons. Mettre en place la prime de fidélisation." />
        </div>
      </div>

      {/* Index F/H (affiché seulement si PME ≥ 50 sal.) */}
      {(db.taille === "pme50" || db.taille === "pme250") && (
        <Card className="stagger-item" style={{ padding: 24, marginBottom: 18, background: "linear-gradient(135deg,#F9F6FF,#FFF)" }}>
          <div style={{ fontSize: 11, color: T.slate, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            ⚖️ Index Égalité Femmes-Hommes — GRI 405 / ESRS S1 / Code travail L.1142-8
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { label: "Écarts de rémunération", pts: 25, max: 40, ok: false },
              { label: "Augmentations F/H",       pts: 15, max: 20, ok: true  },
              { label: "Promotions F/H",           pts: 12, max: 15, ok: true  },
              { label: "Congé maternité",          pts: 15, max: 15, ok: true  },
            ].map((x) => (
              <div key={x.label} style={{ background: x.ok ? "#EEF7EC" : "#FFF8EC", borderRadius: 12, padding: "14px 16px", border: `1px solid ${x.ok ? T.mist : T.straw}` }}>
                <div style={{ fontFamily: F.body, fontSize: 11, color: T.clay, marginBottom: 8, lineHeight: 1.4 }}>{x.label}</div>
                <div style={{ fontFamily: F.display, fontSize: 20, fontWeight: 800, color: x.ok ? T.moss : T.amber }}>
                  {x.pts}<span style={{ fontSize: 11, color: T.mineral }}>/{x.max}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: T.clay, fontFamily: F.body, lineHeight: 1.5 }}>
            Score estimé : <strong style={{ color: T.fern }}>67/100</strong> — Publication obligatoire avant le 1er mars. Seuil minimal légal : 75/100.
          </div>
        </Card>
      )}
    </div>
  );
}
