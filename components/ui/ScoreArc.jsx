import { useState, useEffect } from "react";
import { T, F } from "../../lib/designSystem";

/**
 * Arc de score semi-circulaire animé en SVG natif.
 * L'arc s'anime de 0 → valeur au montage du composant.
 * Drop-shadow et glow filter appliqués sur la courbe colorée.
 */
export default function ScoreArc({ score, size = 120, label = "" }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 500);
    return () => clearTimeout(t);
  }, [score]);

  const R = 46, cx = 60, cy = 65;
  const circ = Math.PI * R;
  const offset = circ - (animated / 100) * circ;
  const col = score >= 70 ? T.fern : score >= 50 ? T.amber : T.rust;

  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 120 80"
      style={{ filter: "drop-shadow(0 4px 12px rgba(46,74,42,0.18))" }}
    >
      <defs>
        <filter id="arc-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track gris */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke={T.fog} strokeWidth={10} strokeLinecap="round"
      />
      {/* Arc coloré animé */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke={col} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        filter="url(#arc-glow)"
        style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,1.2,.4,1)" }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={T.ink}
        fontSize={24} fontWeight={800} fontFamily={F.display}>{score}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={T.clay}
        fontSize={9} fontFamily={F.body}>{label || "/100"}</text>
    </svg>
  );
}
