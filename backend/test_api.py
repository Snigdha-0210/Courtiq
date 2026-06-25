from nba_api.stats.endpoints import playerdashboardbygeneralsplits, shotchartdetail
import logging
logging.basicConfig(level=logging.INFO)

player_id = 201939 # Curry

def get_splits():
    try:
        splits = playerdashboardbygeneralsplits.PlayerDashboardByGeneralSplits(player_id=player_id, season="2024-25")
        df = splits.get_data_frames()[0]
        print("Splits columns:", df.columns.tolist())
        print("Splits head:", df.head())
    except Exception as e:
        print("Splits error:", e)

def get_shotchart():
    try:
        sc = shotchartdetail.ShotChartDetail(player_id=player_id, team_id=0, context_measure_simple='FGA', season_nullable="2024-25")
        df = sc.get_data_frames()[0]
        print("Shotchart columns:", df.columns.tolist())
        print("Shotchart head:", df.head())
    except Exception as e:
        print("Shotchart error:", e)

get_splits()
get_shotchart()
