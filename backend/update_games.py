import logging
from database import SessionLocal
import models
from pipeline.nba_fetcher import fetch_live_games

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Updating live games only...")
    games = fetch_live_games()
    db = SessionLocal()
    try:
        db.query(models.Game).delete()
        for g in games:
            db.add(models.Game(
                id=g["id"], home=g["home"], away=g["away"], hs=g["hs"], as_score=g["as_score"],
                status=g["status"], live=g["live"], arena=g["arena"], broadcast=g["broadcast"],
                hRec=g["hRec"], aRec=g["aRec"], hLeader=g["hLeader"], aLeader=g["aLeader"], qtrs=g["qtrs"]
            ))
        db.commit()
        logger.info(f"Successfully updated {len(games)} games.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update games: {e}")
    finally:
        db.close()
