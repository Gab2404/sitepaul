import { T, F } from "../../../lib/designSystem";

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES STATIQUES — Veille réglementaire & actualités RSE
// À terme, ces données pourront être remplacées par un appel API externe
// (ex: flux RSS, API Carenews, etc.)
// ═══════════════════════════════════════════════════════════════════════════
const ACTUS_RSE = [
  {
    id: 1,
    emoji: "🧼",
    categorie: "#RéductionInégalités",
    titre: "Baromètre 2026 : 4 millions de Français confrontés à la précarité hygiénique",
    resume: "Pour la 6ème année, l'association publie son baromètre réalisé par l'IFOP qui révèle une situation préoccupante. La précarité hygiénique se maintient à un niveau élevé...",
    date: "16 avril 2026",
    source: "Dons Solidaires",
    accentColor: T.fern,
    gradientFrom: "#E8F4E8",
    gradientTo: T.fog,
  },
  {
    id: 2,
    emoji: "🤝",
    categorie: "#Gouvernance",
    titre: "Impact France veut devenir l'organisation patronale représentant les entreprises engagées",
    resume: "Le mouvement veut réunir 100 000 entreprises ayant une stratégie d'impact social et/ou écologique positif et peser dans le débat public...",
    date: "15 avril 2026",
    source: "Carenews INFO",
    accentColor: T.moss,
    gradientFrom: "#EDF2F0",
    gradientTo: T.fog,
  },
  {
    id: 3,
    emoji: "⚖️",
    categorie: "#Conformité",
    titre: "Lafarge reconnue coupable de financement du terrorisme",
    resume: "Le tribunal correctionnel de Paris a condamné l'entreprise et des anciens responsables à des amendes. Pour les ONG, il s'agit d'une décision historique...",
    date: "14 avril 2026",
    source: "Carenews INFO",
    accentColor: T.slate,
    gradientFrom: "#EBF0F2",
    gradientTo: T.fog,
  },
  {
    id: 4,
    emoji: "📊",
    categorie: "#CSRD",
    titre: "CSRD : comment les entreprises prennent en compte les impacts sociaux et environnementaux",
    resume: "La directive européenne sur les rapports de durabilité (CSRD) oblige désormais un grand nombre d'entreprises à publier des indicateurs extra-financiers précis...",
    date: "12 avril 2026",
    source: "Info Graphie",
    accentColor: T.ochre,
    gradientFrom: "#F5EEE4",
    gradientTo: T.fog,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT CARTE D'ACTUALITÉ
// ═══════════════════════════════════════════════════════════════════════════
function ActuCard({ actu, index }) {
  return (
    <article
      className="stagger-item card-hover"
      style={{
        background: T.white,
        borderRadius: 20,
        border: `1.5px solid ${T.straw}`,
        boxShadow: "0 2px 14px rgba(30,18,8,0.07)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        animationDelay: `${index * 0.09}s`,
      }}
    >
      {/* ── Encart visuel ──────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${actu.gradientFrom}, ${actu.gradientTo})`,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Motif décoratif subtil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 18px,
              rgba(255,255,255,0.22) 18px,
              rgba(255,255,255,0.22) 19px
            )`,
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 2px 6px rgba(30,18,8,0.12))",
          }}
        >
          {actu.emoji}
        </span>
      </div>

      {/* ── Contenu ────────────────────────────────────────────── */}
      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>

        {/* Tag catégorie */}
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            color: T.mineral,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {actu.categorie}
        </div>

        {/* Titre */}
        <h3
          style={{
            fontFamily: F.body,
            fontSize: 15,
            fontWeight: 800,
            color: T.ink,
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {actu.titre}
        </h3>

        {/* Résumé */}
        <p
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: T.clay,
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
          }}
        >
          {actu.resume}
        </p>

        {/* ── Pied de carte ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            borderTop: `1px solid ${T.fog}`,
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: 11,
              color: T.mineral,
            }}
          >
            {actu.date}
          </span>
          <span
            style={{
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: 700,
              color: actu.accentColor,
              background: `${actu.accentColor}12`,
              border: `1px solid ${actu.accentColor}25`,
              borderRadius: 20,
              padding: "3px 10px",
              letterSpacing: "0.01em",
            }}
          >
            {actu.source}
          </span>
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — Onglet Actualités RSE
// ═══════════════════════════════════════════════════════════════════════════
export default function TabActus() {
  return (
    <div>
      {/* En-tête de l'onglet */}
      <div
        className="stagger-item"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: F.display,
              fontSize: 22,
              fontWeight: 700,
              color: T.ink,
              margin: "0 0 6px",
            }}
          >
            Veille réglementaire & actualités RSE
          </h2>
          <p
            style={{
              fontFamily: F.body,
              fontSize: 13,
              color: T.clay,
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Restez informé des dernières évolutions normatives, décisions de justice et tendances du secteur.
          </p>
        </div>

        {/* Badge "Mis à jour" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: `${T.fern}10`,
            border: `1px solid ${T.fern}30`,
            borderRadius: 20,
            padding: "6px 14px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.leaf,
              display: "inline-block",
              boxShadow: `0 0 0 3px ${T.leaf}30`,
            }}
          />
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 600,
              color: T.fern,
              letterSpacing: "0.06em",
            }}
          >
            Mis à jour le 16 avril 2026
          </span>
        </div>
      </div>

      {/* Grille de cartes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {ACTUS_RSE.map((actu, index) => (
          <ActuCard key={actu.id} actu={actu} index={index} />
        ))}
      </div>

      {/* Note de bas de page */}
      <div
        style={{
          background: T.cream,
          border: `1px solid ${T.straw}`,
          borderRadius: 14,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <p
          style={{
            fontFamily: F.body,
            fontSize: 12,
            color: T.clay,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Ces actualités sont sélectionnées manuellement pour leur pertinence RSE dans le secteur BTP.
          Pour une veille automatisée en temps réel, connectez votre plateforme à un flux RSS ou à l'API Carenews.
        </p>
      </div>
    </div>
  );
}
