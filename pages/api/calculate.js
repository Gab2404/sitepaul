// ═══════════════════════════════════════════════════════════════════════════
// ROUTE API — POST /api/calculate
//
// C'est le "serveur" de l'application.
// Le front envoie les réponses du diagnostic en POST (JSON),
// le serveur calcule le profil RSE et renvoie le résultat.
//
// URL  : http://localhost:3000/api/calculate
// Méthode : POST
// Body : { nom, taille, activite, dechets_pratique, ... }
// Retour : { envScore, socScore, gouScore, global, alertes, actions, ... }
// ═══════════════════════════════════════════════════════════════════════════

import { computeProfile } from "../../lib/computeProfile";

export default function handler(req, res) {
  // On n'accepte que les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." });
  }

  try {
    const reponses = req.body;

    // Validation minimale : vérifier que le body n'est pas vide
    if (!reponses || typeof reponses !== "object") {
      return res.status(400).json({ error: "Body invalide. Envoyez un objet JSON." });
    }

    // Calcul du profil RSE (logique côté serveur)
    const profil = computeProfile(reponses);

    // Réponse avec un délai simulé pour l'effet "loading" côté front
    // En production, ce serait un vrai calcul ou un appel base de données
    return res.status(200).json({ success: true, data: profil });

  } catch (error) {
    console.error("[API /calculate] Erreur :", error);
    return res.status(500).json({ error: "Erreur serveur lors du calcul RSE." });
  }
}
