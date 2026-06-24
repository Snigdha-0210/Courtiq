from nba_api.stats.endpoints import scoreboardv2, leaguestandingsv3, leagueleaders, commonplayerinfo, playerprofilev2, shotchartdetail, leaguedashteamstats, leaguedashplayerstats
from nba_api.stats.static import players, teams
from datetime import datetime
import pandas as pd
import time
from model.xpts_model import calculate_xpts

SEASON = "2023-24"

def fetch_live_games():
    """Fetches today's games and returns them in the frontend Game schema."""
    try:
        board = scoreboardv2.ScoreboardV2()
        games_df = board.get_data_frames()[0]  # GameHeader
        linescore_df = board.get_data_frames()[1] # LineScore
        
        formatted_games = []
        for _, game in games_df.iterrows():
            game_id = game['GAME_ID']
            home_team = game['HOME_TEAM_ID']
            away_team = game['VISITOR_TEAM_ID']
            
            h_line = linescore_df[linescore_df['TEAM_ID'] == home_team]
            a_line = linescore_df[linescore_df['TEAM_ID'] == away_team]
            
            if not h_line.empty and not a_line.empty:
                h_line = h_line.iloc[0]
                a_line = a_line.iloc[0]
                
                h_qtrs = [h_line.get('PTS_QTR1', 0), h_line.get('PTS_QTR2', 0), h_line.get('PTS_QTR3', 0), h_line.get('PTS_QTR4', 0)]
                a_qtrs = [a_line.get('PTS_QTR1', 0), a_line.get('PTS_QTR2', 0), a_line.get('PTS_QTR3', 0), a_line.get('PTS_QTR4', 0)]
                
                # Replace None with 0
                h_qtrs = [x if pd.notna(x) else 0 for x in h_qtrs]
                a_qtrs = [x if pd.notna(x) else 0 for x in a_qtrs]
                
                formatted_games.append({
                    "id": int(game_id),
                    "home": h_line['TEAM_ABBREVIATION'],
                    "away": a_line['TEAM_ABBREVIATION'],
                    "hs": int(h_line.get('PTS', 0) if pd.notna(h_line.get('PTS', 0)) else 0),
                    "as_score": int(a_line.get('PTS', 0) if pd.notna(a_line.get('PTS', 0)) else 0),
                    "status": game['GAME_STATUS_TEXT'],
                    "live": game['GAME_STATUS_ID'] == 2,
                    "arena": game['ARENA_NAME'],
                    "broadcast": "Local" if not game['NATL_TV_BROADCASTER_ABBREVIATION'] else game['NATL_TV_BROADCASTER_ABBREVIATION'],
                    "hRec": f"{h_line.get('TEAM_WINS_LOSSES', '0-0')}",
                    "aRec": f"{a_line.get('TEAM_WINS_LOSSES', '0-0')}",
                    "hLeader": "â€”", # Requires another API call to get player stats for live game
                    "aLeader": "â€”",
                    "qtrs": { "h": h_qtrs, "a": a_qtrs }
                })
        return formatted_games
    except Exception as e:
        print(f"Error fetching live games: {e}")
        return []

def fetch_standings():
    """Fetches standings for East and West."""
    try:
        standings = leaguestandingsv3.LeagueStandingsV3(season=SEASON)
        df = standings.get_data_frames()[0]
        
        east, west = [], []
        for _, row in df.iterrows():
            standing = {
                "t": row['TeamSlug'], # abbreviation
                "city": row['TeamCity'],
                "w": row['WINS'],
                "l": row['LOSSES'],
                "home_rec": str(row['HOME']),
                "road_rec": str(row['ROAD']),
                "l10": str(row['L10']),
                "str_streak": "W" + str(row['strCurrentStreak']) if isinstance(row['strCurrentStreak'], (int, float)) and row['strCurrentStreak'] > 0 else ("L" + str(abs(int(row['strCurrentStreak']))) if isinstance(row['strCurrentStreak'], (int, float)) else str(row['strCurrentStreak']))
            }
            if row['Conference'] == 'East':
                east.append(standing)
            else:
                west.append(standing)
        return {"EAST": east, "WEST": west}
    except Exception as e:
        print(f"Error fetching standings: {e}")
        return {"EAST": [], "WEST": []}

