from nba_api.stats.endpoints import scoreboardv3, boxscoretraditionalv3
from datetime import datetime, timedelta

def test_fetch():
    dates = []
    base = datetime.now()
    for offset in [-1, 0, 1]:
        d = base + timedelta(days=offset)
        dates.append(d.strftime('%Y-%m-%d'))
    
    games = []
    for d in dates:
        board = scoreboardv3.ScoreboardV3(game_date=d)
        games.extend(board.get_dict().get('scoreboard', {}).get('games', []))
    print(f"Fetched {len(games)} games across 3 days.")

    if games:
        game_id = games[0]['gameId']
        print(f"Fetching boxscore for {game_id}...")
        box = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id)
        box_dict = box.get_dict()
        print("Boxscore keys:", box_dict['boxScoreTraditional'].keys())

if __name__ == "__main__":
    test_fetch()
