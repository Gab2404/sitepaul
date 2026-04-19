import { T } from "../../lib/designSystem";

/**
 * Carte blanche avec hover animé (élévation + bordure verte).
 * Accepte n'importe quel children + style overrides.
 */
export default function Card({ children, style = {}, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`card-hover ${className}`}
      style={{
        background: T.white,
        borderRadius: 20,
        border: `1.5px solid ${T.straw}`,
        boxShadow: "0 2px 14px rgba(30,18,8,0.07)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
