// ═══════════════════════════════════════════════════════════════════════════
// MOTEUR DE CALCUL RSE — computeProfile
//
// Ce fichier est le "cerveau" de l'application.
// Il est importé UNIQUEMENT par la route API (/pages/api/calculate.js).
// Le front ne fait jamais ces calculs lui-même : il appelle l'API et reçoit
// un objet JSON avec tous les résultats déjà calculés.
//
// C'est ce qui simule une vraie architecture client-serveur.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @param {Object} r - Les réponses brutes du formulaire de diagnostic
 * @returns {Object} - Le profil RSE complet calculé
 */
export function computeProfile(r) {
  const act = r.activite || [];
  const hasDem = act.includes("demolition");
  const hasGC  = act.includes("genie_civil");
  const hasBig = act.includes("gros_oeuvre");

  // ── SCORES PILIERS ────────────────────────────────────────────────────────
  const envRaw = {
    dechets:  { aucun: 0, partiel: 30, "7flux": 70, optimise: 95 }[r.dechets_pratique] ?? 40,
    carbone:  { jamais: 5, partiel: 30, complet: 70, certifie: 95 }[r.carbone_bilan] ?? 20,
  };
  const envScore = Math.round(envRaw.dechets * 0.55 + envRaw.carbone * 0.45);

  const socRaw = {
    securite: { minimal: 15, actif: 50, mase: 75, certifie: 95 }[r.securite_niveau] ?? 30,
    formation:{ obligation: 20, plan: 55, proactif: 80, GPEC: 95 }[r.formation_rh] ?? 35,
  };
  const socScore = Math.round(socRaw.securite * 0.6 + socRaw.formation * 0.4);

  const gouRaw = {
    achats:   { prix_seul: 10, clause: 40, evaluation: 75, partenariat: 95 }[r.gouvernance_achats] ?? 25,
    reporting:{ aucun: 5, interne: 35, voluntaire: 65, certifie: 95 }[r.reporting_transparence] ?? 20,
  };
  const gouScore = Math.round(gouRaw.achats * 0.5 + gouRaw.reporting * 0.5);

  const global = Math.round(envScore * 0.38 + socScore * 0.38 + gouScore * 0.24);

  // ── INDICATEURS TERRAIN ───────────────────────────────────────────────────
  const tauxValo = { aucun: 28, partiel: 52, "7flux": 72, optimise: 88 }[r.dechets_pratique] ?? 40;
  const kgM2     = hasDem ? 38 : hasGC ? 28 : hasBig ? 24 : 18;
  const tf        = { minimal: 38, actif: 22, mase: 14, certifie: 8 }[r.securite_niveau] ?? 30;
  const tg        = { minimal: 2.8, actif: 1.8, mase: 1.2, certifie: 0.7 }[r.securite_niveau] ?? 2.2;
  const hForm     = { obligation: 12, plan: 24, proactif: 38, GPEC: 52 }[r.formation_rh] ?? 18;
  const delaiPay  = { prix_seul: 55, clause: 48, evaluation: 42, partenariat: 35 }[r.gouvernance_achats] ?? 50;
  const pctST     = { prix_seul: 5, clause: 25, evaluation: 60, partenariat: 85 }[r.gouvernance_achats] ?? 15;
  const co2       = hasBig || hasGC ? 42 : hasDem ? 38 : 28;

  // ── ALERTES NORMATIVES ────────────────────────────────────────────────────
  const alertes = [];

  if (r.dechets_pratique === "aucun" || r.dechets_pratique === "partiel")
    alertes.push({
      urgence: "critique",
      msg: "Tri 7 flux obligatoire (Loi AGEC 2022) — non-conformité exposant à des sanctions",
      normes: ["AGEC", "REP_PMCB"], pilier: "Environnement",
    });
  if (hasDem && r.dechets_pratique !== "optimise")
    alertes.push({
      urgence: "critique",
      msg: "Diagnostic PEMD obligatoire avant démolition >1000m² — Décret PEMD 2022",
      normes: ["PEMD"], pilier: "Environnement",
    });
  if (r.carbone_bilan === "jamais" || r.carbone_bilan === "partiel")
    alertes.push({
      urgence: "importante",
      msg: "Loi Industrie Verte 2023 : offres bas-carbone favorisées dans la commande publique",
      normes: ["SNBC", "ESRS_E1"], pilier: "Environnement",
    });
  if (r.taille === "pme250" && r.reporting_transparence !== "certifie")
    alertes.push({
      urgence: "critique",
      msg: "CSRD 2026 : reporting ESRS obligatoire pour votre taille — anticipation urgente",
      normes: ["ESRS_G1", "ESRS_E1"], pilier: "Gouvernance",
    });
  if ((r.taille === "pme50" || r.taille === "pme250") && r.securite_niveau === "minimal")
    alertes.push({
      urgence: "importante",
      msg: "Index égalité F/H à publier avant le 1er mars — Code travail L.1142-8",
      normes: ["ESRS_S1", "GRI_DE"], pilier: "Social",
    });
  if (r.gouvernance_achats === "prix_seul")
    alertes.push({
      urgence: "importante",
      msg: "Délai paiement fournisseurs : vérifier conformité LME (60j max)",
      normes: ["LME"], pilier: "Gouvernance",
    });
  if (r.securite_niveau === "minimal")
    alertes.push({
      urgence: "critique",
      msg: "DUERP doit être mis à jour annuellement — obligation Code du travail L.4121-3",
      normes: ["CT_L4121"], pilier: "Social",
    });
  alertes.push({
    urgence: "info",
    msg: "REP PMCB : raccordement obligatoire à une filière agréée sur votre territoire",
    normes: ["REP_PMCB", "AGEC"], pilier: "Environnement",
  });

  // ── RECOMMANDATIONS NORMATIVES ────────────────────────────────────────────
  const actions = [];

  if (r.securite_niveau === "minimal" || r.securite_niveau === "actif")
    actions.push({
      label: "Mettre à jour le DUERP et formaliser les PPSPS chantier",
      urgence: "haute", statut: "a_lancer", pilier: "Social",
      norme: "CT_L4121", ref: "Code travail L.4121-3",
      impact: "Réduction TF estimée : -30% sur 2 ans",
    });
  if (r.dechets_pratique === "aucun" || r.dechets_pratique === "partiel")
    actions.push({
      label: "Déployer le tri 7 flux et les BSD sur tous les chantiers",
      urgence: "haute", statut: "a_lancer", pilier: "Environnement",
      norme: "AGEC", ref: "Loi AGEC + REP PMCB",
      impact: "Conformité légale + économie sur les coûts d'élimination",
    });
  if (r.carbone_bilan === "jamais" || r.carbone_bilan === "partiel")
    actions.push({
      label: "Réaliser un Bilan GES complet (outil SEVE FFB ou ADEME)",
      urgence: "haute", statut: "a_lancer", pilier: "Environnement",
      norme: "GRI_E", ref: "GRI 305 + SNBC",
      impact: "Accès aux marchés publics bas-carbone (Loi Industrie Verte)",
    });
  if (r.gouvernance_achats === "prix_seul" || r.gouvernance_achats === "clause")
    actions.push({
      label: "Déployer une grille d'évaluation RSE fournisseurs",
      urgence: "moyenne", statut: "a_lancer", pilier: "Gouvernance",
      norme: "ISO26000", ref: "ISO 26000 §6.6",
      impact: "Conformité LME + attractivité grands donneurs d'ordre",
    });
  if (r.reporting_transparence === "aucun" || r.reporting_transparence === "interne")
    actions.push({
      label: "Initier un rapport RSE simplifié (modèle FFB ou GRI SME)",
      urgence: "moyenne", statut: "planifie", pilier: "Gouvernance",
      norme: "ESRS_G1", ref: "ISO 26000 §7 + GRI",
      impact: "Anticipation CSRD + différenciation appels d'offres",
    });
  if (r.formation_rh === "obligation" || r.formation_rh === "plan")
    actions.push({
      label: "Structurer un plan de développement des compétences (PDC)",
      urgence: "moyenne", statut: "planifie", pilier: "Social",
      norme: "GRI_T", ref: "Code travail L.6311-1 + GRI 404",
      impact: "Réduction turnover estimée : -20% sur 18 mois",
    });
  if (r.securite_niveau !== "certifie")
    actions.push({
      label: "Engager la démarche MASE avec l'OPPBTP",
      urgence: "moyenne", statut: "planifie", pilier: "Social",
      norme: "GRI_OHS", ref: "GRI 403 + ISO 45001",
      impact: "Exigé par 80% des grands donneurs d'ordre BTP",
    });
  if (r.taille === "pme250")
    actions.push({
      label: "Cartographier les données ESG disponibles pour la CSRD",
      urgence: "haute", statut: "a_lancer", pilier: "Gouvernance",
      norme: "ESRS_G1", ref: "Directive CSRD + normes ESRS",
      impact: "Obligation légale dès 2026 pour votre taille",
    });

  return {
    nom: r.nom || "Votre Entreprise",
    taille: r.taille,
    activite: act,
    envScore,
    socScore,
    gouScore,
    global,
    raw: { envRaw, socRaw, gouRaw },
    indicateurs: { tauxValo, kgM2, tf, tg, hForm, delaiPay, pctST, co2 },
    alertes: alertes.slice(0, 5),
    actions: actions.slice(0, 7),
    hasDemo: hasDem,
    hasGC,
    hasBig,
  };
}
