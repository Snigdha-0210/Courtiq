import { useState, useEffect } from "react";
import RadarChart from "../components/charts/RadarChart";
import clsx from "clsx";

const STATS = [
  { key:"pts",   label:"Points Per Game",     unit:"PPG",  higherBetter:true },
  { key:"reb",   label:"Rebounds Per Game",   unit:"RPG",  higherBetter:true },
  { key:"ast",   label:"Assists Per Game",    unit:"APG",  higherBetter:true },
  { key:"fgp",   label:"Field Goal %",        unit:"%",    higherBetter:true },
  { key:"fg3p",  label:"3-Point %",           unit:"%",    higherBetter:true },
  { key:"ftp",   label:"Free Throw %",        unit:"%",    higherBetter:true },
  { key:"tsp",   label:"True Shooting %",     unit:"%",    higherBetter:true },
  { key:"per",   label:"Player Eff. Rating",  unit:"PER",  higherBetter:true },
  { key:"ws",    label:"Win Shares",          unit:"WS",   higherBetter:true },
  { key:"vorp",  label:"VORP",                unit:"",     higherBetter:true },
  { key:"bpm",   label:"Box Plus/Minus",      unit:"",     higherBetter:true },
  { key:"usage", label:"Usage Rate",          unit:"%",    higherBetter:false },
  { key:"tov",   label:"Turnovers Per Game",  unit:"",     higherBetter:false },
  { key:"ortg",  label:"Offensive Rating",    unit:"",     higherBetter:true },
  { key:"gp",    label:"Games Played",        unit:"",     higherBetter:true },
];

function StatBar({ valA, valB, higherBetter }) {
  const maxV = Math.max(valA, valB);
  const aW   = Math.round((valA / maxV) * 100);
  const bW   = Math.round((valB / maxV) * 100);
  const aWins = higherBetter ? valA > valB : valA < valB;
  return (
    <div className="grid grid-cols-2 gap-2 py-0.5">
      <div className="flex justify-end">
        <div className={clsx("h-[3px] rounded-full transition-all", aWins ? "bg-accent" : "bg-gray-700")} style={{ width: `${aW}%` }} />
      </div>
      <div>
        <div className={clsx("h-[3px] rounded-full transition-all", !aWins ? "bg-white/50" : "bg-gray-700")} style={{ width: `${bW}%` }} />
      </div>
    </div>
  );
}

