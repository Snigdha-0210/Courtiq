import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Ticker from "./components/ui/Ticker";
import Home        from "./pages/Home";
import Player      from "./pages/Player";
import Team        from "./pages/Team";
import Standings   from "./pages/Standings";
import Leaders     from "./pages/Leaders";
import ShotQuality from "./pages/ShotQuality";
import Compare     from "./pages/Compare";
import Predictions from "./pages/Predictions";
import Game        from "./pages/Game";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-[56px]">
        <Ticker />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/player"   element={<Player />} />
          <Route path="/team"     element={<Team />} />
          <Route path="/team/:teamId" element={<Team />} />
          <Route path="/standings"element={<Standings />} />
          <Route path="/leaders"  element={<Leaders />} />
          <Route path="/xpts"     element={<ShotQuality />} />
          <Route path="/compare"  element={<Compare />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