def fetch_leaders():
    """Fetches league leaders for various categories."""
    try:
        player_stats = leaguedashplayerstats.LeagueDashPlayerStats(season=SEASON, per_mode_detailed='PerGame').get_data_frames()[0]
        
        # Filter out players with too few games to qualify for leaderboards (e.g., at least 15 games)
        player_stats = player_stats[player_stats['GP'] >= 15]

        # Calculate TSP and PER for all players
        tsp_list = []
        per_list = []
        for _, row in player_stats.iterrows():
            fga = row['FGA']
            fta = row['FTA']
            pts = row['PTS']
            tsp = round(pts / (2 * (fga + 0.44 * fta)) * 100, 1) if (fga + 0.44 * fta) > 0 else 0
            per = round(15.0 + (pts - 10) * 0.5 + (row['REB'] - 4) * 0.3 + (row['AST'] - 2) * 0.4, 1)
            tsp_list.append(tsp)
            per_list.append(max(5.0, min(35.0, per)))
            
        player_stats['TSP'] = tsp_list
        player_stats['PER'] = per_list
        
        categories = {
            "pts": "PTS", "reb": "REB", "ast": "AST", 
            "stl": "STL", "blk": "BLK", "3pm": "FG3M",
            "ts": "TSP", "per": "PER"
        }
        
        leaders_data = {}
        for key, stat in categories.items():
            top = player_stats.nlargest(8, stat)
            formatted = []
            for _, row in top.iterrows():
                names = row['PLAYER_NAME'].split()
                init = names[0][0] + (names[-1][0] if len(names) > 1 else "")
                formatted.append({
                    "name": row['PLAYER_NAME'],
                    "team": row['TEAM_ABBREVIATION'],
                    "pos": "—", 
                    "init": init.upper(),
                    "val": float(round(row[stat], 1))
                })
            leaders_data[key] = formatted
            
        return leaders_data
    except Exception as e:
        print(f"Error fetching leaders: {e}")
        return {}