export default function Compare() {
  const PLAYERS = [
    { key: "curry", label: "Stephen Curry — GSW" },
    { key: "james", label: "LeBron James — LAL" },
    { key: "jokić", label: "Nikola Jokić — DEN" },
    { key: "dončić", label: "Luka Dončić — DAL" }
  ];

  const [playerAKey, setPlayerAKey] = useState("curry");
  const [playerBKey, setPlayerBKey] = useState("james");
  const [season, setSeason] = useState("2024-25 Season");
  const [players, setPlayers] = useState({ a: null, b: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/players/${encodeURIComponent(playerAKey)}?season=${encodeURIComponent(season)}`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/players/${encodeURIComponent(playerBKey)}?season=${encodeURIComponent(season)}`).then(r => r.json())
    ]).then(([playerA, playerB]) => {
      setPlayers({ a: playerA, b: playerB });
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch players", err);
      setLoading(false);
    });
  }, [playerAKey, playerBKey, season]);

  if (loading || !players.a || !players.b) {
    return <div className="p-10 text-white font-display text-xl">Loading comparison data...</div>;
  }

  const { a, b } = players;

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex justify-end pt-4 pr-6 pb-2 border-b border-gray-800">
        <select 
          value={season}
          onChange={e => setSeason(e.target.value)}
          className="bg-black border border-gray-700 text-white text-[12px] px-3 py-2 rounded font-body outline-none focus:border-accent">
          <option>2024-25 Season</option>
          <option>2023-24 Season</option>
          <option>2022-23 Season</option>
        </select>
      </div>
      <div className="grid grid-cols-[1fr_60px_1fr] border-b border-gray-800">
        {/* Player A */}
        <div className="p-6 bg-accent/5">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] text-accent font-black tracking-[0.14em] uppercase">Player A</div>
            <select 
              value={playerAKey} 
              onChange={e => setPlayerAKey(e.target.value)}
              className="bg-black border border-gray-700 text-white text-[10px] px-2 py-1 rounded font-body outline-none focus:border-accent">
              {PLAYERS.map(player => (
                <option key={player.key} value={player.key}>{player.label}</option>
              ))}
            </select>
          </div>
          <div className="font-display text-[44px] font-black uppercase leading-[0.9]">{a.firstName}<br/>{a.lastName}</div>
          <div className="text-[12px] text-gray-400 mt-2">{a.pos} · {a.team}</div>
          <div className="flex gap-4 mt-4">
            {[["PPG", a.season.pts],["AST", a.season.ast],["REB", a.season.reb]].map(([l,v]) => (
              <div key={l}>
                <div className="font-display text-[28px] font-black text-accent leading-none">{v}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* VS */}
        <div className="flex items-center justify-center border-x border-gray-800 bg-gray-900">
          <span className="font-display text-[20px] font-black text-gray-700">VS</span>
        </div>
        {/* Player B */}
        <div className="p-6 text-right">
          <div className="flex justify-between items-start mb-2 flex-row-reverse">
            <div className="text-[10px] text-gray-400 font-black tracking-[0.14em] uppercase">Player B</div>
            <select 
              value={playerBKey} 
              onChange={e => setPlayerBKey(e.target.value)}
              className="bg-black border border-gray-700 text-white text-[10px] px-2 py-1 rounded font-body outline-none focus:border-accent text-right">
              {PLAYERS.map(player => (
                <option key={player.key} value={player.key}>{player.label}</option>
              ))}
            </select>
          </div>
          <div className="font-display text-[44px] font-black uppercase leading-[0.9]">{b.name.split(" ")[0]}<br/>{b.name.split(" ").slice(1).join(" ")}</div>
          <div className="text-[12px] text-gray-400 mt-2">{b.pos} · {b.team}</div>
          <div className="flex gap-4 mt-4 justify-end">
            {[["PPG", b.season.pts],["AST", b.season.ast],["REB", b.season.reb]].map(([l,v]) => (
              <div key={l} className="text-right">
                <div className="font-display text-[28px] font-black text-white leading-none">{v}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Stats comparison */}
        <div className="flex-1 border-r border-gray-800">
          <div className="px-6 pt-5 pb-2 section-title">Head-to-Head Comparison</div>
          {STATS.map(stat => {
            const aVal = a.season[stat.key];
            const bVal = b.season[stat.key];
            const aWins = stat.higherBetter ? aVal > bVal : aVal < bVal;
            return (
              <div key={stat.key}>
                <div className="grid grid-cols-[1fr_140px_1fr] items-center px-6 py-2.5 hover:bg-gray-900/30 transition-colors">
                  <div className="text-right">
                    <span className={clsx("font-display text-[22px] font-black", aWins ? "text-accent" : "text-white")}>
                      {aVal}
                    </span>
                    {stat.unit && <span className="text-[10px] text-gray-600 ml-1">{stat.unit}</span>}
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.08em]">{stat.label}</div>
                  </div>
                  <div>
                    <span className={clsx("font-display text-[22px] font-black", !aWins ? "text-white/80" : "text-gray-500")}>
                      {bVal}
                    </span>
                    {stat.unit && <span className="text-[10px] text-gray-600 ml-1">{stat.unit}</span>}
                  </div>
                </div>
                <div className="px-6">
                  <StatBar valA={aVal} valB={bVal} higherBetter={stat.higherBetter} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 p-6">
          <div className="section-title mb-4">Skill Radar</div>
          <RadarChart playerA={a} playerB={b} />
          <div className="flex flex-col gap-2 mt-4">
            {[[a.name, "#E8FF47"], [b.name, "#555"]].map(([name, color]) => (
              <div key={name} className="flex items-center gap-3 text-[12px]">
                <span className="w-8 h-[2px] inline-block rounded" style={{ background: color }} />
                <span className="text-gray-300">{name}</span>
              </div>
            ))}
          </div>

          {/* Edge summary */}
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded p-4">
            <div className="section-title mb-3">Edge Summary</div>
            {[
              [a.name, "3P%, FG%, TS%, Efficiency"],
              [b.name, "PPG, RPG, APG, PER, VORP"],
            ].map(([name, cats]) => (
              <div key={name} className="mb-3 last:mb-0">
                <div className="text-[12px] font-bold mb-1 text-accent">{name.split(" ").pop()}</div>
                <div className="text-[11px] text-gray-400">{cats}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
