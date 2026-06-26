# 🏀 CourtIQ

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

CourtIQ is a premium, modern web dashboard for NBA enthusiasts. It tracks live game scores, team standings, league leaders, in-depth player statistics, team profiles, and shot quality metrics, bringing the entire basketball world into one sleek interface.

## 📺 Demo Video

[![CourtIQ Demo](https://img.youtube.com/vi/HlkzDIm6FhY/maxresdefault.jpg)](https://youtu.be/HlkzDIm6FhY?si=K12lAy-_k2NTURFR)

## 🚀 Features

- **Live Scoreboard**: Real-time updates of NBA games happening today.
- **Deep Player Profiles**: View detailed game logs, career stats, and advanced metrics (PER, TSP, VORP, Win Shares).
- **Advanced Team Analysis**: Access the famous Four Factors, offensive/defensive ratings, and current rosters.
- **League Standings & Leaders**: Dynamic tables tracking the best teams and players across various statistical categories.
- **Shot Quality & Compare**: Analyze shot charts and compare players side-by-side.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router

**Backend:**
- Python 3
- FastAPI
- SQLAlchemy
- `nba_api` package for real-time NBA data fetching
- PostgreSQL (NeonDB)

## 📦 Getting Started

### 1. Backend Setup
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder based on the provided `.env.example`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/courtiq
```

Seed the database with real NBA data:
```bash
python seed_db.py
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd courtiq
npm install
```

Create a `.env.local` file in the `courtiq` folder based on `.env.example`:
```env
VITE_API_URL=http://localhost:8000/api
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
