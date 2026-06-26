import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const TABS = [
  { key:"pts",  label:"Points",    unit:"PPG" },
  { key:"reb",  label:"Rebounds",  unit:"RPG" },
  { key:"ast",  label:"Assists",   unit:"APG" },
  { key:"stl",  label:"Steals",    unit:"SPG" },
  { key:"blk",  label:"Blocks",    unit:"BPG" },
  { key:"ts",   label:"True Shooting%", unit:"TS%" },
  { key:"3pm",  label:"3-Pointers Made", unit:"3PM" },
  { key:"per",  label:"PER",       unit:"PER" },
];

export default function Leaders() {
  const navigate = useNavigate();
  const [stat, setStat] = useState("pts");
  const [leadersMap, setLeadersMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leaders`)
      .then(res => res.json())
      .then(data => {
        setLeadersMap(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch leaders", err);
        setLoading(false);
      });
  }, []);

  const data   = leadersMap[stat] || [];
  const max    = data[0]?.val || 1;
  const tabObj = TABS.find(t => t.key === stat);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl">Loading leaders...</div>;
  }

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto">
      <div className="px-6 pt-8 pb-0">
        <div className="font-display text-[48px] font-black uppercase leading-none">League Leaders</div>
        <div className="text-gray-500 text-sm mt-2">2024-25 Regular Season</div>
      </div>

      <div className="flex border-b border-gray-800 mt-6 overflow-x-auto px-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setStat(t.key)}
            className={clsx("px-4 py-3 text-[11px] font-bold tracking-[0.09em] uppercase whitespace-nowrap border-b-2 -mb-px transition-all",
              stat === t.key ? "text-white border-accent" : "text-gray-500 border-transparent hover:text-gray-300")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {data.slice(0,3).map((p, i) => {
            const medals = ["🥇","🥈","🥉"];
            const sizes  = ["text-[56px]","text-[44px]","text-[44px]"];
            return (
              <div key={p.name} onClick={() => navigate(`/player/${p.name.split(' ')[1].toLowerCase()}`)} className={clsx("bg-gray-900 border rounded p-5 text-center cursor-pointer hover:border-accent transition-colors", i===0?"border-accent/50":"border-gray-800")}>
                <div className="text-2xl mb-2">{medals[i]}</div>
                <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-display text-[18px] font-black text-gray-300 mx-auto mb-3">
                  {p.init}
                </div>
                <div className="font-semibold text-[13px] text-white">{p.name}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{p.team} · {p.pos}</div>
                <div className={clsx("font-display font-black mt-3 leading-none", sizes[i], i===0?"text-accent":"text-white")}>
                  {p.val}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{tabObj?.unit}</div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="space-y-0">
          {data.map((p, i) => {
            const barW = Math.round((p.val / max) * 100);
            return (
              <div key={p.name} onClick={() => navigate(`/player/${p.name.split(' ')[1].toLowerCase()}`)} className="flex items-center gap-4 py-3 border-b border-gray-900 hover:bg-gray-900/40 transition-colors px-2 rounded cursor-pointer group">
                <span className={clsx("font-display text-[22px] font-black w-8 text-center flex-shrink-0", i<3?"text-accent":"text-gray-700")}>
                  {i + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-display text-[14px] font-black text-gray-400 flex-shrink-0">
                  {p.init}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold group-hover:text-accent transition-colors">{p.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.team} · {p.pos}</div>
                </div>
                <div className="flex-1 max-w-xs hidden md:block">
                  <div className="h-[3px] bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent/70 rounded-full transition-all duration-500" style={{ width: `${barW}%` }} />
                  </div>
                </div>
                <span className="font-display text-[28px] font-black text-white w-16 text-right flex-shrink-0">{p.val}</span>
                <span className="text-[10px] text-gray-500 uppercase w-8 flex-shrink-0">{tabObj?.unit}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
