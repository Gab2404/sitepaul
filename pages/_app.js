// pages/_app.js
// ───────────────────────────────────────────────────────────────────────────
// Point d'entrée Next.js : importe le CSS global une seule fois.
// Toutes les pages de l'app héritent automatiquement de ce fichier.
// ───────────────────────────────────────────────────────────────────────────
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
