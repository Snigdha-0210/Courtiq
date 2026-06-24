export default function CourtMap({ zones = [], showLegend = true }) {
  // Color by rating
  const zoneColors = {
    ELITE: "rgba(0,200,83,0.75)",
    GOOD:  "rgba(232,255,71,0.75)",
    AVG:   "rgba(153,153,153,0.45)",
    POOR:  "rgba(255,59,59,0.55)",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-4">
      {showLegend && (
        <div className="flex gap-4 mb-3">
          {Object.entries(zoneColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: v }} />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{k}</span>
            </div>
          ))}
        </div>
      )}
      <svg viewBox="0 0 500 440" className="w-full" style={{ maxHeight: 360 }}>
        {/* Court outline */}
        <rect x="8" y="8" width="484" height="424" fill="none" stroke="#2A2A2A" strokeWidth="1.5" rx="4"/>

        {/* Paint */}
        <rect x="175" y="220" width="150" height="212" fill="none" stroke="#2A2A2A" strokeWidth="1"/>
        <rect x="195" y="220" width="110" height="130" fill="none" stroke="#222" strokeWidth="0.5"/>

        {/* FT line & circle */}
        <line x1="175" y1="350" x2="325" y2="350" stroke="#2A2A2A" strokeWidth="1"/>
        <ellipse cx="250" cy="350" rx="60" ry="45" fill="none" stroke="#2A2A2A" strokeWidth="1"/>

        {/* 3-point arc */}
        <path d="M 68 432 L 68 310 Q 250 72 432 310 L 432 432" fill="none" stroke="#2A2A2A" strokeWidth="1.5"/>
        <line x1="68"  y1="310" x2="68"  y2="432" stroke="#2A2A2A" strokeWidth="1"/>
        <line x1="432" y1="310" x2="432" y2="432" stroke="#2A2A2A" strokeWidth="1"/>

        {/* Basket */}
        <circle cx="250" cy="400" r="8" fill="none" stroke="#444" strokeWidth="1.5"/>
        <line x1="218" y1="400" x2="282" y2="400" stroke="#444" strokeWidth="1.5"/>

        {/* Center circle */}
        <ellipse cx="250" cy="8" rx="40" ry="20" fill="none" stroke="#1A1A1A" strokeWidth="1"/>

        {/* Zone highlights */}
        {/* Restricted area */}
        <ellipse cx="250" cy="400" rx="40" ry="28" fill={zoneColors["ELITE"]} opacity="0.5"/>

        {/* Paint */}
        <rect x="195" y="350" width="110" height="48" fill={zoneColors["AVG"]} opacity="0.35"/>

        {/* Mid range zones */}
        <path d="M 68 310 Q 150 200 195 220 L 175 220 L 68 310" fill={zoneColors["POOR"]} opacity="0.3"/>
        <path d="M 432 310 Q 350 200 305 220 L 325 220 L 432 310" fill={zoneColors["POOR"]} opacity="0.3"/>
        <path d="M 195 220 Q 250 160 305 220 Z" fill={zoneColors["POOR"]} opacity="0.3"/>

        {/* Corner 3 */}
        <rect x="8" y="310" width="60" height="122" fill={zoneColors["ELITE"]} opacity="0.45"/>
        <rect x="432" y="310" width="60" height="122" fill={zoneColors["ELITE"]} opacity="0.45"/>

        {/* Above break 3 */}
        <path d="M 68 310 Q 250 72 432 310 L 432 290 Q 250 50 68 290 Z" fill={zoneColors["GOOD"]} opacity="0.35"/>

        {/* Shot dots — Curry shot pattern */}
        {[
          // Rim (green)
          [250,390],[238,380],[262,385],[248,375],[255,395],[242,408],[258,408],
          // Corner 3 L (green)
          [30,330],[35,355],[28,375],[38,395],[25,415],
          // Corner 3 R (green)
          [470,330],[465,355],[472,375],[462,395],[475,415],
          // Above break 3 (yellow-green)
          [130,205],[165,155],[210,118],[250,105],[290,118],[335,155],[370,205],
          [145,230],[180,175],[225,138],[275,138],[320,175],[355,230],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i < 7 ? 5 : 4}
            fill={i < 7 ? zoneColors.ELITE : i < 12 ? zoneColors.ELITE : zoneColors.GOOD}
            opacity={0.85}
          />
        ))}

        {/* Mid range dots (red) */}
        {[[140,280],[170,248],[205,228],[295,228],[330,248],[360,280],[250,240]].map(([x,y],i) => (
          <circle key={"mr"+i} cx={x} cy={y} r={4} fill={zoneColors.POOR} opacity={0.7}/>
        ))}

        {/* Zone labels */}
        <text x="250" y="422" textAnchor="middle" fill="#666" fontSize="9" fontFamily="Inter" fontWeight="700">RESTRICTED AREA</text>
        <text x="35"  y="305" textAnchor="middle" fill="#666" fontSize="8" fontFamily="Inter" fontWeight="700">CORNER 3</text>
        <text x="465" y="305" textAnchor="middle" fill="#666" fontSize="8" fontFamily="Inter" fontWeight="700">CORNER 3</text>
        <text x="250" y="75"  textAnchor="middle" fill="#666" fontSize="8" fontFamily="Inter" fontWeight="700">ABOVE BREAK 3</text>
        <text x="140" y="260" textAnchor="middle" fill="#666" fontSize="8" fontFamily="Inter" fontWeight="700">MID</text>
        <text x="360" y="260" textAnchor="middle" fill="#666" fontSize="8" fontFamily="Inter" fontWeight="700">MID</text>
      </svg>
    </div>
  );
}
