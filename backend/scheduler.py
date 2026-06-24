from apscheduler.schedulers.background import BackgroundScheduler
from pipeline.nba_fetcher import fetch_live_games, fetch_standings, fetch_leaders
from database import SessionLocal
import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_live_games():
    """Fetches live games and updates the database."""
    logger.info("Running job: Update Live Games")
    games = fetch_live_games()
    
    db = SessionLocal()
    try:
        # Clear current games and replace with the latest state
        db.query(models.Game).delete()
        
        for g in games:
            db.add(models.Game(
                id=g["id"], home=g["home"], away=g["away"], hs=g["hs"], as_score=g["as_score"],
                status=g["status"], live=g["live"], arena=g["arena"], broadcast=g["broadcast"],
                hRec=g["hRec"], aRec=g["aRec"], hLeader=g["hLeader"], aLeader=g["aLeader"], qtrs=g["qtrs"]
            ))
        db.commit()
        logger.info(f"Updated {len(games)} live games.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update games: {e}")
    finally:
        db.close()

def update_standings():
    logger.info("Running job: Update Standings")
    standings = fetch_standings()
    db = SessionLocal()
    try:
        db.query(models.Standing).delete()
        for conf, teams in standings.items():
            for s in teams:
                db.add(models.Standing(
                    conference=conf, t=s["t"], city=s["city"], w=s["w"], l=s["l"],
                    home_rec=s["home_rec"], road_rec=s["road_rec"], l10=s["l10"], str_streak=s["str_streak"]
                ))
        db.commit()
        logger.info("Updated standings.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update standings: {e}")
    finally:
        db.close()

def update_leaders():
    logger.info("Running job: Update Leaders")
    leaders = fetch_leaders()
    db = SessionLocal()
    try:
        db.query(models.Leader).delete()
        for cat, items in leaders.items():
            for i in items:
                db.add(models.Leader(
                    category=cat, name=i["name"], team=i["team"], pos=i["pos"], init=i["init"], val=i["val"]
                ))
        db.commit()
        logger.info("Updated leaders.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update leaders: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    
    # Live Games: Every 30 seconds
    scheduler.add_job(update_live_games, 'interval', seconds=30)
    
    # Standings & Leaders: Every 1 hour
    scheduler.add_job(update_standings, 'interval', hours=1)
    scheduler.add_job(update_leaders, 'interval', hours=1)
    
    scheduler.start()
    logger.info("Background scheduler started.")
    return scheduler
