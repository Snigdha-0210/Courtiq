# CourtIQ: NBA Analytics Platform Overview

Here is the comprehensive technical, non-technical, and thematic overview of CourtIQ for the AQX Sports Analytics Hackathon presentation. 

## 1. Non-Technical Overview (The "Elevator Pitch")
**Project Name:** CourtIQ  
**Team:** Ashok P. (Frontend) & Snigdha Gorai (Backend/Data/ML)

**The Problem:** 
Traditional sports dashboards are cluttered, slow, and lack actionable, advanced insights. Fans and analysts often have to switch between multiple platforms to see live scores, player stats, and advanced analytical models (like shot quality).

**The Solution:** 
CourtIQ is a premium, real-time NBA analytics platform designed to bridge the gap between basic box scores and advanced basketball analytics. It provides a highly visual, lightning-fast dashboard that delivers live game tracking, expected points (xPTS) models, shot charts, and league-wide leaderboards all in one unified, sleek interface.

**Key Features:**
- **Live Game Tracking:** Real-time scoreboard with quarter-by-quarter breakdowns, live win-probability bars, and immediate game status.
- **Advanced Shot Analytics:** We don't just show if a shot went in; we calculate the "Expected Field Goal Percentage" (xFG%) and "Expected Points" (xPTS) based on shot location (e.g., Restricted Area vs. Above the Break 3) to analyze shot quality.
- **League Context:** Instant access to Conference Standings, League Leaders across statistical categories, and live Injury Reports.
- **Immersive Visuals:** Interactive shot charts and dynamic data visualizations that make understanding complex metrics intuitive.

---

## 2. Technical Overview (Architecture & Stack)

**Frontend (Client-Side)**
- **Framework:** React + Vite
- **Styling:** Vanilla CSS + Tailwind CSS
- **Data Visualization:** Recharts (for dynamic graphs and shot charts)
- **Routing:** React Router DOM (Single Page Application architecture)
- **Key Concepts:** Uses React's `useEffect` and `Promise.all` for parallel data fetching, ensuring the dashboard populates simultaneously. Implements conditional rendering and dynamic CSS classes (`clsx`) for real-time UI updates (e.g., live game indicators).

**Backend (Server-Side)**
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (Hosted on Neon serverless DB)
- **ORM:** SQLAlchemy
- **Data Pipeline:** Uses `nba_api` (official NBA stats API endpoints) and `BeautifulSoup` for data ingestion.
- **Background Tasks:** APScheduler runs asynchronous background jobs. It pulls live NBA game data every 30 seconds and league standings/leaders every hour, ensuring the API responds instantly (cache-like behavior) rather than fetching from the NBA API on every user request.
- **Machine Learning / Analytics Engine:** Uses `pandas` and `numpy` to process raw shot data. Implements a heuristic Expected Points (xPTS) model that calculates shot probability based on coordinate zones (e.g., 65% in the restricted area vs. 35% above the break).

**Infrastructure & Deployment**
- **Database Hosting:** Neon Tech (AWS ap-southeast-1 pooler)
- **Version Control:** GitHub

---

## 3. Design Theme & Aesthetics

CourtIQ was built with a **Premium, Modern Dark-Mode Glassmorphism** aesthetic to ensure the platform feels like a state-of-the-art sports broadcasting tool. 

**Color Palette:**
- **Background:** Deep Blacks (`#000000`) and rich Charcoal Grays (`#111111` to `#1A1A1A`) to reduce eye strain and make the data "pop".
- **Accent Color:** Neon Yellow/Lime (`#E8FF47`). Used sparingly but effectively to draw attention to critical data points, active tabs, and live score highlights.
- **Secondary Status Colors:** Bright Red (`#FF3B3B`) for "LIVE" indicators and Green (`#00C853`) for positive states.

**Typography:**
- **Display Font:** *Barlow Condensed* (sans-serif). Used for massive, impactful numbers (like scores) and uppercase headers. It mimics the typography seen on actual NBA arena scoreboards.
- **Body Font:** *Inter* (sans-serif). Used for dense statistical tables to ensure maximum legibility and clean data alignment.

**UI Elements & Micro-interactions:**
- **Minimalist Data Presentation:** Avoids heavy grid lines. Uses subtle background row striping and spacing to separate data.
- **Dynamic Feedback:** Hover effects on game cards and table rows, smooth CSS transitions (`150ms`) when switching leaderboards, and progress-bar style visualizers for live game score differentials.

---

## 4. Key Talking Points for the Judges

If asked about the technical difficulty or unique aspects of the project, highlight the following:

1. **The Architecture Choice:** Emphasize that you built a decoupled architecture. Instead of the frontend querying the NBA API directly (which is slow and rate-limits heavily), you built a background scheduler that constantly syncs NBA data into your own Postgres database. This makes the frontend load in milliseconds.
2. **Advanced Analytics (xPTS):** Point out that CourtIQ doesn't just display basic box scores. By implementing the expected points (xPTS) model using Pandas, you are providing *predictive* insights into shot quality, which is the core of modern sports analytics.
3. **The Design:** Mention that you actively avoided generic dashboard templates (like basic Bootstrap). You built a custom design system tailored specifically for sports data consumption, prioritizing data density without sacrificing aesthetics.