def fetch_player_profile(player_key: str, player_id: int):
    """Fetches a deep profile for a single player."""
    try:
        info = commonplayerinfo.CommonPlayerInfo(player_id=player_id).get_data_frames()[0].iloc[0]
        profile = playerprofilev2.PlayerProfileV2(player_id=player_id)
        season_totals = profile.get_data_frames()[0]
        career_totals = profile.get_data_frames()[1]
        
        # Get current season
        curr_season = season_totals[season_totals['SEASON_ID'] == SEASON]
        
        season_dict = {}
        if not curr_season.empty:
            cs = curr_season.iloc[0]
            season_dict = {
                "pts": float(round(cs['PTS']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "reb": float(round(cs['REB']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "ast": float(round(cs['AST']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "stl": float(round(cs['STL']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "blk": float(round(cs['BLK']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "fgp": float(cs['FG_PCT'] * 100),
                "fg3p": float(cs['FG3_PCT'] * 100),
                "ftp": float(cs['FT_PCT'] * 100),
                "tsp": 60.0, # Placeholder
                "per": 20.0, # Placeholder
                "gp": int(cs['GP']),
                "mpg": float(round(cs['MIN']/cs['GP'], 1)) if cs['GP'] else 0.0,
                "tov": float(round(cs['TOV']/cs['GP'], 1)) if cs['GP'] else 0.0
            }
            
        career_arr = []
        for _, row in season_totals.iterrows():
            career_arr.append({
                "season": str(row['SEASON_ID']),
                "gp": int(row['GP']),
                "pts": float(round(row['PTS']/row['GP'], 1)) if row['GP'] else 0.0,
                "reb": float(round(row['REB']/row['GP'], 1)) if row['GP'] else 0.0,
                "ast": float(round(row['AST']/row['GP'], 1)) if row['GP'] else 0.0,
                "fgp": float(row['FG_PCT'] * 100),
                "fg3p": float(row['FG3_PCT'] * 100),
                "ftp": float(row['FT_PCT'] * 100),
            })
            
        return {
            "player_key": str(player_key),
            "name": str(info['DISPLAY_FIRST_LAST']),
            "firstName": str(info['FIRST_NAME']),
            "lastName": str(info['LAST_NAME']),
            "number": int(info.get('JERSEY', '0')) if str(info.get('JERSEY', '0')).isdigit() else 0,
            "pos": str(info['POSITION']),
            "team": str(info['TEAM_NAME']),
            "teamAbbr": str(info['TEAM_ABBREVIATION']),
            "age": int(pd.Timestamp.now().year - pd.to_datetime(info['BIRTHDATE']).year),
            "height": str(info['HEIGHT']),
            "weight": str(info['WEIGHT']),
            "draft": f"{info['DRAFT_YEAR']} Â· Rd {info['DRAFT_ROUND']} Â· #{info['DRAFT_NUMBER']}",
            "college": str(info['SCHOOL']),
            "salary": "â€”",
            "season": season_dict,
            "career": career_arr,
            "gamelog": [], # Need another call for gamelog
            "splits": [],
            "hustle": {},
            "zones": [], # Would need shotchart info mapped here
            "radar": { "scoring": 85, "shooting": 80, "playmaking": 70, "defense": 60, "efficiency": 80 }
        }
    except Exception as e:
        print(f"Error fetching profile for {player_id}: {e}")
        return None


def fetch_top_players(limit=30):
    """Fetches top N player IDs by PTS."""
    try:
        leaders = leagueleaders.LeagueLeaders(stat_category_abbreviation="PTS", season=SEASON)
        df = leaders.get_data_frames()[0].head(limit)
        results = {}
        for _, row in df.iterrows():
            player_name = row['PLAYER']
            key = player_name.split()[-1].lower()
            results[key] = row['PLAYER_ID']
        return results
    except Exception as e:
        print(f"Error fetching top players: {e}")
        return {}

def fetch_all_teams_data():
    """Fetches profiles for all 30 NBA teams, including advanced stats and rosters."""
    try:
        standings = leaguestandingsv3.LeagueStandingsV3(season=SEASON).get_data_frames()[0]
        time.sleep(0.5)
        four_factors = leaguedashteamstats.LeagueDashTeamStats(measure_type_detailed_defense='Four Factors', season=SEASON).get_data_frames()[0]
        time.sleep(0.5)
        advanced = leaguedashteamstats.LeagueDashTeamStats(measure_type_detailed_defense='Advanced', season=SEASON).get_data_frames()[0]
        time.sleep(0.5)
        player_stats = leaguedashplayerstats.LeagueDashPlayerStats(season=SEASON, per_mode_detailed='PerGame').get_data_frames()[0]

        teams_dict = {}
        for _, row in standings.iterrows():
            tid = row['TeamID']
            teams_dict[tid] = {
                "team_id": row['TeamSlug'].upper(),
                "conference": row['Conference'],
                "seed": str(row['PlayoffRank']),
                "team": row['TeamName'],
                "city": row['TeamCity'],
                "wins": int(row['WINS']),
                "losses": int(row['LOSSES']),
                "four_factors": [],
                "roster": [],
                "off_rtg": "0.0",
                "def_rtg": "0.0",
                "net_rtg": "0.0",
                "pace": "0.0"
            }
            
        for _, row in advanced.iterrows():
            tid = row['TEAM_ID']
            if tid in teams_dict:
                teams_dict[tid]["off_rtg"] = str(round(row['OFF_RATING'], 1))
                teams_dict[tid]["def_rtg"] = str(round(row['DEF_RATING'], 1))
                teams_dict[tid]["net_rtg"] = ("+" if row['NET_RATING'] > 0 else "") + str(round(row['NET_RATING'], 1))
                teams_dict[tid]["pace"] = str(round(row['PACE'], 1))
                
        for _, row in four_factors.iterrows():
            tid = row['TEAM_ID']
            if tid in teams_dict:
                ff = []
                ff.append({"label": "eFG% Off", "val": f"{row['EFG_PCT']*100:.1f}%", "rank": f"{row['EFG_PCT_RANK']}th", "good": row['EFG_PCT_RANK'] <= 15})
                ff.append({"label": "eFG% Def", "val": f"{row['OPP_EFG_PCT']*100:.1f}%", "rank": f"{row['OPP_EFG_PCT_RANK']}th", "good": row['OPP_EFG_PCT_RANK'] <= 15})
                ff.append({"label": "TOV% Off", "val": f"{row['TM_TOV_PCT']*100:.1f}%", "rank": f"{row['TM_TOV_PCT_RANK']}th", "good": row['TM_TOV_PCT_RANK'] <= 15})
                ff.append({"label": "TOV% Def", "val": f"{row['OPP_TOV_PCT']*100:.1f}%", "rank": f"{row['OPP_TOV_PCT_RANK']}th", "good": row['OPP_TOV_PCT_RANK'] <= 15})
                ff.append({"label": "ORB%", "val": f"{row['OREB_PCT']*100:.1f}%", "rank": f"{row['OREB_PCT_RANK']}th", "good": row['OREB_PCT_RANK'] <= 15})
                ff.append({"label": "DRB%", "val": f"{(1 - row['OPP_OREB_PCT'])*100:.1f}%", "rank": f"{row['OPP_OREB_PCT_RANK']}th", "good": row['OPP_OREB_PCT_RANK'] >= 15})
                ff.append({"label": "FT Rate Off", "val": f"{row['FTA_RATE']*100:.1f}%", "rank": f"{row['FTA_RATE_RANK']}th", "good": row['FTA_RATE_RANK'] <= 15})
                ff.append({"label": "FT Rate Def", "val": f"{row['OPP_FTA_RATE']*100:.1f}%", "rank": f"{row['OPP_FTA_RATE_RANK']}th", "good": row['OPP_FTA_RATE_RANK'] <= 15})
                teams_dict[tid]["four_factors"] = ff

        for _, row in player_stats.iterrows():
            tid = row['TEAM_ID']
            if tid in teams_dict:
                fga = row['FGA']
                fta = row['FTA']
                pts = row['PTS']
                tsp = round(pts / (2 * (fga + 0.44 * fta)) * 100, 1) if (fga + 0.44 * fta) > 0 else 0
                per = round(15.0 + (pts - 10) * 0.5 + (row['REB'] - 4) * 0.3 + (row['AST'] - 2) * 0.4, 1)
                
                player = {
                    "name": row['PLAYER_NAME'],
                    "pos": "-", 
                    "age": int(row['AGE']),
                    "pts": float(round(row['PTS'], 1)),
                    "reb": float(round(row['REB'], 1)),
                    "ast": float(round(row['AST'], 1)),
                    "fgp": float(round(row['FG_PCT']*100, 1)),
                    "fg3p": float(round(row['FG3_PCT']*100, 1)),
                    "tsp": float(tsp),
                    "per": float(max(5.0, min(35.0, per)))
                }
                teams_dict[tid]["roster"].append(player)
                
        for tid in teams_dict:
            teams_dict[tid]["roster"].sort(key=lambda x: x["pts"], reverse=True)

        return list(teams_dict.values())
    except Exception as e:
        print(f"Error fetching teams: {e}")
        return []
