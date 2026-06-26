import { useState, useEffect } from "react";
import { Badge } from "../components/ui/Badge";
import { StatCard } from "../components/ui/StatCard";
import CourtMap from "../components/court/CourtMap";
import TrendChart from "../components/charts/TrendChart";
import clsx from "clsx";

const RATING_VARIANT = { ELITE:"elite", GOOD:"good", AVG:"avg", POOR:"poor" };

export default function ShotQuality() {
  const [playerKey, setPlayerKey] = useState("curry");
  const [season, setSeason] = useState("2024-25 Season");
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliders, setSliders] = useState({ midrange:12, corner3:15, break3:33, rim:27 });

  const PLAYERS = [
    { key: "curry", label: "Stephen Curry — GSW" },
    { key: "james", label: "LeBron James — LAL" },
    { key: "jokić", label: "Nikola Jokić — DEN" },
    { key: "dončić", label: "Luka Dončić — DAL" }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/players/${encodeURIComponent(playerKey)}?season=${encodeURIComponent(season)}`)
      .then(res => res.json())
      .then(data => {
        setPlayerData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch player", err);
        setLoading(false);
      });
  }, [playerKey, season]);

  const updateSlider = (key, val) => setSliders(prev => ({ ...prev, [key]: Number(val) }));

  if (loading || !playerData) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="font-display text-xl text-accent animate-pulse tracking-widest">LOADING ENGINE...</div>
      </div>
    );
  }

  const p = playerData;
  const s = p.season || {};

  const base = s.pts ? parseFloat(s.pts) : 0;
  const delta = ((sliders.corner3 - 15) * 0.06) + ((sliders.break3 - 33) * 0.03) + ((sliders.rim - 27) * 0.04) - ((sliders.midrange - 12) * 0.05);
  const projected = Math.max(18, Math.min(42, base + delta)).toFixed(1);
  const diff = (projected - base).toFixed(1);
  
  // Calculate aggregate expected values based on zones
  const totalFga = p.zones?.reduce((sum, z) => sum + (z.fga || 0), 0) || 1;
  const expectedPpg = (p.zones?.reduce((sum, z) => {
    const is3pt = z.zone.includes("3") || z.zone.includes("Backcourt");
    const xpps = ((z.xfgp || 0) / 100) * (is3pt ? 3 : 2);
    return sum + (xpps * (z.fga || 0));
  }, 0) || 0) / (s.gp || 1);
  
  const expectedFgp = p.zones?.reduce((sum, z) => sum + ((z.xfgp || 0) * (z.fga || 0)), 0) / totalFga;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] text-accent font-black tracking-[0.14em] uppercase mb-2">xPTS Model · Shot Quality Analysis</div>
              <div className="font-display text-[52px] font-black uppercase leading-[0.9]">
                Expected<br />Points Engine
              </div>
              <p className="mt-3 text-gray-400 text-sm max-w-lg">
                Every shot graded on location, defender distance, shot clock, touch time & dribbles. Reveals who takes smart shots vs. who just gets hot.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <select 
                value={playerKey} 
                onChange={e => setPlayerKey(e.target.value)}
                className="bg-black border border-gray-700 text-white text-[12px] px-3 py-2 rounded font-body outline-none focus:border-accent">
                {PLAYERS.map(player => (
                  <option key={player.key} value={player.key}>{player.label}</option>
                ))}
              </select>
              <select 
                value={season}
                onChange={e => setSeason(e.target.value)}
                className="bg-black border border-gray-700 text-white text-[12px] px-3 py-2 rounded font-body outline-none focus:border-accent">
                <option>2024-25 Season</option>
                <option>2023-24 Season</option>
                <option>2022-23 Season</option>
              </select>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <StatCard label="Actual PPG" value={s.pts ? Number(s.pts).toFixed(1) : "0"} sub="From real shots taken" accentBorder />
            <StatCard label="xPPG (Expected)" value={expectedPpg ? expectedPpg.toFixed(1) : "0"} sub="By shot quality alone" accentBorder valueColor="text-green" />
            <StatCard label="Actual FG%" value={s.fgp ? Number(s.fgp).toFixed(1) + "%" : "0%"} delta={3.2} />
            <StatCard label="Expected FG% (xFG%)" value={expectedFgp ? expectedFgp.toFixed(1) + "%" : "0%"} sub="Shot quality-adjusted" />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row">
        {/* Main */}
        <div className="flex-1 border-r border-gray-800">

          {/* Court map */}
          <div className="p-6 border-b border-gray-800">
            <div className="section-title mb-4">Shot Chart — 2024-25</div>
            <CourtMap zones={p.zones} />
          </div>

          {/* Zone table */}
          <div className="p-6 border-b border-gray-800">
            <div className="section-title mb-4">Shot Zone Breakdown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Zone","FGA","FG%","xFG%","Pts/Shot","xPts/Shot","Diff","Rating"].map((h,i) => (
                      <th key={h} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold", i===0?"text-left":"text-right")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.zones?.map(z => {
                    const is3pt = z.zone.includes("3") || z.zone.includes("Backcourt");
                    const xpps = ((z.xfgp || 0) / 100) * (is3pt ? 3 : 2);
                    const diffVal = ((z.pps || 0) - xpps).toFixed(2);
                    const diffPos = diffVal >= 0;
                    return (
                      <tr key={z.zone} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                        <td className="py-3 font-medium">{z.zone}</td>
                        <td className="py-3 text-right text-gray-400">{z.fga}</td>
                        <td className="py-3 text-right font-bold">{z.fgp}%</td>
                        <td className="py-3 text-right text-gray-500">{z.xfgp}%</td>
                        <td className={clsx("py-3 text-right font-bold", z.pps > 1.1 ? "text-accent" : z.pps < 0.85 ? "text-red/80" : "text-white")}>{z.pps}</td>
                        <td className="py-3 text-right text-gray-500">{xpps.toFixed(2)}</td>
                        <td className={clsx("py-3 text-right font-bold text-[11px]", diffPos ? "text-green" : "text-red")}>
                          {diffPos ? "+" : ""}{diffVal}
                        </td>
                        <td className="py-3 text-right"><Badge label={z.rating} variant={RATING_VARIANT[z.rating] || "avg"} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trend */}
          <div className="p-6">
            <div className="section-title mb-4">xPTS Trend — Monthly 2024-25</div>
            <div className="bg-gray-900 border border-gray-800 rounded p-4">
              <TrendChart />
            </div>
          </div>
        </div>

        {/* Sidebar — Simulator */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          <div className="p-5 border-b border-gray-800 sticky top-[92px]">
            <div className="section-title mb-4">What-If Shot Simulator</div>
            <p className="text-[11px] text-gray-500 mb-5 leading-relaxed">
              Adjust {p.name?.split(' ')[0]}'s shot distribution and see how their projected PPG changes.
            </p>
            <div className="space-y-5">
              {[
                { key:"rim",      label:"At Rim %",        max:50 },
                { key:"corner3",  label:"Corner 3 %",      max:40 },
                { key:"break3",   label:"Above Break 3 %", max:60 },
                { key:"midrange", label:"Mid-Range %",     max:30 },
              ].map(({ key, label, max }) => (
                <div key={key}>
                  <div className="flex justify-between text-[12px] mb-2">
                    <span className="text-gray-300 font-medium">{label}</span>
                    <span className="text-accent font-bold">{sliders[key]}%</span>
                  </div>
                  <input type="range" min={0} max={max} value={sliders[key]}
                    onChange={e => updateSlider(key, e.target.value)} />
                  <div className="flex justify-between text-[10px] text-gray-700 mt-1">
                    <span>0%</span><span>{max}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="mt-6 bg-black border border-accent/50 rounded p-5 text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.14em] mb-1">Projected PPG</div>
              <div className="font-display text-[60px] font-black text-accent leading-none">{projected}</div>
              <div className={clsx("text-[12px] font-bold mt-2", Number(diff) > 0 ? "text-green" : Number(diff) < 0 ? "text-red" : "text-gray-500")}>
                {Number(diff) > 0 ? `▲ +${diff} from smarter shot mix`
                  : Number(diff) < 0 ? `▼ ${diff} from suboptimal mix`
                  : "Baseline — no change"}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 space-y-2">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-2">Key Insights</div>
              {[
                ["Corner 3s are the highest-value shot (1.30 pts/shot)", "text-green"],
                ["Mid-range shots cost ~0.11 pts/shot vs the rim", "text-red/70"],
                ["Curry already overperforms expected FG% by +3.2%", "text-accent"],
              ].map(([tip, color]) => (
                <div key={tip} className={clsx("text-[11px] leading-relaxed", color)}>· {tip}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
