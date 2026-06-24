import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Team() {
  const { teamId } = useParams();
  const activeTeamId = teamId || "WARRIORS";
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  // If there's no teamId, just default to WARRIORS or redirect
  useEffect(() => {
    if (!teamId) {
      navigate("/team/WARRIORS", { replace: true });
      return;
    }

    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId.toUpperCase()}`)
      .then(res => res.json())
      .then(data => {
        setTeamData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching team:", err);
        setLoading(false);
      });
  }, [teamId, navigate]);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl">Loading team data...</div>;
  }

  if (!teamData || Object.keys(teamData).length === 0) {
    return <div className="p-10 text-red-500 font-display text-xl">Team not found</div>;
  }

  const { city, team, conference, seed, wins, losses, off_rtg, def_rtg, net_rtg, pace, four_factors, roster } = teamData;
  const winPct = (wins / (wins + losses)).toFixed(3).slice(1);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div>
              <div className="text-[11px] text-accent font-black tracking-[0.14em] uppercase mb-2">{conference}ern Conference · {seed} Seed</div>
              <div className="font-display text-[64px] font-black uppercase leading-[0.88] tracking-tight">
                {city.split(" ").map((w, i) => <div key={i}>{w}</div>)}
                <span className="text-accent">{team}</span>
              </div>
              <div className="flex gap-8 mt-6">
                {[["Off Rtg",off_rtg],["Def Rtg",def_rtg],["Net Rtg",net_rtg],["Pace",pace]].map(([l,v]) => (
                  <div key={l}>
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-1">{l}</div>
                    <div className="font-display text-[28px] font-black text-accent leading-none">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-2">2023-24 Record</div>
              <div className="font-display text-[80px] font-black text-accent leading-none">{wins}</div>
              <div className="font-display text-[28px] font-black text-gray-500">— {losses}</div>
              <div className="text-[12px] text-gray-500 mt-2">.{winPct} Win Pct</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-6 space-y-8">
        {/* Four Factors */}
        <div>
          <div className="section-title mb-4">Four Factors</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {four_factors && four_factors.map(f => (
              <div key={f.label} className={clsx("bg-gray-900 border rounded p-4", f.good ? "border-gray-800" : "border-gray-800")}>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mb-2">{f.label}</div>
                <div className={clsx("font-display text-[30px] font-black leading-none", f.good ? "text-accent" : "text-white")}>{f.val}</div>
                <div className="text-[11px] text-gray-500 mt-1">{f.rank} in NBA</div>
              </div>
            ))}
          </div>
        </div>

        {/* Roster */}
        <div>
          <div className="section-title mb-4">Roster</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Player","Pos","Age","PTS","REB","AST","FG%","3P%","TS%","PER"].map((h,i) => (
                    <th key={h} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold", i<=1?"text-left":"text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roster && roster.map((r, idx) => (
                  <tr key={r.name} className={clsx("border-b border-gray-900 hover:bg-gray-900/50 transition-colors cursor-pointer", idx===0?"bg-gray-900/30":"")}>
                    <td className={clsx("py-3 font-semibold", idx===0?"text-accent":"")}>{r.name}</td>
                    <td className="py-3 text-gray-500 font-bold">{r.pos}</td>
                    <td className="py-3 text-right text-gray-400">{r.age}</td>
                    <td className="py-3 text-right font-bold">{r.pts}</td>
                    <td className="py-3 text-right">{r.reb}</td>
                    <td className="py-3 text-right">{r.ast}</td>
                    <td className="py-3 text-right">{r.fgp}%</td>
                    <td className="py-3 text-right">{r.fg3p > 0 ? r.fg3p+"%" : "—"}</td>
                    <td className="py-3 text-right font-bold text-accent">{r.tsp}%</td>
                    <td className="py-3 text-right font-bold">{r.per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
