import { GAMES } from "../../data/nba";

export default function Ticker() {
  const items = [...GAMES, ...GAMES];
  return (
    <div className="h-[36px] bg-gray-900 border-b border-gray-800 flex items-center overflow-hidden">
      <div className="bg-accent text-black text-[10px] font-black tracking-[0.14em] uppercase px-3 h-full flex items-center flex-shrink-0">
        TODAY
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-ticker">
          {items.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 h-[36px] border-r border-gray-800 whitespace-nowrap cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <span className="font-display font-bold text-[13px] tracking-wide text-gray-300">{g.away}</span>
              <span className="font-display font-black text-[13px]">{g.as}</span>
              <span className={`text-[10px] font-bold tracking-widest ${g.live ? "text-red" : "text-gray-500"}`}>
                {g.live ? `● ${g.status}` : g.status}
              </span>
              <span className="font-display font-black text-[13px]">{g.hs}</span>
              <span className="font-display font-bold text-[13px] tracking-wide text-gray-300">{g.home}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
