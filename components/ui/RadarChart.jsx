import { useState, useEffect } from "react";
import { T, F } from "../../lib/designSystem";

/**
 * Radar chart triangulaire SVG natif — 3 axes : Environnement, Social, Gouvernance.
 * Tooltips natifs SVG au survol de chaque point (affiche la valeur exacte).
 * Drop-shadow global sur le SVG.
 */
export default function RadarChart({ env, soc, gou, size = 220 }) {
  const [a, setA] = useState({ env: 0, soc: 0, gou: 0 });
  const [tooltip, setTooltip] = useState(null); // index du point survolé

  useEffect(() => {
    const t = setTimeout(() => setA({ env, soc, gou }), 600);
    return () => clearTimeout(t);
  }, [env, soc, gou]);

  const cx = 110, cy = 115, r = 80;
  const pts = [
    { label: "Environnement", angle: -90,  val: a.env,  fullVal: env,  col: T.fern  },
    { label: "Social",        angle: 30,   val: a.soc,  fullVal: soc,  col: T.amber },
    { label: "Gouvernance",   angle: 150,  val: a.gou,  fullVal: gou,  col: T.slate },
  ];

  const toXY = (angle, radius, pct = 1) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * pct * Math.cos(rad),
      y: cy + radius * pct * Math.sin(rad),
    };
  };

  const gridLevels = [25, 50, 75, 100];
  const polyPoints = pts
    .map((p) => { const pp = toXY(p.angle, r, p.val / 100); return `${pp.x},${pp.y}`; })
    .join(" ");

  return (
    <svg
      width={size} height={size} viewBox="0 0 220 220"
      style={{ filter: "drop-shadow(0 4px 16px rgba(30,18,8,0.10))" }}
    >
      <defs>
        <filter id="radar-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grille */}
      {gridLevels.map((lvl) => {
        const gpts = pts.map((p) => { const pp = toXY(p.angle, r * lvl / 100); return `${pp.x},${pp.y}`; }).join(" ");
        return (
          <polygon key={lvl} points={gpts} fill="none"
            stroke={T.straw} strokeWidth={lvl === 100 ? 1.5 : 0.8}
            strokeDasharray={lvl < 100 ? "4,3" : ""} />
        );
      })}

      {/* Axes */}
      {pts.map((p, i) => {
        const ep = toXY(p.angle, r);
        return <line key={i} x1={cx} y1={cy} x2={ep.x} y2={ep.y} stroke={T.straw} strokeWidth={1} />;
      })}

      {/* Zone colorée */}
      <polygon points={polyPoints} fill={`${T.fern}28`} stroke={T.fern} strokeWidth={2.5}
        style={{ transition: "all 1.6s ease" }} />

      {/* Points interactifs avec tooltips SVG */}
      {pts.map((p, i) => {
        const pp = toXY(p.angle, r, p.val / 100);
        const lp = toXY(p.angle, r + 26);
        const col = p.fullVal >= 70 ? T.moss : p.fullVal >= 50 ? T.amber : T.rust;
        const isHov = tooltip === i;
        return (
          <g key={i} style={{ cursor: "pointer" }}
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}>
            <circle cx={pp.x} cy={pp.y} r={isHov ? 9 : 5}
              fill={col} stroke={T.white} strokeWidth={2}
              filter={isHov ? "url(#radar-glow)" : undefined}
              style={{ transition: "all 0.2s ease" }} />
            {isHov && (
              <g>
                <rect x={pp.x - 28} y={pp.y - 30} width={56} height={22} rx={6}
                  fill={T.ink} opacity={0.88} />
                <text x={pp.x} y={pp.y - 15} textAnchor="middle" fill={T.white}
                  fontSize={11} fontFamily={F.display} fontWeight={800}>
                  {p.fullVal}/100
                </text>
              </g>
            )}
            <text x={lp.x} y={lp.y} textAnchor="middle" fill={T.ink}
              fontSize={9} fontFamily={F.body} fontWeight={600}>{p.label}</text>
            <text x={lp.x} y={lp.y + 11} textAnchor="middle" fill={col}
              fontSize={10} fontFamily={F.display} fontWeight={800}>{p.fullVal}</text>
          </g>
        );
      })}
    </svg>
  );
}
