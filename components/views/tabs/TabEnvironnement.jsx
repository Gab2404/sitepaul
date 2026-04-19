import { useState } from "react";
import Card from "../../ui/Card";
import IndicCard from "../../ui/IndicCard";
import { T, F } from "../../../lib/designSystem";

export default function TabEnvironnement({ db }) {
  const ind = db.indicateurs;
  const [simCarb, setSimCarb] = useState(ind.co2);

  return (
    <div>
      <div className="stagger-item" style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginBottom: 20, lineHeight: 1.6, background: T.cream, borderRadius: 12, padding: "12px 16px", border: `1px solid ${T.straw}` }}>
        Référentiels : <strong>GRI 305</strong> · <strong>GRI 306</strong> · <strong>ESRS E1</strong> · <strong>ESRS E5</strong> · <strong>RE2020</strong> · <strong>Loi AGEC</strong> · <strong>Décret PEMD</strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div className="stagger-item">
          <IndicCard title="Taux de valorisation déchets" value={ind.tauxValo} unit="%" cible={70}
            trend={ind.tauxValo > 60 ? "up" : "down"} pilier="Environnement"
            normeRef={["GRI_W", "AGEC", "REP_PMCB", "ESRS_E5"]}
            why="GRI 306-4 : valorisation et élimination des déchets. La Loi AGEC impose le tri 7 flux depuis 2022. La REP PMCB structure les filières de collecte. Objectif sectoriel FNTP : >70% de valorisation."
            action="Contacter SINOE (ADEME) pour localiser les filières agréées. Mettre en place les BSD pour traçabilité. Viser la charte Chantier Propre FNTP." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Déchets produits par chantier" value={ind.kgM2} unit="kg/m²" cible={16}
            trend={ind.kgM2 < 20 ? "up" : "down"} pilier="Environnement"
            normeRef={["GRI_W", "PEMD", "AGEC"]}
            why="GRI 306-3 : déchets générés. Le Décret PEMD rend le diagnostic ressources obligatoire avant démolition >1000m². Référence sectorielle FFB : 15-20 kg/m² pour le gros œuvre."
            action="Réaliser le diagnostic ressources en amont de chaque chantier de démolition. Privilégier le réemploi sur site. Suivre les BSD sur un tableau de bord chantier." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Émissions CO₂ estimées" value={ind.co2} unit="tCO₂e/k€CA" cible={25}
            trend="down" pilier="Environnement"
            normeRef={["GRI_E", "ESRS_E1", "SNBC", "RE2020"]}
            why="GRI 305 couvre les Scopes 1 (carburant engins), 2 (énergie bureau) et 3 (matériaux, transport). La SNBC fixe la neutralité carbone en 2050. La Loi Industrie Verte 2023 intègre le carbone dans les AO publics."
            action="Réaliser un Bilan GES complet via l'outil SEVE (FFB) ou Bilan Carbone® ADEME. Identifier les postes prioritaires : béton/acier (Scope 3 majeur). Définir un plan de réduction avec jalons annuels." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Part matériaux biosourcés / recyclés" value={22} unit="%" cible={30}
            trend="up" pilier="Environnement"
            normeRef={["ESRS_E5", "RE2020", "SNBC"]}
            why="RE2020 valorise les matériaux à faible impact carbone (bois, chanvre, ouate). ESRS E5 exige le reporting sur l'utilisation des ressources. Objectif : augmenter la part biosourcée pour réduire le Scope 3."
            action="Sourcer les fournisseurs de matériaux biosourcés (annuaire FCBA). Intégrer les critères bas-carbone dans les appels d'offres matériaux. Former les conducteurs de travaux à la RE2020." />
        </div>
      </div>

      {/* Simulateur CO₂ */}
      <Card className="stagger-item" style={{ padding: 28 }}>
        <div style={{ fontSize: 11, color: T.fern, fontFamily: F.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
          🔬 Simulateur d'impact — Réduction CO₂ (GRI 305 / ESRS E1)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: T.clay, marginBottom: 16 }}>
              Simulez l'impact d'une réduction de 20% de votre consommation d'engins diesel :
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: F.body, fontSize: 12, color: T.ink, display: "block", marginBottom: 8 }}>
                Émissions actuelles : <strong>{simCarb} tCO₂e/k€CA</strong>
              </label>
              <input type="range" min={10} max={80} value={simCarb}
                onChange={(e) => setSimCarb(Number(e.target.value))}
                style={{ width: "100%", accentColor: T.fern }} />
            </div>
            <div style={{ background: "#EEF7EC", borderRadius: 12, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: T.moss, fontFamily: F.body, fontWeight: 700, marginBottom: 6 }}>Impact simulé (réduction -20%)</div>
              <div style={{ fontFamily: F.display, fontSize: 26, fontWeight: 800, color: T.moss }}>
                -{(simCarb * 0.20).toFixed(1)} <span style={{ fontSize: 14, color: T.fern }}>tCO₂e/k€CA</span>
              </div>
              <div style={{ fontSize: 12, color: T.moss, marginTop: 4, fontFamily: F.body }}>Accès aux marchés publics bas-carbone (Loi Industrie Verte)</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginBottom: 12 }}>Comparaison sectorielle (source : ADEME / FFB 2024)</div>
            {[
              { l: "Votre entreprise",     v: simCarb, col: T.fern  },
              { l: "Moyenne BTP France",   v: 38,      col: T.amber },
              { l: "Meilleures pratiques", v: 20,      col: T.moss  },
            ].map((x) => (
              <div key={x.l} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: F.body, fontSize: 12, color: T.ink }}>{x.l}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: x.col, fontWeight: 700 }}>{x.v}</span>
                </div>
                <div style={{ height: 8, background: T.fog, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${(x.v / 80) * 100}%`, background: x.col, borderRadius: 4, transition: "width 0.6s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
