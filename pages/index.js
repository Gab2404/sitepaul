// pages/index.js
// ───────────────────────────────────────────────────────────────────────────
// Page principale — orchestre les 3 actes de l'application :
//   1. ActeAccueil    → écran de bienvenue
//   2. ActeDiagnostic → formulaire 10 questions + appel API
//   3. LoadingScreen  → pendant le calcul serveur
//   4. ActeDashboard  → tableau de bord RSE complet
//
// Le state "acte" contrôle le rendu. Quand ActeDiagnostic a fini
// d'appeler /api/calculate, il remonte le profil calculé ici.
// ───────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import Head from "next/head";
import ActeAccueil    from "../components/views/ActeAccueil";
import ActeDiagnostic from "../components/views/ActeDiagnostic";
import LoadingScreen  from "../components/views/LoadingScreen";
import ActeDashboard  from "../components/views/ActeDashboard";

export default function Home() {
  // États possibles : "accueil" | "diagnostic" | "loading" | "dashboard"
  const [acte, setActe] = useState("accueil");
  const [profil, setProfil] = useState(null);

  // Appelé par ActeDiagnostic quand il submitte les réponses à l'API.
  // Le composant passe en "loading" pendant le fetch, puis en "dashboard".
  const handleDiagnosticSubmit = useCallback((profilData) => {
    setProfil(profilData);
    setActe("dashboard");
  }, []);

  // Appelé quand ActeDiagnostic commence le fetch API (pour afficher loading)
  const handleFetchStart = useCallback(() => {
    setActe("loading");
  }, []);

  const handleReset = useCallback(() => {
    setProfil(null);
    setActe("diagnostic");
  }, []);

  return (
    <>
      <Head>
        <title>Plateforme RSE BTP — Pilotez votre performance en 5 minutes</title>
        <meta name="description" content="Diagnostic RSE complet pour les PME du BTP. ISO 26000, GRI, ESRS/CSRD, RE2020, Loi AGEC. Générez votre tableau de bord en 5 minutes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
      </Head>

      {acte === "accueil" && (
        <ActeAccueil onStart={() => setActe("diagnostic")} />
      )}

      {acte === "diagnostic" && (
        <ActeDiagnostic
          onFetchStart={handleFetchStart}
          onComplete={handleDiagnosticSubmit}
        />
      )}

      {acte === "loading" && <LoadingScreen />}

      {acte === "dashboard" && profil && (
        <ActeDashboard db={profil} onReset={handleReset} />
      )}
    </>
  );
}
