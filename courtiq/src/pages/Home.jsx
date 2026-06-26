import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Badge } from "../components/ui/Badge";
import clsx from "clsx";

function GameCard({ game }) {
  const navigate = useNavigate();
  const hWin = game.status === "FINAL" && game.hs > game.as;
  const aWin = game.status === "FINAL" && game.as > game.hs;
  const pct = game.hs + game.as > 0 ? Math.round((game.hs / (game.hs + game.as)) * 100) : 50;

  return (
    <div onClick={() => navigate("/game/" + game.id)}
      className="bg-gray-900 border border-gray-800 rounded p-4 cursor-pointer hover:border-gray-600 transition-all duration-150 group">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] text-gray-500 font-bold tracking-[0.08em]">{game.arena}</span>
        <span className={clsx("text-[10px] font-bold tracking-[0.08em]", game.live ? "text-red" : "text-gray-500")}>
          {game.live ? `● ${game.status}` : game.status}
        </span>
      </div>
      <div className="space-y-2">
        {[["away", game.away, game.as, game.aRec, aWin], ["home", game.home, game.hs, game.hRec, hWin]].map(([side, abbr, score, rec, win]) => (
          <div key={side} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span onClick={(e) => { e.stopPropagation(); navigate("/team/" + abbr.toLowerCase()); }} className={clsx("font-display text-[17px] font-black tracking-wide cursor-pointer hover:text-accent transition-colors", win ? "text-white" : "text-gray-400")}>{abbr}</span>
              <span className="text-[10px] text-gray-600">{rec}</span>
            </div>
            <span className={clsx("font-display text-[26px] font-black leading-none", win ? "text-accent" : game.live ? "text-white" : "text-gray-300")}>
              {score}
            </span>
          </div>
        ))}
      </div>
      {(game.status === "FINAL" || game.live) && (
        <div className="mt-3 h-[2px] bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-accent/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      {game.home_win_prob !== undefined && game.away_win_prob !== undefined && (
        <div className="mt-3 bg-gray-950 p-2 rounded border border-gray-800">
          <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-gray-500 mb-1 uppercase">
            <span>{game.away} Prob {game.away_win_prob}%</span>
            <span className="text-accent">AI PREDICTION</span>
            <span>{game.home} Prob {game.home_win_prob}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-gray-500 transition-all" style={{ width: `${game.away_win_prob}%` }} />
            <div className="h-full bg-accent transition-all" style={{ width: `${game.home_win_prob}%` }} />
          </div>
        </div>
      )}
      {game.live && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between">
          <span onClick={(e) => { e.stopPropagation(); if (game.aLeader) navigate("/player/" + game.aLeader.split(' ')[1].toLowerCase()); }} className="text-[10px] text-gray-500 cursor-pointer hover:text-accent transition-colors">{game.aLeader}</span>
          <span onClick={(e) => { e.stopPropagation(); if (game.hLeader) navigate("/player/" + game.hLeader.split(' ')[1].toLowerCase()); }} className="text-[10px] text-gray-500 cursor-pointer hover:text-accent transition-colors">{game.hLeader}</span>
        </div>
      )}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-[10px] text-gray-700">{game.broadcast}</span>
        <span className="text-[10px] text-gray-700 group-hover:text-gray-500 transition-colors">Box Score →</span>
      </div>
    </div>
  );
}

function LeaderRow({ player, rank, max }) {
  const navigate = useNavigate();
  const barWidth = Math.round((player.val / max) * 100);
  return (
    <div onClick={() => navigate("/player/" + player.name.split(' ')[1].toLowerCase())} className="flex items-center gap-3 py-2.5 border-b border-gray-900 cursor-pointer group hover:bg-gray-900/40 rounded px-1 -mx-1 transition-colors">
      <span className={clsx("font-display text-[20px] font-black w-7 text-center", rank <= 3 ? "text-accent" : "text-gray-700")}>
        {rank}
      </span>
      <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-display text-[13px] font-black text-gray-400 flex-shrink-0">
        {player.init}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold truncate group-hover:text-accent transition-colors">{player.name}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{player.team} · {player.pos}</div>
      </div>
      <div className="w-24 h-[3px] bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${barWidth}%` }} />
      </div>
      <span className="font-display text-[22px] font-black text-white w-14 text-right">{player.val}</span>
    </div>
  );
}

