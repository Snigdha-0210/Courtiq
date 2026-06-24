import time
import logging
from database import SessionLocal, engine, Base
import models
from pipeline.nba_fetcher import fetch_live_games, fetch_standings, fetch_leaders, fetch_player_profile, fetch_top_players, fetch_all_teams_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# List of player IDs to fetch initially
# Stephen Curry, LeBron James, Nikola Jokic, Luka Doncic, Giannis Antetokounmpo
INITIAL_PLAYERS = {
    "curry": 201939,
    "lebron": 2544,
    "jokic": 203999,
    "luka": 1629029,
    "giannis": 203507
}

def seed_real_data():
    logger.info("Initializing Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        logger.info("Clearing old data...")
        db.query(models.Game).delete()
        db.query(models.Standing).delete()
        db.query(models.Leader).delete()
        db.query(models.PlayerProfile).delete()
        db.query(models.TeamProfile).delete()
        db.commit()

        logger.info("Fetching Live Games...")
        games = fetch_live_games()
        for g in games:
            db.add(models.Game(
                id=g["id"], home=g["home"], away=g["away"], hs=g["hs"], as_score=g["as_score"],
                status=g["status"], live=g["live"], arena=g["arena"], broadcast=g["broadcast"],
                hRec=g["hRec"], aRec=g["aRec"], hLeader=g["hLeader"], aLeader=g["aLeader"], qtrs=g["qtrs"]
            ))
        db.commit()
        time.sleep(1)

        logger.info("Fetching Standings...")
        standings = fetch_standings()
        for conf, teams in standings.items():
            for s in teams:
                db.add(models.Standing(
                    conference=conf, t=s["t"], city=s["city"], w=s["w"], l=s["l"],
                    home_rec=s["home_rec"], road_rec=s["road_rec"], l10=s["l10"], str_streak=s["str_streak"]
                ))
        db.commit()
        time.sleep(1)

        logger.info("Fetching Leaders...")
        leaders = fetch_leaders()
        for cat, items in leaders.items():
            for i in items:
                db.add(models.Leader(
                    category=cat, name=i["name"], team=i["team"], pos=i["pos"], init=i["init"], val=i["val"]
                ))
        db.commit()
        time.sleep(1)

        logger.info("Fetching Top 5 Player Profiles...")
        logger.info('Fetching top 40 players list...')
        top_players = fetch_top_players(limit=40)
        for key, pid in top_players.items():
            logger.info(f"  -> Fetching {key}...")
            profile = fetch_player_profile(key, pid)
            if profile:
                db.add(models.PlayerProfile(
                    player_key=profile.get("player_key"),
                    name=profile.get("name"), firstName=profile.get("firstName"), lastName=profile.get("lastName"),
                    number=profile.get("number"), pos=profile.get("pos"), team=profile.get("team"), teamAbbr=profile.get("teamAbbr"),
                    age=profile.get("age"), height=profile.get("height"), weight=profile.get("weight"), draft=profile.get("draft"),
                    college=profile.get("college"), salary=profile.get("salary"),
                    season=profile.get("season"), career=profile.get("career", []), gamelog=profile.get("gamelog", []),
                    splits=profile.get("splits", []), hustle=profile.get("hustle", {}), zones=profile.get("zones", []),
                    radar=profile.get("radar", {})
                ))
                db.commit()
            time.sleep(2) # Prevent rate limits

        logger.info("Fetching Team Profiles (Advanced Stats & Rosters)...")
        teams_data = fetch_all_teams_data()
        for t in teams_data:
            db.add(models.TeamProfile(
                team_id=t["team_id"],
                conference=t["conference"],
                seed=t["seed"],
                team=t["team"],
                city=t["city"],
                off_rtg=t["off_rtg"],
                def_rtg=t["def_rtg"],
                net_rtg=t["net_rtg"],
                pace=t["pace"],
                wins=t["wins"],
                losses=t["losses"],
                four_factors=t["four_factors"],
                roster=t["roster"]
            ))
        db.commit()

        logger.info("Database successfully seeded with real NBA data!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_real_data()
