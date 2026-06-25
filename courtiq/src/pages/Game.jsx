import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionHeader } from "../components/ui/SectionHeader";

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [boxscore, setBoxscore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/games/${gameId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setBoxscore(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch boxscore", err);
        setError("Failed to fetch boxscore.");
        setLoading(false);
      });
  }, [gameId]);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl">Loading boxscore...</div>;
  }

  if (error || !boxscore) {
    return (
      <div className="p-10">
        <div className="text-red font-bold mb-4">{error || "Boxscore not available."}</div>
        <button onClick={() => navigate(-1)} className="text-accent underline text-sm hover:text-white transition-colors">
          &larr; Back to Scoreboard
        </button>
      </div>
    );
  }

  const renderTable = (teamAbbr, players) => (
    <div className="mb-10">
      <div className="font-display text-[24px] font-black text-accent mb-4 tracking-wide">{teamAbbr} Box Score</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-[11px] uppercase tracking-wider">
              <th className="pb-3 pr-4 font-bold">Player</th>
              <th className="pb-3 px-3 font-bold text-center">Pos</th>
              <th className="pb-3 px-3 font-bold text-right text-white">Pts</th>
              <th className="pb-3 px-3 font-bold text-right">Reb</th>
              <th className="pb-3 px-3 font-bold text-right">Ast</th>
              <th className="pb-3 px-3 font-bold text-right">FGM-A</th>
              <th className="pb-3 pl-3 font-bold text-right">Mins</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {players.map(p => (
              <tr key={p.name} className="hover:bg-gray-900/40 transition-colors">
                <td className="py-3 pr-4 font-semibold text-white">{p.name}</td>
                <td className="py-3 px-3 text-gray-500 text-center font-mono text-xs">{p.pos}</td>
                <td className="py-3 px-3 font-black text-accent text-right">{p.pts}</td>
                <td className="py-3 px-3 text-gray-400 text-right">{p.reb}</td>
                <td className="py-3 px-3 text-gray-400 text-right">{p.ast}</td>
                <td className="py-3 px-3 text-gray-400 text-right">{p.fgm}-{p.fga}</td>
                <td className="py-3 pl-3 text-gray-500 text-right">{p.mins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-20">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-8">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition-colors text-sm">
            &larr; Back
          </button>
          <div className="font-display text-[40px] font-black uppercase tracking-tight text-white leading-none">
            Game Detail
          </div>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto p-6 mt-4">
        {renderTable(boxscore.away, boxscore.awayPlayers)}
        {renderTable(boxscore.home, boxscore.homePlayers)}
      </div>
    </div>
  );
}
