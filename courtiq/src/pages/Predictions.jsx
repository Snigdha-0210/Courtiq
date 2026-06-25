import { useState, useEffect } from "react";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/predictions`)
      .then(res => res.json())
      .then(data => {
        setPredictions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch predictions", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-white font-display text-xl animate-pulse">Running ML Models...</div>;
  }

  return (
    <div className="animate-fade-in max-w-screen-xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-display text-5xl font-black text-white uppercase tracking-tight">AI Predictions</h1>
        <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Powered by XGBoost • Projecting next game stats based on historical data</p>
      </div>

      {/* Game Predictor Section */}
      <GamePredictor />

      <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight mb-6 mt-12 border-b border-gray-800 pb-2">Player Projections & Ratings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predictions.map((p) => {
          const { actual, projected } = p;
          
          const diffPts = (projected.proj_pts - actual.pts).toFixed(1);
          const diffReb = (projected.proj_reb - actual.reb).toFixed(1);
          const diffAst = (projected.proj_ast - actual.ast).toFixed(1);

          return (
            <div key={p.player_key} className="bg-gray-900 border border-gray-800 rounded p-6 hover:border-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                  <div className="text-[10px] text-accent font-black tracking-[0.14em] uppercase mb-1">{p.team}</div>
                  <div className="font-display text-2xl font-black text-white leading-none uppercase">{p.name}</div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">{p.pos}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[9px] text-gray-500 tracking-widest uppercase mb-1">CourtIQ Rtg</div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent flex items-center justify-center font-display text-lg font-black text-white">
                    {projected.courtiq_rating}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <StatRow label="PTS" proj={projected.proj_pts} actual={actual.pts} diff={diffPts} />
                <StatRow label="REB" proj={projected.proj_reb} actual={actual.reb} diff={diffReb} />
                <StatRow label="AST" proj={projected.proj_ast} actual={actual.ast} diff={diffAst} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GamePredictor() {
  const [homeTeam, setHomeTeam] = useState("LAKERS");
  const [awayTeam, setAwayTeam] = useState("CELTICS");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/games/predict/${homeTeam}/${awayTeam}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-6 mb-12">
      <h3 className="font-display text-xl font-black text-white uppercase tracking-tight mb-4">Matchup Predictor</h3>
      <div className="flex items-center gap-4">
        <input 
          type="text" 
          value={homeTeam} 
          onChange={e => setHomeTeam(e.target.value.toUpperCase())}
          className="bg-black border border-gray-700 text-white p-2 rounded w-24 text-center font-bold"
          placeholder="HOME"
        />
        <span className="text-gray-500 font-bold">VS</span>
        <input 
          type="text" 
          value={awayTeam} 
          onChange={e => setAwayTeam(e.target.value.toUpperCase())}
          className="bg-black border border-gray-700 text-white p-2 rounded w-24 text-center font-bold"
          placeholder="AWAY"
        />
        <button 
          onClick={predict}
          className="bg-accent text-black font-black uppercase tracking-widest px-6 py-2 rounded hover:bg-white transition-colors"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {result && !result.error && (
        <div className="mt-6 p-4 bg-black border border-gray-800 rounded flex gap-8 items-center">
          <div className="flex-1 text-center">
            <div className="text-sm text-gray-500 tracking-widest mb-1">{result.home_team_id} (HOME)</div>
            <div className={`font-display text-4xl font-black ${result.predicted_winner === result.home_team_id ? 'text-green-400' : 'text-white'}`}>
              {result.home_win_prob}%
            </div>
          </div>
          <div className="text-gray-600 font-black">WIN PROB</div>
          <div className="flex-1 text-center">
            <div className="text-sm text-gray-500 tracking-widest mb-1">{result.away_team_id} (AWAY)</div>
            <div className={`font-display text-4xl font-black ${result.predicted_winner === result.away_team_id ? 'text-green-400' : 'text-white'}`}>
              {result.away_win_prob}%
            </div>
          </div>
        </div>
      )}
      {result && result.error && (
        <div className="mt-4 text-red-400 text-sm">Error: {result.error}. Make sure you use team names like LAKERS, CELTICS.</div>
      )}
    </div>
  );
}

function StatRow({ label, proj, actual, diff }) {
  const isOver = parseFloat(diff) > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="w-12 text-[11px] text-gray-500 font-bold tracking-widest">{label}</div>
      
      <div className="flex-1 px-4">
        <div className="text-[10px] text-gray-600 mb-1">PROJ</div>
        <div className="font-display text-2xl font-black text-white">{proj.toFixed(1)}</div>
      </div>
      
      <div className="w-20 text-right">
        <div className="text-[10px] text-gray-600 mb-1">AVG</div>
        <div className="font-display text-lg font-bold text-gray-400">{actual.toFixed(1)}</div>
      </div>

      <div className="w-16 text-right">
        <div className={`text-xs font-bold ${isOver ? 'text-green-400' : 'text-red-400'}`}>
          {isOver ? '+' : ''}{diff}
        </div>
      </div>
    </div>
  );
}
