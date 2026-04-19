import { T } from "./designSystem";

// ═══════════════════════════════════════════════════════════════════════════
// RÉFÉRENTIELS NORMATIFS — Correspondances officielles
// Chaque clé = un identifiant court utilisé dans les questions et les cards.
// ═══════════════════════════════════════════════════════════════════════════

export const NORMES = {
  ISO26000:  { label: "ISO 26000",           color: T.moss,   desc: "Lignes directrices responsabilité sociétale" },
  GRI_E:     { label: "GRI 305",             color: T.fern,   desc: "Émissions de gaz à effet de serre" },
  GRI_W:     { label: "GRI 306",             color: T.leaf,   desc: "Déchets" },
  GRI_OHS:   { label: "GRI 403",             color: T.amber,  desc: "Santé et sécurité au travail" },
  GRI_T:     { label: "GRI 404",             color: T.ochre,  desc: "Formation et éducation" },
  GRI_DE:    { label: "GRI 405",             color: T.slate,  desc: "Diversité et égalité des chances" },
  ESRS_E1:   { label: "ESRS E1",             color: T.fern,   desc: "Changement climatique (CSRD)" },
  ESRS_E5:   { label: "ESRS E5",             color: T.leaf,   desc: "Utilisation des ressources & économie circulaire" },
  ESRS_S1:   { label: "ESRS S1",             color: T.amber,  desc: "Main-d'œuvre (CSRD)" },
  ESRS_G1:   { label: "ESRS G1",             color: T.slate,  desc: "Conduite des affaires (CSRD)" },
  RE2020:    { label: "RE2020",              color: T.moss,   desc: "Réglementation Environnementale bâtiment" },
  AGEC:      { label: "Loi AGEC",            color: T.leaf,   desc: "Anti-Gaspillage Économie Circulaire" },
  SNBC:      { label: "SNBC",               color: T.fern,   desc: "Stratégie Nationale Bas-Carbone" },
  CT_L4121:  { label: "Code travail L4121",  color: T.rust,   desc: "Obligation sécurité de l'employeur" },
  CT_L6311:  { label: "Code travail L6311",  color: T.amber,  desc: "Droit individuel à la formation" },
  LME:       { label: "Loi LME",            color: T.flint,  desc: "Délais de paiement (60j max)" },
  SAPIN2:    { label: "Loi Sapin II",        color: T.slate,  desc: "Transparence & anti-corruption" },
  PEMD:      { label: "Décret PEMD",         color: T.leaf,   desc: "Produits Équipements Matières Déchets" },
  REP_PMCB:  { label: "REP PMCB",           color: T.fern,   desc: "Responsabilité Élargie Producteur BTP" },
};
