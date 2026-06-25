from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import time
from functools import wraps
from fastapi.encoders import jsonable_encoder

from database import engine, Base, get_db
import models
import schemas
from scheduler import start_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    scheduler = start_scheduler()
    yield
    # Shutdown:
    scheduler.shutdown()

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NBA Dashboard API (Frontend-Driven)", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def ttl_cache(ttl_seconds: int = 20):
    def decorator(func):
        cache = {}
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = func.__name__
            now = time.time()
            if key in cache:
                val, ts = cache[key]
                if now - ts < ttl_seconds:
                    return val
            res = func(*args, **kwargs)
            encoded = jsonable_encoder(res)
            cache[key] = (encoded, now)
            return encoded
        return wrapper
    return decorator

@app.get("/api/games", response_model=List[schemas.GameSchema])
@ttl_cache(ttl_seconds=15)
def get_games(db: Session = Depends(get_db)):
    return db.query(models.Game).all()

@app.get("/api/games/{game_id}")
def get_game_boxscore(game_id: str):
    from pipeline.nba_fetcher import fetch_boxscore
    # nba_api expects a 10-digit game_id (e.g. "0042300226")
    # The frontend passes the integer ID (e.g. "42300226")
    padded_game_id = game_id.zfill(10)
    box = fetch_boxscore(padded_game_id)
    if box:
        return box
    return {"error": "Failed to fetch boxscore"}

@app.get("/api/standings", response_model=schemas.StandingsResponse)
@ttl_cache(ttl_seconds=60)
def get_standings(db: Session = Depends(get_db)):
    east = db.query(models.Standing).filter(models.Standing.conference == "EAST").all()
    west = db.query(models.Standing).filter(models.Standing.conference == "WEST").all()
    return {"EAST": east, "WEST": west}

@app.get("/api/leaders", response_model=Dict[str, List[schemas.LeaderSchema]])
@ttl_cache(ttl_seconds=60)
def get_leaders(db: Session = Depends(get_db)):
    leaders = db.query(models.Leader).all()
    
    # Group leaders by category (pts, reb, ast...)
    leader_dict = {}
    for leader in leaders:
        cat = leader.category
        if cat not in leader_dict:
            leader_dict[cat] = []
        leader_dict[cat].append(leader)
        
    return leader_dict

@app.get("/api/injuries", response_model=List[schemas.InjurySchema])
@ttl_cache(ttl_seconds=60)
def get_injuries(db: Session = Depends(get_db)):
    return db.query(models.Injury).all()

@app.get("/api/players", response_model=Dict[str, schemas.PlayerProfileSchema])
@ttl_cache(ttl_seconds=60)
def get_all_players(db: Session = Depends(get_db)):
    profiles = db.query(models.PlayerProfile).all()
    return {p.player_key: p for p in profiles}

@app.get("/api/players/{player_key}", response_model=schemas.PlayerProfileSchema)
@ttl_cache(ttl_seconds=60)
def get_player(player_key: str, db: Session = Depends(get_db)):
    return db.query(models.PlayerProfile).filter(models.PlayerProfile.player_key == player_key).first()

@app.get("/api/teams", response_model=Dict[str, schemas.TeamProfileSchema])
@ttl_cache(ttl_seconds=60)
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(models.TeamProfile).all()
    return {t.team_id: t for t in teams}

@app.get("/api/teams/{team_id}", response_model=schemas.TeamProfileSchema)
@ttl_cache(ttl_seconds=60)
def get_team(team_id: str, db: Session = Depends(get_db)):
    return db.query(models.TeamProfile).filter(models.TeamProfile.team_id == team_id).first()

@app.get("/api/compare", response_model=Dict[str, schemas.PlayerProfileSchema])
@ttl_cache(ttl_seconds=60)
def get_compare(db: Session = Depends(get_db)):
    # For now, just returning all player profiles as comparison target
    profiles = db.query(models.PlayerProfile).all()
    return {p.player_key: p for p in profiles}

@app.post("/api/simulate")
def simulate_xpts(request: Dict[str, Any]):
    # The 'What If' simulator
    return {"projected_ppg": 25.5}