function MiniStandRow({ team, rank, isPlayoffLine }) {
  const navigate = useNavigate();
  const pct = (team.w / (team.w + team.l)).toFixed(3).slice(1);
  const top = rank === 1;
  return (
    <div onClick={() => navigate("/team/" + team.t.toLowerCase())} className={clsx("flex justify-between items-center py-1.5 border-b text-[12px] cursor-pointer hover:bg-gray-900/50 transition-colors px-1",
      isPlayoffLine ? "border-accent/40" : "border-gray-900")}>
      <div className="flex items-center gap-2">
        <span className="text-gray-600 w-4 text-[11px]">{rank}</span>
        <span className={clsx("font-display font-black text-[14px] tracking-wide", top ? "text-accent" : "text-white")}>{team.t.toUpperCase()}</span>
        <span className="text-gray-600 text-[11px]">{team.w}-{team.l}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={clsx("font-bold text-[11px]", team.str.startsWith("W") ? "text-green" : "text-red")}>{team.str}</span>
        <span className="font-bold text-accent text-[11px] w-9 text-right">{pct}</span>
      </div>
    </div>
  );
}

const LEADER_TABS = [
  { key:"pts", label:"Points" },
  { key:"reb", label:"Rebounds" },
  { key:"ast", label:"Assists" },
  { key:"stl", label:"Steals" },
  { key:"blk", label:"Blocks" },
  { key:"ts",  label:"TS%" },
];

