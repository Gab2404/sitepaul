import { NORMES } from "../../lib/normes";
import { F } from "../../lib/designSystem";

/**
 * Badge coloré affichant le code d'une norme (ex: "GRI 305").
 * Le survol affiche la description complète via le title HTML natif.
 */
export default function NormeBadge({ id, small = false }) {
  const n = NORMES[id];
  if (!n) return null;
  return (
    <span
      title={n.desc}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: `${n.color}18`, color: n.color,
        border: `1px solid ${n.color}40`,
        borderRadius: 20, padding: small ? "2px 7px" : "3px 10px",
        fontSize: small ? 10 : 11, fontFamily: F.mono, fontWeight: 600,
        letterSpacing: "0.02em", cursor: "default", whiteSpace: "nowrap",
      }}
    >
      {n.label}
    </span>
  );
}
