import IndicCard from "../../ui/IndicCard";
import { T, F } from "../../../lib/designSystem";

export default function TabGouvernance({ db }) {
  const ind = db.indicateurs;
  return (
    <div>
      <div className="stagger-item" style={{ fontFamily: F.body, fontSize: 12, color: T.clay, marginBottom: 20, lineHeight: 1.6, background: T.cream, borderRadius: 12, padding: "12px 16px", border: `1px solid ${T.straw}` }}>
        Référentiels : <strong>GRI 205</strong> (anti-corruption) · <strong>ESRS G1</strong> · <strong>ISO 26000 §6.6</strong> · <strong>Loi LME</strong> · <strong>Loi Sapin II</strong> · <strong>Directive CSRD</strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div className="stagger-item">
          <IndicCard title="Délai paiement fournisseurs" value={ind.delaiPay} unit=" jours" cible={45}
            trend={ind.delaiPay < 50 ? "up" : "down"} pilier="Gouvernance"
            normeRef={["LME", "ISO26000", "ESRS_G1"]}
            why="Loi LME (2008) : délai maximum légal de 60 jours. ISO 26000 §6.6 : loyauté des pratiques dans la chaîne d'approvisionnement. Les retards de paiement fragilisent les sous-traitants et exposent à des sanctions DGCCRF."
            action="Mettre en place un suivi automatisé des délais de paiement. Négocier des conditions équitables. Viser les 45j pour dépasser la conformité légale." />
        </div>
        <div className="stagger-item">
          <IndicCard title="% sous-traitants évalués RSE" value={ind.pctST} unit="%" cible={60}
            trend={ind.pctST > 40 ? "up" : "down"} pilier="Gouvernance"
            normeRef={["ISO26000", "ESRS_G1", "LME"]}
            why="ISO 26000 §6.6 : responsabilité dans la chaîne d'approvisionnement. Les grands donneurs d'ordre exigent EcoVadis ou QUALIBAT à leurs sous-traitants. ESRS G1 : devoir de vigilance."
            action="Déployer une grille d'évaluation RSE simplifiée. Exiger le QUALIBAT RSE ou EcoVadis pour les sous-traitants récurrents. Former l'équipe achat aux critères RSE." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Niveau CSRD-readiness" value={Math.round((ind.pctST + ind.delaiPay) / 2)} unit="%" cible={70}
            trend="up" pilier="Gouvernance"
            normeRef={["ESRS_G1", "ISO26000", "SAPIN2"]}
            why="La CSRD impose un reporting ESG progressif : 2024 (>500 sal.), 2025 (>250 sal.), 2026 (>50 sal. + PME cotées). ISO 26000 §7 : communication sur la responsabilité sociétale."
            action="Cartographier les données ESG disponibles. Nommer un référent CSRD interne. S'appuyer sur le kit CSRD FFB ou EY/PWC pour les PME." />
        </div>
        <div className="stagger-item">
          <IndicCard title="Score gouvernance éthique" value={Math.round(ind.pctST * 0.7)} unit="pt" cible={60}
            trend="up" pilier="Gouvernance"
            normeRef={["ESRS_G1", "SAPIN2", "ISO26000"]}
            why="GRI 205 : anti-corruption. Loi Sapin II : prévention corruption, transparence. ISO 26000 §6.6 : pratiques loyales."
            action="Adopter un code de conduite fournisseurs. Mettre en place une procédure de signalement interne (conformité Sapin II). Documenter les décisions stratégiques." />
        </div>
      </div>
    </div>
  );
}
