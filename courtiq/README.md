# CourtIQ — NBA Analytics Platform

A professional, full-featured NBA analytics dashboard built with React + Vite + Tailwind CSS.

## Features

- **Live Scoreboard** — Today's games with real-time scores, quarter breakdowns, team leaders, and winner bars
- **Live Ticker** — Auto-scrolling score ticker at the top of every page
- **Player Profiles** — 7-tab deep-dive: Overview, Shot Chart, Game Log, Advanced Metrics, Hustle Stats, Splits, Career
- **Shot Quality (xPTS)** — ML-powered expected points model with interactive court heatmap, zone breakdown, and What-If simulator
- **Standings** — Full East/West standings with W/L/PCT/GB/Home/Road/L10/Streak and playoff cutline
- **League Leaders** — 8-stat leaderboard (PTS/REB/AST/STL/BLK/TS%/3PM/PER) with podium display
- **Team Dashboard** — Four Factors, team metrics, and full roster
- **Player Compare** — Head-to-head stat comparison with radar chart and edge summary

## Tech Stack

- React 18 + Vite
- Tailwind CSS (custom NBA black/white/accent theme)
- React Router DOM
- Recharts (line charts)
- Lucide React (icons)
- Framer Motion (animations)

## Getting Started

```bash
npm install
npm run dev
```

## Backend (Coming Next)
- FastAPI (Python) for live data via `nba_api`
- XGBoost xPTS model
- Deployed on Render (free tier)

## Deployment (Frontend)
- Vercel (free tier) — push to GitHub and connect

## Data Sources
- nba_api (Python) → nba.com official stats
- Basketball Reference → advanced metrics
- NBA Tracking data → defender distance, shot clock
