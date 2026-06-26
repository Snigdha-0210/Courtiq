import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { label: "Scoreboard", path: "/" },
  { label: "Players",    path: "/player" },
  { label: "Teams",      path: "/team" },
  { label: "Standings",  path: "/standings" },
  { label: "Leaders",    path: "/leaders" },
  { label: "Shot Quality", path: "/xpts" },
  { label: "Compare",    path: "/compare" },
  { label: "Predictions",path: "/predictions" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-black border-b border-gray-800 flex items-center px-6 gap-0">
      {/* Logo */}
      <div
        className="font-display text-[22px] font-black tracking-[0.06em] text-white mr-10 cursor-pointer flex-shrink-0"
        onClick={() => navigate("/")}
      >
        COURT<span className="text-accent">IQ</span>
      </div>

      {/* Nav links */}
      <div className="flex flex-1 overflow-x-auto no-scrollbar">
        {NAV_LINKS.map((l) => {
          const active = location.pathname === l.path || (l.path !== "/" && location.pathname.startsWith(l.path));
          return (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={clsx(
                "px-4 h-[56px] text-[11px] font-bold tracking-[0.09em] uppercase whitespace-nowrap border-b-2 transition-all duration-150 flex-shrink-0",
                active
                  ? "text-white border-accent"
                  : "text-gray-500 border-transparent hover:text-white"
              )}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded px-3 py-1.5">
            <Search size={12} className="text-gray-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  navigate(`/player/${search.trim().toLowerCase()}`);
                  setSearchOpen(false);
                  setSearch("");
                }
              }}
              placeholder="Search player (e.g. james, luka)..."
              className="bg-transparent text-white text-xs w-56 placeholder-gray-600 outline-none"
            />
            <button onClick={() => { setSearchOpen(false); setSearch(""); }}>
              <X size={12} className="text-gray-500 hover:text-white transition-colors" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Search size={16} />
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-red/10 border border-red/30 px-2.5 py-1 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot" />
          <span className="text-red text-[10px] font-bold tracking-[0.1em]">LIVE</span>
        </div>
      </div>
    </nav>
  );
}
