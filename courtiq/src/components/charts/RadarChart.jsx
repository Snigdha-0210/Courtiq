export default function RadarChart({ playerA, playerB }) {
  const labels = ["Scoring", "Shooting", "Playmaking", "Defense", "Efficiency"];
  const keysA  = [playerA?.radar?.scoring, playerA?.radar?.shooting, playerA?.radar?.playmaking, playerA?.radar?.defense, playerA?.radar?.efficiency];
  const keysB  = playerB ? [playerB?.radar?.scoring, playerB?.radar?.shooting, playerB?.radar?.playmaking, playerB?.radar?.defense, playerB?.radar?.efficiency] : null;

  const cx = 150, cy = 140, r = 100;
  const angles = labels.map((_, i) => (Math.PI * 2 * i) / labels.length - Math.PI / 2);

  const toXY = (val, angle, scale = 1) => ({
    x: cx + (val / 100) * r * scale * Math.cos(angle),
    y: cy + (val / 100) * r * scale * Math.sin(angle),
  });

  const polyA = keysA.map((v, i) => toXY(v, angles[i]));
  const polyB = keysB ? keysB.map((v, i) => toXY(v, angles[i])) : null;

  const toPoint = (pts) => pts.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 280" className="w-full" style={{ maxHeight: 280 }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon key={scale}
          points={toPoint(angles.map(a => toXY(100, a, scale)))}
          fill="none" stroke="#1A1A1A" strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {angles.map((angle, i) => {
        const end = toXY(100, angle);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#1A1A1A" strokeWidth="1" />;
      })}

      {/* Player B polygon */}
      {polyB && (
        <polygon points={toPoint(polyB)} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 2" />
      )}

      {/* Player A polygon */}
      <polygon points={toPoint(polyA)} fill="rgba(232,255,71,0.1)" stroke="#E8FF47" strokeWidth="2" />

      {/* Dots */}
      {polyA.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#E8FF47" />)}
      {polyB && polyB.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#666" />)}

      {/* Labels */}
      {labels.map((label, i) => {
        const pos = toXY(118, angles[i]);
        return (
          <text key={i} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
            fill="#555" fontSize="9" fontFamily="Inter" fontWeight="700">
            {label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}
