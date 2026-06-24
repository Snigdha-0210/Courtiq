import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

function StandingsTable({ data, title }) {
  const navigate = useNavigate();
  const top = data[0];
  return (
    <div className="flex-1">
      <div className="font-display text-[15px] font-black tracking-[0.1em] uppercase text-gray-300 mb-4 pb-3 border-b border-gray-800">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse min-w-[480px]">
          <thead>
            <tr className="border-b border-gray-800">
              {["","Team","W","L","PCT","GB","Home","Road","L10","Streak"].map((h,i) => (
                <th key={i} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold whitespace-nowrap", i<=1?"text-left":"text-right")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((t, i) => {
              const pct = (t.w / (t.w + t.l)).toFixed(3).slice(1);
              const gb  = i === 0 ? "—" : (((top.w - t.w) + (t.l - top.l)) / 2).toFixed(1);
              const playoffLine = i === 5;
              return (
                <tr key={t.t} 
                  onClick={() => navigate(`/team/${t.t}`)}
                  className={clsx("hover:bg-gray-900/50 transition-colors cursor-pointer",
                  playoffLine ? "border-b border-accent/40" : "border-b border-gray-900")}>
                  <td className="py-2.5 text-gray-600 text-[11px] w-6">{i + 1}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={clsx("font-display font-black text-[15px] tracking-wide", i===0?"text-accent":"")}>{t.t.toUpperCase()}</span>
                      <span className="text-gray-500 hidden sm:inline">{t.city}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-bold">{t.w}</td>
                  <td className="py-2.5 text-right text-gray-400">{t.l}</td>
                  <td className="py-2.5 text-right font-bold text-accent">{pct}</td>
                  <td className="py-2.5 text-right text-gray-400">{gb}</td>
                  <td className="py-2.5 text-right text-gray-400">{t.home}</td>
                  <td className="py-2.5 text-right text-gray-400">{t.road}</td>
                  <td className="py-2.5 text-right text-gray-400">{t.l10}</td>
                  <td className={clsx("py-2.5 text-right font-bold", t.str.startsWith("W") ? "text-green" : "text-red")}>{t.str}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-8 h-px bg-accent/60" />
        <span className="text-[10px] text-gray-600">Playoff cutline</span>
      </div>
    </div>
  );
}

export default function Standings() {
  const [standings, setStandings] = useState({ EAST: [], WEST: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/standings`)
      .then(res => res.json())
      .then(data => {
        setStandings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch standings", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl">Loading standings...</div>;
  }

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <div className="font-display text-[48px] font-black uppercase leading-none">2023-24 Standings</div>
        <div className="text-gray-500 text-sm mt-2">Updated daily · Regular season</div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        {standings.EAST.length > 0 && <StandingsTable data={standings.EAST} title="Eastern Conference" />}
        <div className="w-px bg-gray-800 hidden lg:block" />
        {standings.WEST.length > 0 && <StandingsTable data={standings.WEST} title="Western Conference" />}
      </div>
    </div>
  );
}