export default function Home() {
  const [leaderStat, setLeaderStat] = useState("pts");
  
  const [games, setGames] = useState([]);
  const [standings, setStandings] = useState({ EAST: [], WEST: [] });
  const [leaders, setLeaders] = useState({});
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/games`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/standings`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/leaders`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/injuries`).then(res => res.json())
    ]).then(([gamesData, standingsData, leadersData, injuriesData]) => {
      setGames(gamesData);
      setStandings(standingsData);
      setLeaders(leadersData);
      setInjuries(injuriesData);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch data", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl">Loading live NBA data...</div>;
  }

  const data = leaders[leaderStat] || [];
  const max  = data.length > 0 ? data[0].val : 1;

  const EAST = standings.EAST || [];
  const WEST = standings.WEST || [];
  const GAMES = games || [];
  const INJURIES = injuries || [];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-10">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="font-display text-[64px] md:text-[80px] font-black leading-[0.88] uppercase tracking-tight">
              NBA<br /><span className="text-accent">Analytics</span><br />Platform
            </div>
            <p className="mt-4 text-gray-400 text-sm max-w-lg leading-relaxed">
              Real-time scores · Advanced metrics · Shot quality models · Player comparisons. Every stat that matters, in one place.
            </p>
            <div className="flex gap-8 mt-8">
              {[["30","Teams"],["450+","Players"],["200+","Metrics"],["82","Games/Season"]].map(([v,l]) => (
                <div key={l}>
                  <div className="font-display text-[32px] font-black text-accent leading-none">{v}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Featured live game */}
          {GAMES.filter(g => g.live)[0] && (() => {
            const g = GAMES.filter(g => g.live)[0];
            return (
              <div onClick={() => window.location.href = "/game/" + g.id} className="w-full md:w-72 bg-black border border-gray-700 rounded p-5 flex-shrink-0 cursor-pointer hover:border-gray-600 transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-red font-black tracking-widest">● LIVE NOW</span>
                  <span className="text-[10px] text-gray-500 font-bold">{g.status}</span>
                </div>
                {/* Quarter scores */}
                <div className="grid grid-cols-5 text-center mb-4 border border-gray-800 rounded overflow-hidden">
                  {["","Q1","Q2","Q3","Q4"].map((q,i) => (
                    <div key={i} className="text-[10px] text-gray-600 font-bold py-1 border-r border-gray-800 last:border-r-0 bg-gray-900">{q}</div>
                  ))}
                  {[g.away, ...g.qtrs.a].map((v,i) => (
                    <div key={i} className={clsx("py-2 text-[12px] font-bold border-r border-gray-800 last:border-r-0", i===0?"font-display font-black text-gray-300":"text-gray-400")}>
                      {v || "—"}
                    </div>
                  ))}
                  {[g.home, ...g.qtrs.h].map((v,i) => (
                    <div key={i} className={clsx("py-2 text-[12px] font-bold border-r border-gray-800 last:border-r-0 bg-gray-900/50", i===0?"font-display font-black text-white":"text-gray-300")}>
                      {v || "—"}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-display text-[40px] font-black text-white leading-none">{g.as}</div>
                    <div className="font-display text-[15px] font-black text-gray-400 tracking-wide mt-1">{g.away}</div>
                  </div>
                  <div className="text-gray-700 font-display text-xl font-black">VS</div>
                  <div className="text-right">
                    <div className="font-display text-[40px] font-black text-accent leading-none">{g.hs}</div>
                    <div className="font-display text-[15px] font-black text-gray-300 tracking-wide mt-1">{g.home}</div>
                  </div>
                </div>
                {g.home_win_prob !== undefined && g.away_win_prob !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-400 mb-1.5 uppercase">
                      <span>{g.away_win_prob}%</span>
                      <span className="text-accent text-[9px]">LIVE AI PROJECTION</span>
                      <span className="text-white">{g.home_win_prob}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-gray-500 transition-all" style={{ width: `${g.away_win_prob}%` }} />
                      <div className="h-full bg-accent transition-all" style={{ width: `${g.home_win_prob}%` }} />
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-[11px] text-gray-500">
                  <span>{g.aLeader}</span>
                  <span>{g.hLeader}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row">
        {/* Main column */}
        <div className="flex-1 border-r border-gray-800">
          {/* Games */}
          <div className="p-6 border-b border-gray-800">
            <SectionHeader title="Recent & Live Games" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {GAMES.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </div>

          {/* Leaders */}
          <div className="p-6">
            <SectionHeader title="League Leaders" />
            <div className="flex border-b border-gray-800 mb-0 overflow-x-auto">
              {LEADER_TABS.map(t => (
                <button key={t.key} onClick={() => setLeaderStat(t.key)}
                  className={clsx("px-4 py-2.5 text-[11px] font-bold tracking-[0.09em] uppercase whitespace-nowrap border-b-2 -mb-px transition-all",
                    leaderStat === t.key ? "text-white border-accent" : "text-gray-500 border-transparent hover:text-gray-300")}>
                  {t.label}
                </button>
              ))}
            </div>
            <div>
              {data.slice(0,6).map((p,i) => <LeaderRow key={p.name} player={p} rank={i+1} max={max} />)}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          {/* East */}
          <div className="p-4 border-b border-gray-800">
            <div className="section-title mb-3">Eastern Conference</div>
            {EAST.map((t,i) => <MiniStandRow key={t.t} team={t} rank={i+1} isPlayoffLine={i===5} />)}
          </div>
          {/* West */}
          <div className="p-4 border-b border-gray-800">
            <div className="section-title mb-3">Western Conference</div>
            {WEST.map((t,i) => <MiniStandRow key={t.t} team={t} rank={i+1} isPlayoffLine={i===5} />)}
          </div>
          {/* Injuries */}
          <div className="p-4">
            <div className="section-title mb-3">Injury Report</div>
            {INJURIES.map(p => (
              <div key={p.name} className="flex justify-between items-center py-2 border-b border-gray-900">
                <div>
                  <div className="text-[13px] font-semibold">{p.name}</div>
                  <div className="text-[10px] text-gray-500">{p.team} · {p.injury}</div>
                </div>
                <div className="text-right">
                  <Badge label={p.status.toUpperCase()} variant={p.status} />
                  <div className="text-[10px] text-gray-600 mt-1">{p.return}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
