import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "../components/ui/Tabs";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import CourtMap from "../components/court/CourtMap";
import TrendChart from "../components/charts/TrendChart";
import clsx from "clsx";

const TABS = [
  { key:"overview",  label:"Overview" },
  { key:"shotchart", label:"Shot Chart" },
  { key:"gamelog",   label:"Game Log" },
  { key:"advanced",  label:"Advanced" },
  { key:"hustle",    label:"Hustle" },
  { key:"splits",    label:"Splits" },
  { key:"career",    label:"Career" },
];

const RATING_VARIANT = { ELITE:"elite", GOOD:"good", AVG:"avg", POOR:"poor" };

export default function Player() {
  const { id } = useParams();
  const playerId = id || "curry";
  const [tab, setTab] = useState("overview");
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/players/${playerId}`)
      .then(res => res.json())
      .then(data => {
        setPlayerData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch player", err);
        setLoading(false);
      });
  }, [playerId]);

  if (loading || !playerData) {
    return <div className="p-10 text-white font-display text-xl">Loading player profile...</div>;
  }

  const p = playerData;
  const s = p.season || {};

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Jersey number */}
          <div className="font-display text-[100px] font-black text-gray-800 leading-none select-none flex-shrink-0">
            #{p.number}
          </div>
          {/* Name + quick stats */}
          <div className="flex-1">
            <div className="text-[11px] text-accent font-black tracking-[0.14em] uppercase mb-1">
              {p.pos} · {p.team}
            </div>
            <div className="font-display text-[52px] md:text-[64px] font-black uppercase leading-[0.9] tracking-tight">
              {p.firstName}<br />{p.lastName}
            </div>
            <div className="flex flex-wrap gap-6 mt-5">
              {[["PPG",s.pts],["RPG",s.reb],["APG",s.ast],["FG%",s.fgp+"%"],["3P%",s.fg3p+"%"],["TS%",s.tsp+"%"],["PER",s.per]].map(([l,v]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-[28px] font-black leading-none text-white">{v}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.1em] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Bio */}
          <div className="bg-black border border-gray-800 rounded p-4 min-w-[160px] flex-shrink-0">
            {[["Age",p.age],["Height",p.height],["Weight",p.weight],["Draft",p.draft],["College",p.college],["Salary",p.salary],["Win Shares",s.ws],["VORP",s.vorp],["Off Rtg",s.ortg],["Def Rtg",s.drtg]].map(([l,v]) => (
              <div key={l} className="flex justify-between gap-4 py-1.5 border-b border-gray-900 last:border-b-0 text-[12px]">
                <span className="text-gray-500">{l}</span>
                <span className="font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="max-w-screen-xl mx-auto" />

      <div className="max-w-screen-xl mx-auto p-6">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="section-title mb-4">2024-25 Season Averages</div>
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Stat","Value","Rank","Career Avg"].map(h => (
                      <th key={h} className={clsx("pb-2 text-[10px] text-gray-500 uppercase tracking-[0.1em] font-bold", h==="Stat"?"text-left":"text-right")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["Points",s.pts,"8th","24.8"],["Rebounds",s.reb,"—","4.6"],["Assists",s.ast,"—","6.5"],["FG%",s.fgp+"","—","47.3"],["3P%",s.fg3p+"","2nd","42.8"],["FT%",s.ftp+"","3rd","90.8"],["True Shooting%",s.tsp+"","5th","63.1"],["Usage Rate",s.usage+"","—","29.1"],["Turnovers",s.tov+"","—","3.1"],["+/-","+"+s.pm,"4th","—"]].map(([label,val,rank,career]) => (
                    <tr key={label} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                      <td className="py-2.5 font-medium">{label}</td>
                      <td className="py-2.5 text-right font-bold text-accent">{val}</td>
                      <td className="py-2.5 text-right text-gray-500">{rank}</td>
                      <td className="py-2.5 text-right text-gray-400">{career}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <div className="section-title mb-4">Monthly PPG Trend</div>
              <div className="bg-gray-900 border border-gray-800 rounded p-4">
                <TrendChart />
                <div className="flex gap-4 mt-3">
                  {[["#E8FF47","Actual PPG"],["#666","Expected PPG (xPTS)"]].map(([c,l]) => (
                    <div key={l} className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span className="w-4 h-0.5 inline-block rounded" style={{ background: c }} />{l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHOT CHART */}
        {tab === "shotchart" && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CourtMap zones={p.zones} />
            <div>
              <div className="section-title mb-4">Zone Breakdown</div>
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-800">
                    {["Zone","FGA","FG%","xFG%","Pts/Shot","Rating"].map((h,i) => (
                      <th key={h} className={clsx("pb-2 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold", i===0?"text-left":"text-right")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.zones.map(z => (
                    <tr key={z.zone} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                      <td className="py-2.5 font-medium">{z.zone}</td>
                      <td className="py-2.5 text-right text-gray-400">{z.fga}</td>
                      <td className="py-2.5 text-right font-bold">{z.fgp}%</td>
                      <td className="py-2.5 text-right text-gray-400">{z.xfgp}%</td>
                      <td className={clsx("py-2.5 text-right font-bold", z.pps > 1.1 ? "text-accent" : z.pps > 0.85 ? "text-white" : "text-red/80")}>{z.pps}</td>
                      <td className="py-2.5 text-right">
                        <Badge label={z.rating} variant={RATING_VARIANT[z.rating]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GAME LOG */}
        {tab === "gamelog" && (
          <div className="animate-fade-in overflow-x-auto">
            <div className="section-title mb-4">2024-25 Game Log</div>
            <table className="w-full text-[12px] border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Date","OPP","RES","MIN","PTS","REB","AST","FGM-A","3PM-A","FTM-A","STL","BLK","TOV","+/-"].map((h,i) => (
                    <th key={h} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold whitespace-nowrap", i<3?"text-left":"text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.gamelog.map((g,i) => (
                  <tr key={i} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                    <td className="py-2.5 text-gray-400">{g.date}</td>
                    <td className="py-2.5 font-display font-bold tracking-wide">{g.opp}</td>
                    <td className={clsx("py-2.5 font-bold", g.res==="W"?"text-green":"text-red")}>{g.res}</td>
                    <td className="py-2.5 text-right text-gray-400">{g.min}</td>
                    <td className="py-2.5 text-right font-bold text-accent">{g.pts}</td>
                    <td className="py-2.5 text-right">{g.reb}</td>
                    <td className="py-2.5 text-right">{g.ast}</td>
                    <td className="py-2.5 text-right text-gray-400">{g.fgm}-{g.fga}</td>
                    <td className="py-2.5 text-right text-gray-400">{g.fg3m}-{g.fg3a}</td>
                    <td className="py-2.5 text-right text-gray-400">{g.ftm}-{g.fta}</td>
                    <td className="py-2.5 text-right">{g.stl}</td>
                    <td className="py-2.5 text-right">{g.blk}</td>
                    <td className="py-2.5 text-right text-red/80">{g.tov}</td>
                    <td className={clsx("py-2.5 text-right font-bold", g.pm>0?"text-green":"text-red")}>{g.pm>0?"+":""}{g.pm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ADVANCED */}
        {tab === "advanced" && (
          <div className="animate-fade-in">
            <div className="section-title mb-4">Advanced Metrics — 2024-25</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard label="PER" value={s.per} sub="League avg: 15.0" accentBorder valueColor="text-green" />
              <StatCard label="True Shooting %" value={s.tsp+"%"} sub="Top 5 in league" />
              <StatCard label="Usage Rate" value={s.usage+"%"} sub="Moderate-high usage" />
              <StatCard label="Win Shares" value={s.ws} sub="Top 10 in league" valueColor="text-green" />
              <StatCard label="VORP" value={s.vorp} sub="All-Star caliber" valueColor="text-green" />
              <StatCard label="BPM" value={"+"+s.bpm} sub="Excellent impact" valueColor="text-green" />
              <StatCard label="Off Rating" value={s.ortg} sub="+8.1 vs league avg" accentBorder />
              <StatCard label="Def Rating" value={s.drtg} sub="Near average" />
              <StatCard label="Net Rating" value={"+5.8"} sub="Elite two-way impact" valueColor="text-green" accentBorder />
              <StatCard label="Turnovers/G" value={s.tov} sub="Manageable for usage" />
              <StatCard label="+/-" value={"+"+s.pm} sub="Per 100 possessions" valueColor="text-accent" />
              <StatCard label="3P Attempts/G" value="8.4" sub="Volume 3-point shooter" />
            </div>
          </div>
        )}

        {/* HUSTLE */}
        {tab === "hustle" && (
          <div className="animate-fade-in">
            <div className="section-title mb-4">Hustle Stats — 2024-25</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ["Contested Shots",p.hustle.contested,"Per game"],
                ["Deflections",p.hustle.deflections,"Per game"],
                ["Loose Balls Rec.",p.hustle.looseBalls,"Per game"],
                ["Charges Drawn",p.hustle.charges,"Per game"],
                ["Screen Assists",p.hustle.screenAssists,"Per game"],
                ["Box Outs",p.hustle.boxOuts,"Per game"],
                ["Miles / Game",p.hustle.miles,"Distance covered"],
                ["Avg Speed (mph)",p.hustle.speed,"On court"],
              ].map(([l,v,s]) => (
                <StatCard key={l} label={l} value={v} sub={s} />
              ))}
            </div>
          </div>
        )}

        {/* SPLITS */}
        {tab === "splits" && (
          <div className="animate-fade-in overflow-x-auto">
            <div className="section-title mb-4">Splits — 2024-25</div>
            <table className="w-full text-[12px] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Split","GP","PTS","REB","AST","FG%","3P%","TS%"].map((h,i) => (
                    <th key={h} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold", i===0?"text-left":"text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.splits.map(sp => (
                  <tr key={sp.label} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                    <td className="py-2.5 font-medium">{sp.label}</td>
                    <td className="py-2.5 text-right text-gray-400">{sp.gp}</td>
                    <td className="py-2.5 text-right font-bold text-accent">{sp.pts}</td>
                    <td className="py-2.5 text-right">{sp.reb}</td>
                    <td className="py-2.5 text-right">{sp.ast}</td>
                    <td className="py-2.5 text-right">{sp.fgp}%</td>
                    <td className="py-2.5 text-right">{sp.fg3p}%</td>
                    <td className="py-2.5 text-right font-bold">{sp.tsp}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CAREER */}
        {tab === "career" && (
          <div className="animate-fade-in overflow-x-auto">
            <div className="section-title mb-4">Career Statistics</div>
            <table className="w-full text-[12px] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Season","GP","PTS","REB","AST","FG%","3P%","FT%","TS%","PER"].map((h,i) => (
                    <th key={h} className={clsx("pb-2.5 text-[10px] text-gray-500 uppercase tracking-[0.08em] font-bold", i===0?"text-left":"text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.career.map(c => (
                  <tr key={c.season} className={clsx("border-b border-gray-900 hover:bg-gray-900/50 transition-colors", c.season==="2024-25"?"bg-gray-900/30":"")}>
                    <td className={clsx("py-2.5 font-bold", c.season==="2024-25"?"text-accent":"")}>{c.season}</td>
                    <td className="py-2.5 text-right text-gray-400">{c.gp}</td>
                    <td className="py-2.5 text-right font-bold">{c.pts}</td>
                    <td className="py-2.5 text-right">{c.reb}</td>
                    <td className="py-2.5 text-right">{c.ast}</td>
                    <td className="py-2.5 text-right">{c.fgp}</td>
                    <td className="py-2.5 text-right">{c.fg3p}</td>
                    <td className="py-2.5 text-right">{c.ftp}</td>
                    <td className="py-2.5 text-right font-bold">{c.tsp}</td>
                    <td className="py-2.5 text-right text-accent font-bold">{c.per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
