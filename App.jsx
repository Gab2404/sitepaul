import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Palette minérale & organique
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  soil:    "#1E1208",
  bark:    "#3D2010",
  clay:    "#7A4E2D",
  ochre:   "#B07030",
  sand:    "#D4A96A",
  straw:   "#E8D5A3",
  cream:   "#FAF7F0",
  fog:     "#F2EDE4",
  moss:    "#2E4A2A",
  fern:    "#4A7044",
  leaf:    "#6E9E62",
  sage:    "#9ABF8E",
  mist:    "#C4DDB8",
  slate:   "#3C4E56",
  flint:   "#5C7280",
  mineral: "#8FA8B2",
  sky:     "#B8D4DA",
  amber:   "#C47C20",
  rust:    "#9E3820",
  alert:   "#CC4422",
  gold:    "#C8A830",
  white:   "#FFFFFF",
  ink:     "#1A0E04",
};

const F = {
  display: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
  body:    "'Nunito', 'Segoe UI', Tahoma, sans-serif",
  mono:    "'IBM Plex Mono', 'Courier New', monospace",
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES (injected once)
// ═══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${T.cream}; color: ${T.ink}; font-family: ${F.body}; }

  /* ── Keyframes ───────────────────────────────────────────────────── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(110,158,98,0.35); }
    70%  { box-shadow: 0 0 0 14px rgba(110,158,98,0); }
    100% { box-shadow: 0 0 0 0 rgba(110,158,98,0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Stagger helpers ─────────────────────────────────────────────── */
  .stagger-item { opacity: 0; animation: fadeSlideUp 0.55s ease forwards; }
  .stagger-item:nth-child(1)  { animation-delay: 0.05s; }
  .stagger-item:nth-child(2)  { animation-delay: 0.13s; }
  .stagger-item:nth-child(3)  { animation-delay: 0.21s; }
  .stagger-item:nth-child(4)  { animation-delay: 0.29s; }
  .stagger-item:nth-child(5)  { animation-delay: 0.37s; }
  .stagger-item:nth-child(6)  { animation-delay: 0.45s; }
  .stagger-item:nth-child(7)  { animation-delay: 0.53s; }
  .stagger-item:nth-child(8)  { animation-delay: 0.61s; }

  /* ── Act transition wrappers ─────────────────────────────────────── */
  .act-enter { animation: scaleIn 0.5s cubic-bezier(.2,1.1,.4,1) forwards; }
  .act-enter-fast { animation: fadeSlideUp 0.38s ease forwards; }

  /* ── Interactive element bases ───────────────────────────────────── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, ${T.moss}, ${T.fern});
    color: ${T.white}; border: none; border-radius: 14px;
    padding: 14px 28px; font-family: ${F.body}; font-size: 15px; font-weight: 800;
    cursor: pointer; letter-spacing: 0.03em;
    box-shadow: 0 4px 18px rgba(46,74,42,0.30);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    position: relative; overflow: hidden;
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    pointer-events: none;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 30px rgba(46,74,42,0.40);
    filter: brightness(1.08);
  }
  .btn-primary:active { transform: translateY(0) scale(0.98); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    background: transparent; color: ${T.moss};
    border: 1.5px solid ${T.leaf}; border-radius: 12px;
    padding: 10px 20px; font-family: ${F.body}; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s ease;
  }
  .btn-ghost:hover {
    background: ${T.moss}; color: ${T.white};
    transform: translateY(-2px); box-shadow: 0 6px 18px rgba(46,74,42,0.22);
  }

  .btn-demo {
    display: inline-flex; align-items: center; gap: 6px;
    background: transparent; color: ${T.mineral};
    border: 1px dashed ${T.mineral}; border-radius: 10px;
    padding: 7px 14px; font-family: ${F.mono}; font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all 0.25s ease; opacity: 0.65;
  }
  .btn-demo:hover {
    opacity: 1; color: ${T.ochre}; border-color: ${T.ochre};
    background: ${T.ochre}12;
  }

  .btn-export {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, ${T.slate}, ${T.flint});
    color: ${T.white}; border: none; border-radius: 12px;
    padding: 11px 22px; font-family: ${F.body}; font-size: 13px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em;
    box-shadow: 0 4px 14px rgba(60,78,86,0.28);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .btn-export:hover {
    transform: translateY(-2px); box-shadow: 0 8px 22px rgba(60,78,86,0.38);
    filter: brightness(1.1);
  }

  /* ── Card hover ──────────────────────────────────────────────────── */
  .card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 14px 40px rgba(78,112,68,0.18) !important;
    border-color: ${T.leaf} !important;
  }

  /* ── Indic card hover ────────────────────────────────────────────── */
  .indic-card-hover {
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .indic-card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(110,158,98,0.18) !important;
  }

  /* ── Action card hover ───────────────────────────────────────────── */
  .action-card-hover {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .action-card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(46,74,42,0.15) !important;
    border-color: ${T.leaf} !important;
  }

  /* ── Choice option hover ─────────────────────────────────────────── */
  .choice-option {
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    cursor: pointer;
  }
  .choice-option:hover {
    transform: translateY(-2px);
    border-color: ${T.leaf} !important;
    box-shadow: 0 6px 20px rgba(110,158,98,0.15) !important;
  }

  /* ── Loading dots ────────────────────────────────────────────────── */
  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40%           { opacity: 1;   transform: scale(1.2); }
  }

  /* ── Scrollbar ───────────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.fog}; }
  ::-webkit-scrollbar-thumb { background: ${T.sage}; border-radius: 3px; }

  /* ═══════════════════════════════════════════════════════════════════
     PRINT STYLES
  ════════════════════════════════════════════════════════════════════ */
  @media print {
    body { background: white !important; }
    .no-print { display: none !important; }
    .print-section { break-inside: avoid; }
    .act-enter, .act-enter-fast, .stagger-item {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    * { box-shadow: none !important; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// RÉFÉRENTIELS NORMATIFS
// ═══════════════════════════════════════════════════════════════════════════════
const NORMES = {
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

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTIONS DIAGNOSTIQUES
// ═══════════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  {
    id: "nom", type: "text", section: "Profil",
    icone: "🏗️", titre: "Faisons connaissance",
    question: "Quel est le nom de votre entreprise ?",
    placeholder: "Ex : Entreprise Martin BTP",
    pourquoi: "Personnalise l'intégralité du tableau de bord.",
    normes: [], indicateur: "Identification du rapport RSE",
  },
  {
    id: "taille", type: "choix", section: "Profil",
    icone: "👥", titre: "Votre structure",
    question: "Combien de salariés compte votre entreprise ?",
    pourquoi: "La taille détermine vos obligations légales : CSE (>11), index F/H (>50), DPEF (>500), CSRD (progressive).",
    normes: ["ESRS_G1", "ISO26000"],
    indicateur: "Seuils réglementaires applicables",
    options: [
      { v: "micro", l: "< 10 salariés",   s: "Artisan / auto-entrepreneur",    e: "🔧" },
      { v: "tpe",   l: "10 – 49",          s: "TPE — seuil CSE à surveiller",   e: "🏠" },
      { v: "pme50", l: "50 – 249",         s: "PME — index F/H obligatoire",    e: "🏢" },
      { v: "pme250",l: "250 et plus",      s: "ETI — DPEF & CSRD en approche",  e: "🏭" },
    ],
  },
  {
    id: "activite", type: "multi", section: "Profil",
    icone: "⚒️", titre: "Votre cœur de métier",
    question: "Quelles activités exercez-vous principalement ?",
    pourquoi: "L'activité détermine votre empreinte carbone (Scopes 1/2/3), vos flux de déchets réglementés et les risques professionnels prioritaires.",
    normes: ["GRI_E", "GRI_W", "SNBC", "RE2020"],
    indicateur: "Facteurs d'émission Scope 1/2/3, flux déchets, risques métier",
    options: [
      { v: "gros_oeuvre",    l: "Gros œuvre",           e: "🧱" },
      { v: "second_oeuvre",  l: "Second œuvre",          e: "🪟" },
      { v: "genie_civil",    l: "Génie civil / TP",      e: "🛣️" },
      { v: "renovation",     l: "Rénovation / réhab",    e: "🔨" },
      { v: "demolition",     l: "Démolition",             e: "💥" },
      { v: "elec_cvc",       l: "Électricité / CVC",     e: "⚡" },
    ],
  },
  {
    id: "chantiers_nb", type: "choix", section: "Profil",
    icone: "📋", titre: "Volume d'activité",
    question: "Combien de chantiers actifs gérez-vous simultanément ?",
    pourquoi: "Volume = complexité de standardisation des pratiques HSE et de traçabilité des déchets.",
    normes: ["ISO26000", "GRI_W", "GRI_OHS"],
    indicateur: "Taux de conformité HSE multi-sites, kg déchets/m² agrégés",
    options: [
      { v: "1_3",   l: "1 à 3",     s: "Gestion directe possible",       e: "🎯" },
      { v: "4_10",  l: "4 à 10",    s: "Coordination nécessaire",        e: "📊" },
      { v: "11_30", l: "11 à 30",   s: "Standardisation indispensable",  e: "🔄" },
      { v: "30p",   l: "Plus de 30",s: "Système de management requis",   e: "🏗️" },
    ],
  },
  {
    id: "dechets_pratique", type: "choix", section: "Environnement",
    icone: "♻️", titre: "Gestion des déchets",
    question: "Comment gérez-vous actuellement vos déchets de chantier ?",
    pourquoi: "Obligation légale : tri à la source (7 flux depuis 2022, Loi AGEC). Diagnostic PEMD obligatoire avant démolition >1000m².",
    normes: ["GRI_W", "AGEC", "PEMD", "REP_PMCB", "ESRS_E5"],
    indicateur: "Taux valorisation déchets (%), kg déchets/m²",
    options: [
      { v: "aucun",      l: "Pas de tri organisé",     s: "Benne unique, pas de suivi",            e: "⚠️" },
      { v: "partiel",    l: "Tri partiel",              s: "Quelques flux séparés, sans tracé BSD", e: "📦" },
      { v: "7flux",      l: "Tri 7 flux + BSD",         s: "Conformité AGEC atteinte",              e: "✅" },
      { v: "optimise",   l: "Démarche optimisée",       s: "Diagnostic PEMD + filières valorisation", e: "🏆" },
    ],
  },
  {
    id: "carbone_bilan", type: "choix", section: "Environnement",
    icone: "🌡️", titre: "Empreinte carbone",
    question: "Avez-vous réalisé un bilan de vos émissions de gaz à effet de serre ?",
    pourquoi: "Le BTP représente ~25% des émissions françaises (SNBC). La CSRD rend le reporting Scope 1/2/3 progressivement obligatoire.",
    normes: ["GRI_E", "ESRS_E1", "SNBC", "RE2020"],
    indicateur: "tCO₂e/k€ CA, tCO₂e/m² construit (Scopes 1+2+3)",
    options: [
      { v: "jamais",     l: "Jamais réalisé",          s: "Pas d'estimation disponible",              e: "❓" },
      { v: "partiel",    l: "Estimation partielle",     s: "Scope 1 carburant seulement",              e: "📐" },
      { v: "complet",    l: "Bilan GES complet",        s: "Scopes 1+2+3, méthode ADEME",              e: "📊" },
      { v: "certifie",   l: "Bilan certifié + plan",    s: "Bilan Carbone® + objectifs de réduction",  e: "🌱" },
    ],
  },
  {
    id: "securite_niveau", type: "choix", section: "Social",
    icone: "🦺", titre: "Sécurité au travail",
    question: "Quel est votre niveau de maturité en santé-sécurité au travail ?",
    pourquoi: "Le BTP est le 2ème secteur le plus accidentogène. L'employeur a une obligation de résultat (Code du travail L.4121-1).",
    normes: ["CT_L4121", "GRI_OHS", "ESRS_S1", "ISO26000"],
    indicateur: "Taux de Fréquence (TF), Taux de Gravité (TG), conformité DUERP",
    options: [
      { v: "minimal",    l: "Obligations minimales",   s: "DUERP existant, peu mis à jour",           e: "📄" },
      { v: "actif",      l: "Prévention active",        s: "PPSPS systématique, causerie sécurité",    e: "🦺" },
      { v: "mase",       l: "Démarche MASE engagée",   s: "Manuel MASE en cours de déploiement",      e: "📋" },
      { v: "certifie",   l: "Certifié ISO 45001/MASE",s: "Système de management SST opérationnel",   e: "🏆" },
    ],
  },
  {
    id: "formation_rh", type: "choix", section: "Social",
    icone: "📚", titre: "Formation & compétences",
    question: "Comment pilotez-vous la formation de vos équipes ?",
    pourquoi: "Droit individuel à la formation (Code travail L.6311-1). GRI 404 mesure les heures de formation/ETP/an.",
    normes: ["CT_L6311", "GRI_T", "ESRS_S1"],
    indicateur: "Heures formation/salarié/an, taux d'alternance, budget formation (% MS)",
    options: [
      { v: "obligation",  l: "Formations obligatoires seules", s: "CACES, habilitations, SST uniquement",     e: "🔖" },
      { v: "plan",        l: "Plan de formation structuré",    s: "PDC annuel, CPF accompagné",               e: "📅" },
      { v: "proactif",    l: "Démarche proactive",             s: "CQP BTP, alternance, parcours carrière",   e: "🎓" },
      { v: "GPEC",        l: "GPEC & compétences stratégiques",s: "Gestion prévisionnelle, plan 3 ans",       e: "🌟" },
    ],
  },
  {
    id: "gouvernance_achats", type: "choix", section: "Gouvernance",
    icone: "🔗", titre: "Achats responsables",
    question: "Comment intégrez-vous la RSE dans vos achats et sous-traitance ?",
    pourquoi: "ISO 26000 §6.6 : loyauté des pratiques. La loi LME impose 60j de délai de paiement.",
    normes: ["ISO26000", "LME", "ESRS_G1"],
    indicateur: "Délai paiement fournisseurs (j), % sous-traitants évalués RSE",
    options: [
      { v: "prix_seul",   l: "Critère prix uniquement",     s: "Pas d'évaluation RSE fournisseurs",       e: "💰" },
      { v: "clause",      l: "Clauses contractuelles RSE",  s: "Charte ou annexe RSE dans les contrats",  e: "📃" },
      { v: "evaluation",  l: "Évaluation structurée",       s: "Grille RSE, EcoVadis ou QUALIBAT exigé",  e: "📊" },
      { v: "partenariat", l: "Partenariat RSE actif",       s: "Co-construction de progrès avec fournisseurs", e: "🤝" },
    ],
  },
  {
    id: "reporting_transparence", type: "choix", section: "Gouvernance",
    icone: "📊", titre: "Transparence & reporting",
    question: "Communiquez-vous sur votre performance RSE ?",
    pourquoi: "CSRD (2024-2028) étend progressivement l'obligation de reporting ESG. DPEF obligatoire >500 salariés.",
    normes: ["ESRS_G1", "ISO26000", "GRI_E"],
    indicateur: "Niveau CSRD-readiness, score GRI, indicateurs ESRS publiés",
    options: [
      { v: "aucun",       l: "Aucune communication RSE",   s: "Pas de rapport ni de section dédiée",        e: "🔇" },
      { v: "interne",     l: "Reporting interne uniquement",s: "Indicateurs suivis, non publiés",            e: "📁" },
      { v: "voluntaire",  l: "Rapport RSE volontaire",      s: "Publié sur site web ou pour appels d'offres", e: "📢" },
      { v: "certifie",    l: "Reporting certifié / CSRD",   s: "Selon GRI Standards ou normes ESRS",          e: "🏅" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOTEUR DE PERSONNALISATION — Logique normative
// ═══════════════════════════════════════════════════════════════════════════════
function computeProfile(r) {
  const act = r.activite || [];
  const hasDem = act.includes("demolition");
  const hasGC  = act.includes("genie_civil");
  const hasBig = act.includes("gros_oeuvre");

  const envRaw = {
    dechets:  { aucun:0, partiel:30, "7flux":70, optimise:95 }[r.dechets_pratique] || 40,
    carbone:  { jamais:5, partiel:30, complet:70, certifie:95 }[r.carbone_bilan] || 20,
  };
  const envScore = Math.round((envRaw.dechets * 0.55 + envRaw.carbone * 0.45));

  const socRaw = {
    securite: { minimal:15, actif:50, mase:75, certifie:95 }[r.securite_niveau] || 30,
    formation:{ obligation:20, plan:55, proactif:80, GPEC:95 }[r.formation_rh] || 35,
  };
  const socScore = Math.round((socRaw.securite * 0.6 + socRaw.formation * 0.4));

  const gouRaw = {
    achats:   { prix_seul:10, clause:40, evaluation:75, partenariat:95 }[r.gouvernance_achats] || 25,
    reporting:{ aucun:5, interne:35, voluntaire:65, certifie:95 }[r.reporting_transparence] || 20,
  };
  const gouScore = Math.round((gouRaw.achats * 0.5 + gouRaw.reporting * 0.5));

  const global = Math.round((envScore * 0.38 + socScore * 0.38 + gouScore * 0.24));

  const tauxValo = { aucun:28, partiel:52, "7flux":72, optimise:88 }[r.dechets_pratique] || 40;
  const kgM2 = hasDem ? 38 : hasGC ? 28 : hasBig ? 24 : 18;
  const tf   = { minimal:38, actif:22, mase:14, certifie:8 }[r.securite_niveau] || 30;
  const tg   = { minimal:2.8, actif:1.8, mase:1.2, certifie:0.7 }[r.securite_niveau] || 2.2;
  const hForm = { obligation:12, plan:24, proactif:38, GPEC:52 }[r.formation_rh] || 18;
  const delaiPay = { prix_seul:55, clause:48, evaluation:42, partenariat:35 }[r.gouvernance_achats] || 50;
  const pctST = { prix_seul:5, clause:25, evaluation:60, partenariat:85 }[r.gouvernance_achats] || 15;
  const co2 = hasBig || hasGC ? 42 : hasDem ? 38 : 28;

  const alertes = [];
  if (r.dechets_pratique === "aucun" || r.dechets_pratique === "partiel")
    alertes.push({ urgence:"critique", msg:"Tri 7 flux obligatoire (Loi AGEC 2022) — non-conformité exposant à des sanctions", normes:["AGEC","REP_PMCB"], pilier:"Environnement" });
  if (hasDem && r.dechets_pratique !== "optimise")
    alertes.push({ urgence:"critique", msg:"Diagnostic PEMD obligatoire avant démolition >1000m² — Décret PEMD 2022", normes:["PEMD"], pilier:"Environnement" });
  if (r.carbone_bilan === "jamais" || r.carbone_bilan === "partiel")
    alertes.push({ urgence:"importante", msg:"Loi Industrie Verte 2023 : offres bas-carbone favorisées dans la commande publique", normes:["SNBC","ESRS_E1"], pilier:"Environnement" });
  if ((r.taille === "pme250") && r.reporting_transparence !== "certifie")
    alertes.push({ urgence:"critique", msg:"CSRD 2026 : reporting ESRS obligatoire pour votre taille — anticipation urgente", normes:["ESRS_G1","ESRS_E1"], pilier:"Gouvernance" });
  if ((r.taille === "pme50" || r.taille === "pme250") && r.securite_niveau === "minimal")
    alertes.push({ urgence:"importante", msg:"Index égalité F/H à publier avant le 1er mars — Code travail L.1142-8", normes:["ESRS_S1","GRI_DE"], pilier:"Social" });
  if (r.gouvernance_achats === "prix_seul")
    alertes.push({ urgence:"importante", msg:"Délai paiement fournisseurs : vérifier conformité LME (60j max)", normes:["LME"], pilier:"Gouvernance" });
  if (r.securite_niveau === "minimal")
    alertes.push({ urgence:"critique", msg:"DUERP doit être mis à jour annuellement — obligation Code du travail L.4121-3", normes:["CT_L4121"], pilier:"Social" });
  alertes.push({ urgence:"info", msg:"REP PMCB : raccordement obligatoire à une filière agréée sur votre territoire", normes:["REP_PMCB","AGEC"], pilier:"Environnement" });

  const actions = [];
  if (r.securite_niveau === "minimal" || r.securite_niveau === "actif")
    actions.push({ label:"Mettre à jour le DUERP et formaliser les PPSPS chantier", urgence:"haute", statut:"a_lancer", pilier:"Social", norme:"CT_L4121", ref:"Code travail L.4121-3", impact:"Réduction TF estimée : -30% sur 2 ans" });
  if (r.dechets_pratique === "aucun" || r.dechets_pratique === "partiel")
    actions.push({ label:"Déployer le tri 7 flux et les BSD sur tous les chantiers", urgence:"haute", statut:"a_lancer", pilier:"Environnement", norme:"AGEC", ref:"Loi AGEC + REP PMCB", impact:"Conformité légale + économie sur les coûts d'élimination" });
  if (r.carbone_bilan === "jamais" || r.carbone_bilan === "partiel")
    actions.push({ label:"Réaliser un Bilan GES complet (outil SEVE FFB ou ADEME)", urgence:"haute", statut:"a_lancer", pilier:"Environnement", norme:"GRI_E", ref:"GRI 305 + SNBC", impact:"Accès aux marchés publics bas-carbone (Loi Industrie Verte)" });
  if (r.gouvernance_achats === "prix_seul" || r.gouvernance_achats === "clause")
    actions.push({ label:"Déployer une grille d'évaluation RSE fournisseurs", urgence:"moyenne", statut:"a_lancer", pilier:"Gouvernance", norme:"ISO26000", ref:"ISO 26000 §6.6", impact:"Conformité LME + attractivité grands donneurs d'ordre" });
  if (r.reporting_transparence === "aucun" || r.reporting_transparence === "interne")
    actions.push({ label:"Initier un rapport RSE simplifié (modèle FFB ou GRI SME)", urgence:"moyenne", statut:"planifie", pilier:"Gouvernance", norme:"ESRS_G1", ref:"ISO 26000 §7 + GRI", impact:"Anticipation CSRD + différenciation appels d'offres" });
  if (r.formation_rh === "obligation" || r.formation_rh === "plan")
    actions.push({ label:"Structurer un plan de développement des compétences (PDC)", urgence:"moyenne", statut:"planifie", pilier:"Social", norme:"GRI_T", ref:"Code travail L.6311-1 + GRI 404", impact:"Réduction turnover estimée : -20% sur 18 mois" });
  if (r.securite_niveau !== "certifie")
    actions.push({ label:"Engager la démarche MASE avec l'OPPBTP", urgence:"moyenne", statut:"planifie", pilier:"Social", norme:"GRI_OHS", ref:"GRI 403 + ISO 45001", impact:"Exigé par 80% des grands donneurs d'ordre BTP" });
  if (r.taille === "pme250")
    actions.push({ label:"Cartographier les données ESG disponibles pour la CSRD", urgence:"haute", statut:"a_lancer", pilier:"Gouvernance", norme:"ESRS_G1", ref:"Directive CSRD + normes ESRS", impact:"Obligation légale dès 2026 pour votre taille" });

  return {
    nom: r.nom || "Votre Entreprise",
    taille: r.taille, activite: act,
    envScore, socScore, gouScore, global,
    raw: { envRaw, socRaw, gouRaw },
    indicateurs: { tauxValo, kgM2, tf, tg, hForm, delaiPay, pctST, co2 },
    alertes: alertes.slice(0, 5),
    actions: actions.slice(0, 7),
    hasDemo: hasDem, hasGC, hasBig,
  };
}

// DEMO preset
const DEMO_PRESET = {
  nom: "Entreprise Dupont BTP",
  taille: "pme50",
  activite: ["gros_oeuvre", "second_oeuvre", "renovation"],
  chantiers_nb: "4_10",
  dechets_pratique: "partiel",
  carbone_bilan: "partiel",
  securite_niveau: "actif",
  formation_rh: "plan",
  gouvernance_achats: "clause",
  reporting_transparence: "interne",
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS VISUELS
// ═══════════════════════════════════════════════════════════════════════════════

function StyleInjector() {
  useEffect(() => {
    const id = "rse-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

function NormeBadge({ id, small = false }) {
  const n = NORMES[id];
  if (!n) return null;
  return (
    <span title={n.desc} style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:`${n.color}18`, color:n.color,
      border:`1px solid ${n.color}40`,
      borderRadius:20, padding: small ? "2px 7px" : "3px 10px",
      fontSize: small ? 10 : 11, fontFamily:F.mono, fontWeight:600,
      letterSpacing:"0.02em", cursor:"default", whiteSpace:"nowrap",
    }}>{n.label}</span>
  );
}

function Card({ children, style={}, onClick, className="" }) {
  return (
    <div
      onClick={onClick}
      className={`card-hover ${className}`}
      style={{
        background:T.white, borderRadius:20,
        border:`1.5px solid ${T.straw}`,
        boxShadow:`0 2px 14px rgba(30,18,8,0.07)`,
        cursor:onClick?"pointer":"default",
        ...style
      }}
    >{children}</div>
  );
}

function ScoreArc({ score, size=120, label="" }) {
  const [a, setA] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setA(score),500); return()=>clearTimeout(t); },[score]);
  const R=46, cx=60, cy=65, circ=Math.PI*R;
  const off = circ - (a/100)*circ;
  const col = score>=70?T.fern:score>=50?T.amber:T.rust;
  const startX=cx-R, endX=cx+R;
  return (
    <svg width={size} height={size*0.65} viewBox="0 0 120 80"
      style={{filter:"drop-shadow(0 4px 12px rgba(46,74,42,0.18))"}}>
      <defs>
        <filter id="arc-glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d={`M ${startX} ${cy} A ${R} ${R} 0 0 1 ${endX} ${cy}`}
        fill="none" stroke={T.fog} strokeWidth={10} strokeLinecap="round"/>
      <path d={`M ${startX} ${cy} A ${R} ${R} 0 0 1 ${endX} ${cy}`}
        fill="none" stroke={col} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={off}
        filter="url(#arc-glow)"
        style={{transition:"stroke-dashoffset 1.6s cubic-bezier(.2,1.2,.4,1)"}}/>
      <text x={cx} y={cy-8} textAnchor="middle" fill={T.ink}
        fontSize={24} fontWeight={800} fontFamily={F.display}>{score}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill={T.clay}
        fontSize={9} fontFamily={F.body}>{label||"/100"}</text>
    </svg>
  );
}

function RadarChart({ env, soc, gou, size=220 }) {
  const [a, setA] = useState({env:0,soc:0,gou:0});
  const [tooltip, setTooltip] = useState(null);
  useEffect(()=>{ const t=setTimeout(()=>setA({env,soc,gou}),600); return()=>clearTimeout(t); },[env,soc,gou]);

  const cx=110, cy=115, r=80;
  const pts = [
    { label:"Environnement", angle:-90, val:a.env, fullVal:env, col:T.fern },
    { label:"Social",        angle:30,  val:a.soc, fullVal:soc, col:T.amber },
    { label:"Gouvernance",   angle:150, val:a.gou, fullVal:gou, col:T.slate },
  ];
  const pt = (angle, radius, v=1) => {
    const rad=(angle*Math.PI)/180;
    return { x: cx+radius*(v/100)*Math.cos(rad), y: cy+radius*(v/100)*Math.sin(rad) };
  };
  const ptRaw = (angle, radius) => ({ x: cx+radius*Math.cos((angle*Math.PI)/180), y: cy+radius*Math.sin((angle*Math.PI)/180) });
  const gridLevels=[25,50,75,100];
  const polyPoints = pts.map(p=>{ const pp=pt(p.angle,r,p.val); return `${pp.x},${pp.y}`; }).join(" ");

  return (
    <svg width={size} height={size} viewBox="0 0 220 220"
      style={{filter:"drop-shadow(0 4px 16px rgba(30,18,8,0.10))"}}>
      <defs>
        <filter id="radar-point-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {gridLevels.map(lvl=>{
        const gpts=pts.map(p=>{ const pp=ptRaw(p.angle,r*lvl/100); return`${pp.x},${pp.y}`; }).join(" ");
        return <polygon key={lvl} points={gpts} fill="none" stroke={T.straw} strokeWidth={lvl===100?1.5:0.8} strokeDasharray={lvl<100?"4,3":""}/>;
      })}
      {pts.map((p,i)=>{ const ep=ptRaw(p.angle,r); return <line key={i} x1={cx} y1={cy} x2={ep.x} y2={ep.y} stroke={T.straw} strokeWidth={1}/> })}
      <polygon points={polyPoints} fill={`${T.fern}28`} stroke={T.fern} strokeWidth={2.5}
        style={{transition:"all 1.6s ease"}}/>
      {pts.map((p,i)=>{
        const pp=pt(p.angle,r,p.val);
        const lp=ptRaw(p.angle,r+26);
        const col=p.fullVal>=70?T.moss:p.fullVal>=50?T.amber:T.rust;
        const isHov=tooltip===i;
        return(
          <g key={i} style={{cursor:"pointer"}}
            onMouseEnter={()=>setTooltip(i)}
            onMouseLeave={()=>setTooltip(null)}>
            <circle cx={pp.x} cy={pp.y} r={isHov?9:5}
              fill={col} stroke={T.white} strokeWidth={2}
              filter={isHov?"url(#radar-point-glow)":undefined}
              style={{transition:"all 0.2s ease"}}/>
            {isHov && (
              <g>
                <rect x={pp.x-28} y={pp.y-30} width={56} height={22} rx={6}
                  fill={T.ink} opacity={0.88}/>
                <text x={pp.x} y={pp.y-15} textAnchor="middle" fill={T.white}
                  fontSize={11} fontFamily={F.display} fontWeight={800}>{p.fullVal}/100</text>
              </g>
            )}
            <text x={lp.x} y={lp.y} textAnchor="middle" fill={T.ink}
              fontSize={9} fontFamily={F.body} fontWeight={600}>{p.label}</text>
            <text x={lp.x} y={lp.y+11} textAnchor="middle" fill={col}
              fontSize={10} fontFamily={F.display} fontWeight={800}>{p.fullVal}</text>
          </g>
        );
      })}
    </svg>
  );
}

function MiniProgress({ val, cible, color=T.fern }) {
  const max=Math.max(val,cible)*1.5;
  const vp=Math.min((val/max)*100,100), cp=Math.min((cible/max)*100,100);
  const ok=val<=cible;
  return(
    <div style={{height:8,background:T.fog,borderRadius:4,position:"relative",marginTop:8}}>
      <div style={{position:"absolute",height:"100%",left:0,width:`${vp}%`,
        background:ok?`linear-gradient(90deg,${T.moss},${T.leaf})`:`linear-gradient(90deg,${T.rust},${T.amber})`,
        borderRadius:4,transition:"width 1.4s ease"}}/>
      <div style={{position:"absolute",top:-3,left:`${cp}%`,width:2,height:14,
        background:T.ochre,borderRadius:2,opacity:0.8}}/>
    </div>
  );
}

function StatutTag({ s }) {
  const cfg={
    a_lancer:  {bg:"#FDECEA",c:T.rust,  l:"À lancer"},
    planifie:  {bg:"#FFF8EC",c:T.amber, l:"Planifié"},
    en_cours:  {bg:"#EEF4FF",c:T.slate, l:"En cours"},
    fait:      {bg:"#EEF7EC",c:T.moss,  l:"Réalisé"},
  };
  const x=cfg[s]||cfg.planifie;
  return(
    <span style={{background:x.bg,color:x.c,borderRadius:20,padding:"3px 10px",
      fontSize:11,fontFamily:F.body,fontWeight:700}}>{x.l}</span>
  );
}

function Trend({ t }) {
  return t==="up"?<span style={{color:T.fern,fontSize:13,fontWeight:700}}>↗</span>
       :t==="down"?<span style={{color:T.rust,fontSize:13,fontWeight:700}}>↘</span>
       :<span style={{color:T.clay,fontSize:12}}>→</span>;
}

function IndicCard({ title, value, unit, cible, trend, norme, normeRef, why, action, pilier }) {
  const [open, setOpen] = useState(false);
  const ok = value <= cible;
  const pilCol = {Environnement:T.fern,Social:T.amber,Gouvernance:T.slate}[pilier]||T.clay;
  return (
    <div className="indic-card-hover" style={{
      background:T.white, borderRadius:18,
      border:`1.5px solid ${open?T.leaf:T.straw}`,
      boxShadow:open?`0 6px 24px rgba(78,112,68,0.15)`:`0 2px 10px rgba(30,18,8,0.05)`,
      overflow:"hidden",
    }}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"18px 20px",cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{fontSize:11,color:pilCol,fontFamily:F.body,fontWeight:700,
            textTransform:"uppercase",letterSpacing:"0.1em"}}>{pilier}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Trend t={trend}/>
            <span style={{fontSize:11,color:T.mineral,fontFamily:F.mono}}>
              {open?"▲ Fermer":"▼ Détail norme"}
            </span>
          </div>
        </div>
        <div style={{fontFamily:F.body,fontSize:13,color:T.clay,marginBottom:6}}>{title}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          <span style={{fontFamily:F.display,fontSize:28,fontWeight:800,
            color:ok?T.moss:T.rust}}>{value}</span>
          <span style={{fontSize:12,color:T.mineral}}>{unit}</span>
        </div>
        <MiniProgress val={value} cible={cible}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:T.mineral,fontFamily:F.body}}>
          <span>Actuel</span><span>Cible : {cible}{unit}</span>
        </div>
      </div>
      {open && (
        <div style={{borderTop:`1px solid ${T.fog}`,padding:"16px 20px",background:T.cream,
          animation:"fadeSlideUp 0.3s ease forwards"}}>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:T.clay,fontFamily:F.body,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.1em"}}>
              Référentiel normatif
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {normeRef.map(id=><NormeBadge key={id} id={id}/>)}
            </div>
          </div>
          <div style={{background:"#EEF7EC",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
            <div style={{fontSize:11,color:T.moss,fontFamily:F.body,fontWeight:700,marginBottom:4}}>🎯 Critère RSE associé</div>
            <div style={{fontSize:12,color:T.ink,fontFamily:F.body,lineHeight:1.6}}>{why}</div>
          </div>
          <div style={{background:"#FFF8EC",borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:11,color:T.amber,fontFamily:F.body,fontWeight:700,marginBottom:4}}>→ Recommandation concrète</div>
            <div style={{fontSize:12,color:T.ink,fontFamily:F.body,lineHeight:1.6}}>{action}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 1 — ACCUEIL
// ═══════════════════════════════════════════════════════════════════════════════
function ActeAccueil({ onStart }) {
  return (
    <div className="act-enter" style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg, ${T.soil} 0%, ${T.bark} 40%, ${T.moss} 100%)`,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"40px 20px", position:"relative", overflow:"hidden",
    }}>
      {/* Background texture */}
      <div style={{
        position:"absolute", inset:0, opacity:0.04,
        backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)`,
        pointerEvents:"none",
      }}/>

      {/* Orbs */}
      <div style={{
        position:"absolute", top:-100, right:-100, width:400, height:400,
        borderRadius:"50%", background:`radial-gradient(circle, ${T.moss}30 0%, transparent 70%)`,
        pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", bottom:-80, left:-80, width:300, height:300,
        borderRadius:"50%", background:`radial-gradient(circle, ${T.ochre}20 0%, transparent 70%)`,
        pointerEvents:"none",
      }}/>

      <div style={{maxWidth:680, width:"100%", textAlign:"center", position:"relative", zIndex:1}}>

        {/* Logo pill */}
        <div className="stagger-item" style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:`rgba(255,255,255,0.08)`, backdropFilter:"blur(10px)",
          border:`1px solid rgba(255,255,255,0.15)`, borderRadius:44,
          padding:"8px 20px", marginBottom:32,
        }}>
          <span style={{fontSize:18}}>🌿</span>
          <span style={{fontFamily:F.mono, fontSize:12, color:`${T.mist}CC`, letterSpacing:"0.15em", textTransform:"uppercase"}}>
            Plateforme RSE BTP — 2025
          </span>
        </div>

        {/* Headline */}
        <h1 className="stagger-item" style={{
          fontFamily:F.display, fontSize:"clamp(32px,6vw,58px)", fontWeight:700,
          color:T.cream, lineHeight:1.18, marginBottom:20,
          textShadow:"0 4px 24px rgba(0,0,0,0.3)",
        }}>
          Pilotez votre performance<br/>
          <em style={{color:T.sand}}>RSE</em> en 5 minutes
        </h1>

        <p className="stagger-item" style={{
          fontFamily:F.body, fontSize:17, color:`${T.straw}CC`,
          lineHeight:1.7, marginBottom:12, maxWidth:520, margin:"0 auto 12px",
        }}>
          Diagnostic normatif complet : ISO 26000, GRI, ESRS/CSRD, Code du travail.<br/>
          Conçu pour les PME du BTP.
        </p>

        {/* Badges normes */}
        <div className="stagger-item" style={{
          display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center",
          marginBottom:44, marginTop:20,
        }}>
          {["ISO 26000","GRI 305","ESRS E1","RE2020","Loi AGEC","CSRD"].map(l=>(
            <span key={l} style={{
              background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.18)",
              color:`${T.mist}DD`, borderRadius:20, padding:"4px 12px",
              fontSize:11, fontFamily:F.mono, fontWeight:600, letterSpacing:"0.05em",
            }}>{l}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="stagger-item">
          <button className="btn-primary" onClick={onStart}
            style={{fontSize:17, padding:"16px 44px", animation:"pulse-ring 2.5s infinite 1.5s"}}>
            <span>Démarrer le diagnostic</span>
            <span style={{fontSize:20}}>→</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="stagger-item" style={{
          display:"flex", gap:32, justifyContent:"center", marginTop:48,
          flexWrap:"wrap",
        }}>
          {[
            {v:"10",l:"questions clés"},
            {v:"19",l:"référentiels normatifs"},
            {v:"3",l:"piliers RSE analysés"},
          ].map(x=>(
            <div key={x.l} style={{textAlign:"center"}}>
              <div style={{fontFamily:F.display,fontSize:28,fontWeight:800,color:T.sand}}>{x.v}</div>
              <div style={{fontFamily:F.body,fontSize:12,color:`${T.mist}99`,marginTop:2}}>{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 2 — DIAGNOSTIC
// ═══════════════════════════════════════════════════════════════════════════════
function ActeDiagnostic({ onComplete }) {
  const [step, setStep] = useState(0);
  const [reps, setReps] = useState({});
  const [entering, setEntering] = useState(true);
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((step / total) * 100);

  useEffect(()=>{ setEntering(true); const t=setTimeout(()=>setEntering(false),50); return()=>clearTimeout(t); },[step]);

  const handleDemoFill = () => {
    setReps(DEMO_PRESET);
    // Jump straight to last question then submit
    onComplete(DEMO_PRESET);
  };

  const setVal = (id, v) => setReps(r=>({...r,[id]:v}));

  const toggleMulti = (id, v) => {
    setReps(r=>{
      const cur=r[id]||[];
      return {...r,[id]:cur.includes(v)?cur.filter(x=>x!==v):[...cur,v]};
    });
  };

  const canNext = () => {
    if (q.type==="text") return (reps[q.id]||"").trim().length>0;
    if (q.type==="choix") return !!reps[q.id];
    if (q.type==="multi") return (reps[q.id]||[]).length>0;
    return false;
  };

  const next = () => {
    if (!canNext()) return;
    if (step<total-1) { setStep(s=>s+1); }
    else { onComplete(reps); }
  };

  const sections = [...new Set(QUESTIONS.map(q=>q.section))];
  const sectionColors={Profil:T.moss,Environnement:T.fern,Social:T.amber,Gouvernance:T.slate};

  return (
    <div style={{
      minHeight:"100vh", background:T.fog,
      display:"flex", flexDirection:"column",
    }}>
      {/* Top bar */}
      <div className="no-print" style={{
        background:T.white, borderBottom:`1px solid ${T.straw}`,
        padding:"16px 32px", display:"flex", alignItems:"center", gap:20, position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{fontFamily:F.display,fontSize:16,fontWeight:700,color:T.moss}}>
          🌿 RSE Pilotage BTP
        </div>
        <div style={{flex:1,height:6,background:T.straw,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,
            background:`linear-gradient(90deg,${T.moss},${T.leaf})`,
            borderRadius:3,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/>
        </div>
        <div style={{fontFamily:F.mono,fontSize:12,color:T.mineral,whiteSpace:"nowrap"}}>
          {step+1} / {total}
        </div>
        {/* Demo button — first question only */}
        {step === 0 && (
          <button className="btn-demo no-print" onClick={handleDemoFill}>
            ⚡ Remplissage rapide (Démo)
          </button>
        )}
      </div>

      {/* Section tabs */}
      <div style={{background:T.white,borderBottom:`1px solid ${T.straw}`,
        padding:"10px 32px",display:"flex",gap:6}}>
        {sections.map(s=>{
          const qsInSection=QUESTIONS.filter(q=>q.section===s);
          const firstIdx=QUESTIONS.findIndex(q=>q.section===s);
          const isActive=q.section===s;
          const isDone=QUESTIONS.findIndex(q=>q.section===q.section&&q.id===QUESTIONS[step].id)>=firstIdx+qsInSection.length;
          return(
            <div key={s} style={{
              padding:"6px 14px",borderRadius:20,
              background:isActive?sectionColors[s]:`${sectionColors[s]}12`,
              color:isActive?T.white:sectionColors[s],
              border:`1px solid ${isActive?sectionColors[s]:`${sectionColors[s]}30`}`,
              fontFamily:F.body,fontSize:12,fontWeight:700,
              transition:"all 0.3s ease",
            }}>{s}</div>
          );
        })}
      </div>

      {/* Question area */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
        <div key={step} className="act-enter" style={{maxWidth:680,width:"100%"}}>
          {/* Question card */}
          <div style={{
            background:T.white,borderRadius:24,
            border:`1.5px solid ${T.straw}`,
            boxShadow:"0 4px 32px rgba(30,18,8,0.08)",
            padding:"40px",marginBottom:16,
          }}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
              <div style={{
                width:56,height:56,borderRadius:16,
                background:`linear-gradient(135deg,${T.moss}15,${T.fern}25)`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
                border:`1px solid ${T.mist}`,
              }}>{q.icone}</div>
              <div>
                <div style={{fontSize:11,color:T.mineral,fontFamily:F.mono,
                  textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>
                  {q.section} — Q{step+1}
                </div>
                <h2 style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:T.ink,margin:0}}>
                  {q.titre}
                </h2>
              </div>
            </div>

            <p style={{fontFamily:F.body,fontSize:16,color:T.bark,lineHeight:1.65,marginBottom:28}}>
              {q.question}
            </p>

            {/* Text input */}
            {q.type==="text" && (
              <input
                autoFocus
                value={reps[q.id]||""}
                onChange={e=>setVal(q.id,e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&canNext()&&next()}
                placeholder={q.placeholder}
                style={{
                  width:"100%",padding:"14px 18px",
                  fontFamily:F.body,fontSize:15,color:T.ink,
                  border:`2px solid ${reps[q.id]?T.leaf:T.straw}`,borderRadius:14,
                  outline:"none",background:T.cream,
                  transition:"border-color 0.2s ease",
                  boxSizing:"border-box",
                }}
              />
            )}

            {/* Single choice */}
            {q.type==="choix" && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {q.options.map(opt=>{
                  const sel=reps[q.id]===opt.v;
                  return(
                    <div key={opt.v} className="choice-option"
                      onClick={()=>setVal(q.id,opt.v)}
                      style={{
                        padding:"16px 18px",borderRadius:14,
                        border:`2px solid ${sel?T.moss:T.straw}`,
                        background:sel?`linear-gradient(135deg,${T.moss}10,${T.fern}15)`:T.cream,
                      }}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:20}}>{opt.e}</span>
                        <div>
                          <div style={{fontFamily:F.body,fontSize:14,fontWeight:700,
                            color:sel?T.moss:T.ink}}>{opt.l}</div>
                          {opt.s && <div style={{fontFamily:F.body,fontSize:11,color:T.mineral,marginTop:2}}>{opt.s}</div>}
                        </div>
                        {sel && <div style={{marginLeft:"auto",width:18,height:18,borderRadius:"50%",
                          background:T.moss,display:"flex",alignItems:"center",justifyContent:"center",
                          color:T.white,fontSize:11,fontWeight:800,flexShrink:0}}>✓</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Multi choice */}
            {q.type==="multi" && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {q.options.map(opt=>{
                  const sel=(reps[q.id]||[]).includes(opt.v);
                  return(
                    <div key={opt.v} className="choice-option"
                      onClick={()=>toggleMulti(q.id,opt.v)}
                      style={{
                        padding:"14px 16px",borderRadius:14,textAlign:"center",
                        border:`2px solid ${sel?T.moss:T.straw}`,
                        background:sel?`linear-gradient(135deg,${T.moss}12,${T.fern}18)`:T.cream,
                      }}>
                      <div style={{fontSize:24,marginBottom:6}}>{opt.e}</div>
                      <div style={{fontFamily:F.body,fontSize:12,fontWeight:700,
                        color:sel?T.moss:T.ink}}>{opt.l}</div>
                      {sel && <div style={{marginTop:6,fontSize:10,color:T.fern,fontWeight:700}}>✓ Sélectionné</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pourquoi */}
            {q.pourquoi && (
              <div style={{
                marginTop:20,padding:"12px 16px",
                background:`${T.moss}08`,border:`1px solid ${T.mist}`,
                borderRadius:12,
              }}>
                <div style={{fontSize:11,color:T.fern,fontFamily:F.body,fontWeight:700,marginBottom:4}}>
                  💡 Pourquoi cette question ?
                </div>
                <div style={{fontSize:12,color:T.clay,fontFamily:F.body,lineHeight:1.6}}>{q.pourquoi}</div>
                {q.normes.length>0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
                    {q.normes.map(n=><NormeBadge key={n} id={n} small/>)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {step>0 ? (
              <button className="btn-ghost" onClick={()=>setStep(s=>s-1)}>
                ← Précédent
              </button>
            ) : <div/>}
            <button className="btn-primary" onClick={next}
              style={{opacity:canNext()?1:0.45,cursor:canNext()?"pointer":"not-allowed"}}>
              {step<total-1 ? <>Suivant <span>→</span></> : <>Générer le dashboard <span>🚀</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingScreen() {
  const steps = [
    "Calcul des scores RSE…",
    "Analyse des référentiels normatifs…",
    "Génération des recommandations…",
    "Construction du tableau de bord…",
  ];
  const [current, setCurrent] = useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setCurrent(c=>(c+1)%steps.length),600);
    return()=>clearInterval(iv);
  },[]);

  return (
    <div className="act-enter" style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg,${T.soil},${T.bark} 60%,${T.moss})`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      gap:32,
    }}>
      {/* Spinner */}
      <div style={{position:"relative",width:80,height:80}}>
        <div style={{
          width:80,height:80,borderRadius:"50%",
          border:`4px solid ${T.moss}40`,
          borderTopColor:T.leaf,
          animation:"spin 0.9s linear infinite",
        }}/>
        <span style={{
          position:"absolute",top:"50%",left:"50%",
          transform:"translate(-50%,-50%)",fontSize:28,
        }}>🌿</span>
      </div>

      {/* Loading text */}
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:F.display,fontSize:22,color:T.cream,marginBottom:12}}>
          Analyse en cours
        </div>
        <div key={current} className="act-enter-fast" style={{
          fontFamily:F.mono,fontSize:13,color:`${T.mist}99`,letterSpacing:"0.05em",
        }}>{steps[current]}</div>
      </div>

      {/* Dots */}
      <div style={{display:"flex",gap:10}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:10,height:10,borderRadius:"50%",background:T.leaf,
            animation:`dotPulse 1.2s ease ${i*0.2}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TABS
// ═══════════════════════════════════════════════════════════════════════════════

function TabStrategique({ db }) {
  const yr = [
    {y:"2023",e:Math.max(db.envScore-18,10),s:Math.max(db.socScore-15,10),g:Math.max(db.gouScore-20,10)},
    {y:"2024",e:Math.max(db.envScore-8,15), s:Math.max(db.socScore-7,15), g:Math.max(db.gouScore-10,15)},
    {y:"2025",e:db.envScore,s:db.socScore,g:db.gouScore},
    {y:"2026 ▸",e:Math.min(db.envScore+12,100),s:Math.min(db.socScore+10,100),g:Math.min(db.gouScore+15,100)},
  ];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:24,marginBottom:24}}>
        <Card className="stagger-item print-section" style={{padding:28}}>
          <div style={{fontSize:11,color:T.fern,fontFamily:F.body,fontWeight:700,
            textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>
            📡 Score RSE Global — Exercice 2025
          </div>
          <div style={{display:"flex",alignItems:"center",gap:32}}>
            <div style={{textAlign:"center"}}>
              <ScoreArc score={db.global} size={160} label="Score global"/>
              <div style={{fontFamily:F.body,fontSize:12,color:T.clay,marginTop:4}}>
                {db.global>=70?"✅ Niveau engagé":db.global>=50?"🟡 En progression":"🔴 Démarrage"}
              </div>
            </div>
            <div style={{flex:1}}>
              {[{l:"Environnement",v:db.envScore,e:"🌿"},{l:"Social & RH",v:db.socScore,e:"👷"},{l:"Gouvernance",v:db.gouScore,e:"🏛️"}].map(x=>(
                <div key={x.l} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontFamily:F.body,fontSize:13,color:T.ink}}>{x.e} {x.l}</span>
                    <span style={{fontFamily:F.display,fontSize:14,fontWeight:800,
                      color:x.v>=70?T.moss:x.v>=50?T.amber:T.rust}}>{x.v}/100</span>
                  </div>
                  <div style={{height:8,background:T.fog,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${x.v}%`,borderRadius:4,
                      background:x.v>=70?`linear-gradient(90deg,${T.moss},${T.leaf})`:x.v>=50?`linear-gradient(90deg,${T.clay},${T.sand})`:`linear-gradient(90deg,${T.rust},${T.amber})`,
                      transition:"width 1.6s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="stagger-item print-section" style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{fontSize:11,color:T.slate,fontFamily:F.body,fontWeight:700,
            textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8,alignSelf:"flex-start"}}>
            🧭 Radar des piliers
          </div>
          <RadarChart env={db.envScore} soc={db.socScore} gou={db.gouScore} size={200}/>
        </Card>
      </div>

      {/* Évolution temporelle */}
      <Card className="stagger-item print-section" style={{padding:28,marginBottom:24}}>
        <div style={{fontSize:11,color:T.slate,fontFamily:F.body,fontWeight:700,
          textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:20}}>
          📈 Trajectoire RSE — Réel & Projection
        </div>
        <div style={{display:"flex",gap:0,alignItems:"flex-end",height:120}}>
          {yr.map((y,i)=>{
            const isFut=y.y.includes("▸");
            const avg=Math.round((y.e+y.s+y.g)/3);
            return(
              <div key={y.y} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:11,color:T.clay,fontFamily:F.mono}}>{avg}</div>
                <div style={{width:"60%",
                  background:isFut?`repeating-linear-gradient(45deg,${T.leaf}40,${T.leaf}40 4px,transparent 4px,transparent 8px)`
                    :`linear-gradient(180deg,${T.fern},${T.leaf})`,
                  height:`${(avg/100)*100}px`,borderRadius:"6px 6px 0 0",
                  border:isFut?`2px dashed ${T.leaf}`:"none",transition:`height ${1.0+i*0.15}s ease`}}/>
                <div style={{fontSize:11,color:isFut?T.leaf:T.ink,fontFamily:F.body,fontWeight:isFut?700:400}}>{y.y}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,fontSize:11,color:T.mineral,fontFamily:F.body}}>
          ▸ Projection 2026 basée sur la mise en œuvre du plan d'action recommandé
        </div>
      </Card>

      {/* Alertes */}
      <div>
        <div style={{fontSize:11,color:T.clay,fontFamily:F.body,fontWeight:700,
          textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>
          ⚡ Alertes stratégiques actives
        </div>
        {db.alertes.map((a,i)=>{
          const cfg={
            critique:{bg:"#FDECEA",border:"#FBBFAA",icon:"🚨",c:T.rust},
            importante:{bg:"#FFF8EC",border:"#F6D280",icon:"⚠️",c:T.amber},
            info:{bg:T.cream,border:T.straw,icon:"💡",c:T.clay},
          }[a.urgence]||{bg:T.cream,border:T.straw,icon:"💡",c:T.clay};
          return(
            <div key={i} className="stagger-item print-section" style={{background:cfg.bg,border:`1.5px solid ${cfg.border}`,
              borderRadius:14,padding:"14px 18px",marginBottom:10,
              display:"flex",alignItems:"flex-start",gap:14}}>
              <span style={{fontSize:18,flexShrink:0}}>{cfg.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.body,fontSize:13,color:T.ink,marginBottom:8,lineHeight:1.5}}>{a.msg}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  {a.normes.map(n=><NormeBadge key={n} id={n} small/>)}
                  <span style={{fontSize:11,color:T.mineral,fontFamily:F.body}}>→ Pilier {a.pilier}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabEnvironnement({ db }) {
  const ind=db.indicateurs;
  const [simCarb,setSimCarb]=useState(ind.co2);
  return(
    <div>
      <div className="stagger-item" style={{fontFamily:F.body,fontSize:12,color:T.clay,marginBottom:20,lineHeight:1.6,
        background:T.cream,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.straw}`}}>
        Référentiels : <strong>GRI 305</strong> · <strong>GRI 306</strong> · <strong>ESRS E1</strong> · <strong>ESRS E5</strong> · <strong>RE2020</strong> · <strong>Loi AGEC</strong> · <strong>Décret PEMD</strong>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
        <div className="stagger-item">
          <IndicCard title="Taux de valorisation déchets" value={ind.tauxValo} unit="%" cible={70}
            trend={ind.tauxValo>60?"up":"down"} pilier="Environnement"
            normeRef={["GRI_W","AGEC","REP_PMCB","ESRS_E5"]}
            why="GRI 306-4 : valorisation et élimination des déchets. La Loi AGEC impose le tri 7 flux depuis 2022. La REP PMCB structure les filières de collecte. Objectif sectoriel FNTP : >70% de valorisation."
            action="Contacter SINOE (ADEME) pour localiser les filières agréées. Mettre en place les BSD pour traçabilité. Viser la charte Chantier Propre FNTP."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Déchets produits par chantier" value={ind.kgM2} unit="kg/m²" cible={16}
            trend={ind.kgM2<20?"up":"down"} pilier="Environnement"
            normeRef={["GRI_W","PEMD","AGEC"]}
            why="GRI 306-3 : déchets générés. Le Décret PEMD rend le diagnostic ressources obligatoire avant démolition >1000m². Référence sectorielle FFB : 15-20 kg/m² pour le gros œuvre."
            action="Réaliser le diagnostic ressources en amont de chaque chantier de démolition. Privilégier le réemploi sur site. Suivre les BSD sur un tableau de bord chantier."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Émissions CO₂ estimées" value={ind.co2} unit="tCO₂e/k€CA" cible={25}
            trend="down" pilier="Environnement"
            normeRef={["GRI_E","ESRS_E1","SNBC","RE2020"]}
            why="GRI 305 couvre les Scopes 1 (carburant engins), 2 (énergie bureau) et 3 (matériaux, transport). La SNBC fixe la neutralité carbone en 2050. La Loi Industrie Verte 2023 intègre le carbone dans les AO publics."
            action="Réaliser un Bilan GES complet via l'outil SEVE (FFB) ou Bilan Carbone® ADEME. Identifier les postes prioritaires : béton/acier (Scope 3 majeur). Définir un plan de réduction avec jalons annuels."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Part matériaux biosourcés / recyclés" value={22} unit="%" cible={30}
            trend="up" pilier="Environnement"
            normeRef={["ESRS_E5","RE2020","SNBC"]}
            why="RE2020 valorise les matériaux à faible impact carbone (bois, chanvre, ouate). ESRS E5 exige le reporting sur l'utilisation des ressources. Objectif : augmenter la part biosourcée pour réduire le Scope 3."
            action="Sourcer les fournisseurs de matériaux biosourcés (annuaire FCBA). Intégrer les critères bas-carbone dans les appels d'offres matériaux. Former les conducteurs de travaux à la RE2020."/>
        </div>
      </div>
      {/* Simulateur */}
      <Card className="stagger-item" style={{padding:28}}>
        <div style={{fontSize:11,color:T.fern,fontFamily:F.body,fontWeight:700,
          textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>
          🔬 Simulateur d'impact — Réduction CO₂ (GRI 305 / ESRS E1)
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"center"}}>
          <div>
            <div style={{fontFamily:F.body,fontSize:13,color:T.clay,marginBottom:16}}>
              Simulez l'impact d'une réduction de 20% de votre consommation d'engins diesel :
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontFamily:F.body,fontSize:12,color:T.ink,display:"block",marginBottom:8}}>
                Émissions actuelles : <strong>{simCarb} tCO₂e/k€CA</strong>
              </label>
              <input type="range" min={10} max={80} value={simCarb}
                onChange={e=>setSimCarb(Number(e.target.value))}
                style={{width:"100%",accentColor:T.fern}}/>
            </div>
            <div style={{background:"#EEF7EC",borderRadius:12,padding:"12px 16px"}}>
              <div style={{fontSize:11,color:T.moss,fontFamily:F.body,fontWeight:700,marginBottom:6}}>
                Impact simulé (réduction -20%)
              </div>
              <div style={{fontFamily:F.display,fontSize:26,fontWeight:800,color:T.moss}}>
                -{(simCarb*0.20).toFixed(1)} <span style={{fontSize:14,color:T.fern}}>tCO₂e/k€CA</span>
              </div>
              <div style={{fontSize:12,color:T.moss,marginTop:4,fontFamily:F.body}}>
                Accès aux marchés publics bas-carbone (Loi Industrie Verte)
              </div>
            </div>
          </div>
          <div>
            <div style={{fontFamily:F.body,fontSize:12,color:T.clay,marginBottom:12}}>
              Comparaison sectorielle (source : ADEME / FFB 2024)
            </div>
            {[
              {l:"Votre entreprise",v:simCarb,col:T.fern},
              {l:"Moyenne BTP France",v:38,col:T.amber},
              {l:"Meilleures pratiques",v:20,col:T.moss},
            ].map(x=>(
              <div key={x.l} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontFamily:F.body,fontSize:12,color:T.ink}}>{x.l}</span>
                  <span style={{fontFamily:F.mono,fontSize:12,color:x.col,fontWeight:700}}>{x.v}</span>
                </div>
                <div style={{height:8,background:T.fog,borderRadius:4}}>
                  <div style={{height:"100%",width:`${(x.v/80)*100}%`,background:x.col,
                    borderRadius:4,transition:"width 0.6s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TabSocial({ db }) {
  const ind=db.indicateurs;
  return(
    <div>
      <div className="stagger-item" style={{fontFamily:F.body,fontSize:12,color:T.clay,marginBottom:20,lineHeight:1.6,
        background:T.cream,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.straw}`}}>
        Référentiels : <strong>GRI 403</strong> (santé-sécurité) · <strong>GRI 404</strong> (formation) · <strong>GRI 405</strong> (diversité) · <strong>ESRS S1</strong> · <strong>Code du travail L.4121-1</strong> · <strong>ISO 45001</strong>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
        <div className="stagger-item">
          <IndicCard title="Taux de Fréquence accidents (TF)" value={ind.tf} unit="" cible={12}
            trend="down" pilier="Social"
            normeRef={["GRI_OHS","CT_L4121","ESRS_S1"]}
            why="GRI 403-9 : TF = nb accidents × 1 000 000 / heures travaillées. Le BTP est le 2ème secteur le plus accidentogène. Obligation de résultat employeur (Code travail L.4121-1). Objectif OPPBTP : TF < 12."
            action="Mettre en place les causeries sécurité hebdomadaires. Renforcer les PPSPS. Viser la démarche MASE (exigée par 80% des grands donneurs d'ordre). Contacter l'OPPBTP pour un accompagnement gratuit."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Taux de Gravité (TG)" value={ind.tg} unit="" cible={1.0}
            trend="down" pilier="Social"
            normeRef={["GRI_OHS","CT_L4121","ESRS_S1"]}
            why="GRI 403-9 : TG = nb journées perdues × 1 000 / heures travaillées. Indicateur de sévérité des accidents. Corrélé au TF mais mesure spécifiquement l'impact des accidents graves. Objectif sectoriel : TG < 1,0."
            action="Analyser les accidents graves des 3 dernières années (arbre des causes). Améliorer les équipements de protection collective. Renforcer la formation aux premiers secours (SST)."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Heures de formation / salarié / an" value={ind.hForm} unit="h" cible={35}
            trend={ind.hForm>20?"up":"stable"} pilier="Social"
            normeRef={["GRI_T","CT_L6311","ESRS_S1"]}
            why="GRI 404-1 : moyenne d'heures de formation par employé. Code travail L.6311-1 : droit individuel à la formation. 35h/an est la référence des entreprises engagées BTP (FFB)."
            action="Formaliser le Plan de Développement des Compétences (PDC) annuel. Mobiliser les fonds OPCO Construction. Développer les CQP BTP et contrats d'alternance."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Taux de turnover" value={16} unit="%" cible={10}
            trend="stable" pilier="Social"
            normeRef={["GRI_T","ESRS_S1","ISO26000"]}
            why="ISO 26000 §6.4 : pratiques en matière d'emploi. GRI 401-1 : embauches et départs. Un fort turnover BTP (+15%) signale des conditions de travail dégradées et coûte en moyenne 6 mois de salaire par départ."
            action="Mener une enquête de satisfaction interne. Revoir les conditions de pénibilité (C2P). Améliorer l'intégration des nouveaux compagnons. Mettre en place la prime de fidélisation."/>
        </div>
      </div>
      {/* Index égalité F/H */}
      {(db.taille==="pme50"||db.taille==="pme250") && (
        <Card className="stagger-item" style={{padding:24,marginBottom:18,background:"linear-gradient(135deg,#F9F6FF,#FFF)"}}>
          <div style={{fontSize:11,color:T.slate,fontFamily:F.body,fontWeight:700,
            textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>
            ⚖️ Index Égalité Femmes-Hommes — GRI 405 / ESRS S1 / Code travail L.1142-8
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {[
              {label:"Écarts de rémunération",pts:25,max:40,ok:false},
              {label:"Augmentations F/H",pts:15,max:20,ok:true},
              {label:"Promotions F/H",pts:12,max:15,ok:true},
              {label:"Congé maternité",pts:15,max:15,ok:true},
            ].map(x=>(
              <div key={x.label} style={{
                background:x.ok?"#EEF7EC":"#FFF8EC",borderRadius:12,padding:"14px 16px",
                border:`1px solid ${x.ok?T.mist:T.straw}`}}>
                <div style={{fontFamily:F.body,fontSize:11,color:T.clay,marginBottom:8,lineHeight:1.4}}>{x.label}</div>
                <div style={{fontFamily:F.display,fontSize:20,fontWeight:800,
                  color:x.ok?T.moss:T.amber}}>{x.pts}<span style={{fontSize:11,color:T.mineral}}>/{x.max}</span></div>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,fontSize:12,color:T.clay,fontFamily:F.body,lineHeight:1.5}}>
            Score estimé : <strong style={{color:T.fern}}>67/100</strong> — Publication obligatoire avant le 1er mars. Seuil minimal légal : 75/100.
          </div>
        </Card>
      )}
    </div>
  );
}

function TabGouvernance({ db }) {
  const ind=db.indicateurs;
  return(
    <div>
      <div className="stagger-item" style={{fontFamily:F.body,fontSize:12,color:T.clay,marginBottom:20,lineHeight:1.6,
        background:T.cream,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.straw}`}}>
        Référentiels : <strong>GRI 205</strong> (anti-corruption) · <strong>ESRS G1</strong> · <strong>ISO 26000 §6.6</strong> · <strong>Loi LME</strong> · <strong>Loi Sapin II</strong> · <strong>Directive CSRD</strong>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:24}}>
        <div className="stagger-item">
          <IndicCard title="Délai paiement fournisseurs" value={ind.delaiPay} unit=" jours" cible={45}
            trend={ind.delaiPay<50?"up":"down"} pilier="Gouvernance"
            normeRef={["LME","ISO26000","ESRS_G1"]}
            why="Loi LME (2008) : délai maximum légal de 60 jours. ISO 26000 §6.6 : loyauté des pratiques dans la chaîne d'approvisionnement. Les retards de paiement fragilisent les sous-traitants."
            action="Mettre en place un suivi automatisé des délais de paiement. Négocier des conditions de paiement équitables. Viser les 45j pour dépasser la conformité légale."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="% sous-traitants évalués RSE" value={ind.pctST} unit="%" cible={60}
            trend={ind.pctST>40?"up":"down"} pilier="Gouvernance"
            normeRef={["ISO26000","ESRS_G1","LME"]}
            why="ISO 26000 §6.6 : responsabilité dans la chaîne d'approvisionnement. Les grands donneurs d'ordre exigent de plus en plus EcoVadis ou QUALIBAT à leurs sous-traitants. ESRS G1 : devoir de vigilance."
            action="Déployer une grille d'évaluation RSE simplifiée. Exiger le QUALIBAT RSE ou EcoVadis pour les sous-traitants récurrents. Former l'équipe achat aux critères RSE."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Niveau CSRD-readiness" value={Math.round((ind.pctST+ind.delaiPay)/2)} unit="%" cible={70}
            trend="up" pilier="Gouvernance"
            normeRef={["ESRS_G1","ISO26000","SAPIN2"]}
            why="La CSRD impose un reporting ESG progressif : 2024 (>500 sal.), 2025 (>250 sal.), 2026 (>50 sal. + PME cotées). ISO 26000 §7 : communication sur la responsabilité sociétale."
            action="Cartographier les données ESG disponibles. Nommer un référent CSRD interne. S'appuyer sur le kit CSRD FFB ou EY/PWC pour les PME."/>
        </div>
        <div className="stagger-item">
          <IndicCard title="Score gouvernance éthique" value={Math.round(ind.pctST*0.7)} unit="pt" cible={60}
            trend="up" pilier="Gouvernance"
            normeRef={["ESRS_G1","SAPIN2","ISO26000"]}
            why="GRI 205 : anti-corruption. Loi Sapin II : prévention corruption, transparence. ISO 26000 §6.6 : pratiques loyales. La gouvernance éthique est un facteur différenciant pour les marchés publics et privés."
            action="Adopter un code de conduite fournisseurs. Mettre en place une procédure de signalement interne (conformité Sapin II). Documenter les décisions stratégiques."/>
        </div>
      </div>
    </div>
  );
}

function TabActions({ db }) {
  const pilCol={Environnement:T.fern,Social:T.amber,Gouvernance:T.slate};
  const urgCol={haute:{bg:"#FDECEA",c:T.rust,dot:"🔴"},moyenne:{bg:"#FFF8EC",c:T.amber,dot:"🟡"},basse:{bg:"#EEF7EC",c:T.moss,dot:"🟢"}};
  return(
    <div>
      <div className="stagger-item" style={{fontFamily:F.body,fontSize:12,color:T.clay,marginBottom:20,lineHeight:1.6,
        background:T.cream,borderRadius:12,padding:"12px 16px",border:`1px solid ${T.straw}`}}>
        Plan d'action personnalisé généré à partir de votre diagnostic. Classé par ordre de priorité normative et d'impact opérationnel.
      </div>
      {db.actions.map((a,i)=>{
        const uc=urgCol[a.urgence]||urgCol.basse;
        const pc=pilCol[a.pilier]||T.clay;
        const norme=NORMES[a.norme];
        return(
          <div key={i} className="action-card-hover stagger-item print-section" style={{
            background:T.white,borderRadius:18,
            border:`1.5px solid ${T.straw}`,
            boxShadow:"0 2px 10px rgba(30,18,8,0.05)",
            padding:"20px 24px",marginBottom:12,
          }}>
            <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{
                width:36,height:36,borderRadius:10,
                background:`${pc}18`,border:`1px solid ${pc}30`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:16,flexShrink:0,fontFamily:F.mono,fontWeight:700,color:pc,
              }}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}>
                  <span style={{fontFamily:F.body,fontSize:14,fontWeight:700,color:T.ink}}>{a.label}</span>
                  <StatutTag s={a.statut}/>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  <span style={{fontSize:11,color:pc,fontFamily:F.body,fontWeight:700,
                    background:`${pc}12`,border:`1px solid ${pc}20`,
                    borderRadius:20,padding:"2px 10px"}}>{a.pilier}</span>
                  {norme && <NormeBadge id={a.norme} small/>}
                  <span style={{fontSize:11,color:T.mineral,fontFamily:F.mono}}>{a.ref}</span>
                </div>
                <div style={{
                  background:uc.bg,borderRadius:10,padding:"8px 12px",
                  border:`1px solid ${uc.c}20`,
                  display:"flex",alignItems:"center",gap:8,
                }}>
                  <span style={{fontSize:12}}>{uc.dot}</span>
                  <span style={{fontFamily:F.body,fontSize:12,color:T.ink}}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// ACTE 3 — DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function ActeDashboard({ db, onReset }) {
  const [tab, setTab] = useState("strategique");
  const tabs = [
    { id:"strategique", l:"Vue Stratégique", e:"📡" },
    { id:"environnement",l:"Environnement",  e:"🌿" },
    { id:"social",       l:"Social & RH",    e:"👷" },
    { id:"gouvernance",  l:"Gouvernance",    e:"🏛️" },
    { id:"actions",      l:"Plan d'action",  e:"🚀" },
  ];

  const handleExport = () => {
    // Title the print page
    const prevTitle = document.title;
    document.title = `Rapport RSE — ${db.nom} — ${new Date().getFullYear()}`;
    window.print();
    document.title = prevTitle;
  };

  const scoreColor = db.global>=70?T.fern:db.global>=50?T.amber:T.rust;

  return (
    <div className="act-enter" style={{minHeight:"100vh",background:T.fog}}>
      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,${T.soil},${T.bark})`,
        padding:"0 32px",
      }}>
        <div style={{
          maxWidth:1100,margin:"0 auto",
          display:"flex",alignItems:"center",justifyContent:"space-between",
          paddingTop:20,paddingBottom:20,
        }}>
          {/* Left: identity */}
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <div style={{
              width:52,height:52,borderRadius:14,
              background:`linear-gradient(135deg,${T.moss},${T.fern})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:24,boxShadow:`0 4px 16px rgba(46,74,42,0.40)`,
              animation:"pulse-ring 3s infinite 2s",
            }}>🌿</div>
            <div>
              <div style={{fontFamily:F.display,fontSize:22,fontWeight:700,color:T.cream,lineHeight:1.2}}>
                {db.nom}
              </div>
              <div style={{fontFamily:F.mono,fontSize:11,color:`${T.sage}CC`,marginTop:2,letterSpacing:"0.06em"}}>
                Tableau de bord RSE · Exercice 2025
              </div>
            </div>
          </div>

          {/* Center: global score pill */}
          <div style={{
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:20,padding:"10px 24px",
            display:"flex",alignItems:"center",gap:12,
            backdropFilter:"blur(8px)",
          }}>
            <span style={{fontFamily:F.body,fontSize:12,color:`${T.mist}99`}}>Score global</span>
            <span style={{fontFamily:F.display,fontSize:32,fontWeight:800,color:scoreColor}}>
              {db.global}
            </span>
            <span style={{fontFamily:F.body,fontSize:12,color:`${T.mist}80`}}>/100</span>
          </div>

          {/* Right: action buttons */}
          <div style={{display:"flex",gap:10,alignItems:"center"}} className="no-print">
            <button className="btn-export" onClick={handleExport}>
              <span>📄</span> Exporter la synthèse (PDF)
            </button>
            <button className="btn-ghost" onClick={onReset}
              style={{color:T.sage,borderColor:`${T.sage}60`,background:"transparent"}}>
              ✏️ Modifier
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{
          maxWidth:1100,margin:"0 auto",
          display:"flex",gap:4,paddingBottom:0,
          overflowX:"auto",
        }} className="no-print">
          {tabs.map(t=>{
            const active=tab===t.id;
            return(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                background:active?"rgba(255,255,255,0.12)":"transparent",
                border:"none",
                borderBottom:active?`2.5px solid ${T.leaf}`:`2.5px solid transparent`,
                color:active?T.cream:`${T.mist}80`,
                padding:"12px 18px",cursor:"pointer",
                fontFamily:F.body,fontSize:13,fontWeight:active?700:400,
                display:"flex",alignItems:"center",gap:6,
                transition:"all 0.2s ease",whiteSpace:"nowrap",
                borderRadius:"8px 8px 0 0",
              }}>
                {t.e} {t.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 32px"}}>
        <div key={tab} className="act-enter-fast">
          {tab==="strategique"  && <TabStrategique db={db}/>}
          {tab==="environnement"&& <TabEnvironnement db={db}/>}
          {tab==="social"       && <TabSocial db={db}/>}
          {tab==="gouvernance"  && <TabGouvernance db={db}/>}
          {tab==="actions"      && <TabActions db={db}/>}
        </div>

        {/* Footer */}
        <div style={{
          marginTop:40,paddingTop:24,
          borderTop:`1px solid ${T.straw}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",
          flexWrap:"wrap",gap:12,
        }}>
          <div style={{fontFamily:F.body,fontSize:11,color:T.mineral}}>
            Rapport généré le {new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"})} · Plateforme RSE BTP 2025
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["ISO 26000","GRI Standards","ESRS/CSRD","RE2020","Code du travail"].map(l=>(
              <span key={l} style={{
                background:T.fog,border:`1px solid ${T.straw}`,borderRadius:20,
                padding:"3px 10px",fontSize:10,fontFamily:F.mono,color:T.mineral,
              }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [acte, setActe] = useState("accueil"); // accueil | diagnostic | loading | dashboard
  const [db, setDb] = useState(null);

  const handleDiagComplete = useCallback((reps) => {
    setActe("loading");
    const computed = computeProfile(reps);
    // Theatrical delay for loading screen
    setTimeout(() => {
      setDb(computed);
      setActe("dashboard");
    }, 2200);
  }, []);

  const handleReset = useCallback(() => {
    setDb(null);
    setActe("diagnostic");
  }, []);

  return (
    <>
      <StyleInjector/>
      {acte==="accueil"    && <ActeAccueil onStart={()=>setActe("diagnostic")}/>}
      {acte==="diagnostic" && <ActeDiagnostic onComplete={handleDiagComplete}/>}
      {acte==="loading"    && <LoadingScreen/>}
      {acte==="dashboard"  && db && <ActeDashboard db={db} onReset={handleReset}/>}
    </>
  );
}
