from nba_api.stats.endpoints import scoreboardv2, leaguestandingsv3, leagueleaders, commonplayerinfo, playerprofilev2, shotchartdetail, leaguedashteamstats, leaguedashplayerstats, playerdashboardbygeneralsplits
from nba_api.stats.static import players, teams
from datetime import datetime
import pandas as pd
import time
from model.xpts_model import calculate_xpts

SEASON = "2024-25"

def fetch_live_games():
    """Fetches games and returns them in the frontend Game schema."""
    from nba_api.stats.endpoints import scoreboardv3
    from datetime import datetime
    try:
        # Since it's off-season, use a 3-day window of the playoffs so we have finished, live, and upcoming
        dates = ['2024-05-18', '2024-05-19', '2024-05-20']
        
        all_games = []
        for d in dates:
            board = scoreboardv3.ScoreboardV3(game_date=d)
            all_games.extend(board.get_dict().get('scoreboard', {}).get('games', []))
            
        formatted_games = []
        for game in all_games:
            home = game['homeTeam']
            away = game['awayTeam']
            
            h_qtrs = [p.get('score', 0) for p in home.get('periods', [])]
            a_qtrs = [p.get('score', 0) for p in away.get('periods', [])]
            
            # pad to at least 4 quarters
            while len(h_qtrs) < 4: h_qtrs.append(0)
            while len(a_qtrs) < 4: a_qtrs.append(0)
            
            broadcasters = game.get('broadcasters', {}).get('nationalBroadcasters', [])
            broadcast = broadcasters[0].get('broadcastDisplay', 'Local') if broadcasters else "Local"
            
            formatted_games.append({
                "id": int(game['gameId']),
                "home": home['teamTricode'],
                "away": away['teamTricode'],
                "hs": int(home.get('score', 0)),
                "as_score": int(away.get('score', 0)),
                "status": game['gameStatusText'],
                "live": game['gameStatus'] == 2,
                "arena": game.get('arena', {}).get('arenaName', 'Arena'),
                "broadcast": broadcast,
                "hRec": f"{home.get('wins', 0)}-{home.get('losses', 0)}",
                "aRec": f"{away.get('wins', 0)}-{away.get('losses', 0)}",
                "hLeader": "—", # Requires another API call to get player stats for live game
                "aLeader": "—",
                "qtrs": { "h": h_qtrs, "a": a_qtrs }
            })
            
        if formatted_games:
            # Force the first game to be live for demonstration purposes
            formatted_games[0]['live'] = True
            formatted_games[0]['status'] = "Q3 - 5:40"
            formatted_games[0]['hLeader'] = "L. Doncic - 28 PTS"
            formatted_games[0]['aLeader'] = "S. Gilgeous-Alexander - 24 PTS"
            
        return formatted_games
    except Exception as e:
        import traceback
        print(f"Error fetching live games: {e}")
        traceback.print_exc()
        return []

def fetch_boxscore(game_id: str):
    from nba_api.stats.endpoints import boxscoretraditionalv3
    try:
        box = boxscoretraditionalv3.BoxScoreTraditionalV3(game_id=game_id).get_dict()
        box_data = box.get('boxScoreTraditional', {})
        home = box_data.get('homeTeam', {})
        away = box_data.get('awayTeam', {})
        
        def format_players(team_data):
            players = team_data.get('players', [])
            res = []
            for p in players:
                res.append({
                    "name": p.get('nameI', p.get('firstName', '') + ' ' + p.get('familyName', '')),
                    "pos": p.get('position', ''),
                    "pts": p.get('statistics', {}).get('points', 0),
                    "reb": p.get('statistics', {}).get('reboundsTotal', 0),
                    "ast": p.get('statistics', {}).get('assists', 0),
                    "fgm": p.get('statistics', {}).get('fieldGoalsMade', 0),
                    "fga": p.get('statistics', {}).get('fieldGoalsAttempted', 0),
                    "mins": p.get('statistics', {}).get('minutes', '0:00')
                })
            return res
            
        return {
            "home": home.get('teamTricode', 'HOME'),
            "away": away.get('teamTricode', 'AWAY'),
            "homePlayers": format_players(home),
            "awayPlayers": format_players(away)
        }
    except Exception as e:
        print(f"Error fetching boxscore: {e}")
        return None

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
            fga = row.get('FGA', 0)
            fta = row.get('FTA', 0)
            pts = row.get('PTS', 0)
            gp = row.get('GP', 0)
            reb = row.get('REB', 0)
            ast = row.get('AST', 0)
            if gp > 0:
                tsp = round(pts / (2 * (fga + 0.44 * fta)) * 100, 1) if (fga + 0.44 * fta) > 0 else 0
                per = round(15.0 + ((pts/gp) - 10) * 0.5 + ((reb/gp) - 4) * 0.3 + ((ast/gp) - 2) * 0.4, 1)
            else:
                tsp, per = 0, 0
                
            career_arr.append({
                "season": str(row['SEASON_ID']),
                "gp": int(gp),
                "pts": float(round(pts/gp, 1)) if gp else 0.0,
                "reb": float(round(reb/gp, 1)) if gp else 0.0,
                "ast": float(round(ast/gp, 1)) if gp else 0.0,
                "fgp": float(round(row['FG_PCT'] * 100, 1)),
                "fg3p": float(round(row['FG3_PCT'] * 100, 1)),
                "ftp": float(round(row['FT_PCT'] * 100, 1)),
                "tsp": float(tsp),
                "per": float(max(5.0, min(35.0, per)))
            })
            
        # Fetch gamelog
        gamelog_arr = []
        try:
            from nba_api.stats.endpoints import playergamelog
            gamelog = playergamelog.PlayerGameLog(player_id=player_id, season=SEASON)
            gl_df = gamelog.get_data_frames()[0]
            for _, row in gl_df.head(20).iterrows(): # Return last 20 games
                matchup = row['MATCHUP']
                opp = matchup.split(' ')[-1]
                res = row['WL']
                gamelog_arr.append({
                    "date": row['GAME_DATE'],
                    "opp": opp,
                    "res": res if res else "-",
                    "min": int(row['MIN']),
                    "pts": int(row['PTS']),
                    "reb": int(row['REB']),
                    "ast": int(row['AST']),
                    "fgm": int(row['FGM']),
                    "fga": int(row['FGA']),
                    "fg3m": int(row['FG3M']),
                    "fg3a": int(row['FG3A']),
                    "ftm": int(row['FTM']),
                    "fta": int(row['FTA']),
                    "stl": int(row['STL']),
                    "blk": int(row['BLK']),
                    "tov": int(row['TOV']),
                    "pm": int(row['PLUS_MINUS']) if pd.notna(row['PLUS_MINUS']) else 0
                })
        except Exception as e:
            print(f"Error fetching gamelog for {player_id}: {e}")

        # fetch splits
        splits_arr = []
        try:
            splits_api = playerdashboardbygeneralsplits.PlayerDashboardByGeneralSplits(player_id=player_id, season=SEASON)
            dfs = splits_api.get_data_frames()
            overall = dfs[0]
            location = dfs[1]
            winloss = dfs[2]
            
            def map_split(row, label):
                fga = row['FGA']
                fta = row['FTA']
                pts = row['PTS']
                tsp = round(pts / (2 * (fga + 0.44 * fta)) * 100, 1) if (fga + 0.44 * fta) > 0 else 0
                return {
                    "label": label,
                    "gp": int(row['GP']),
                    "pts": float(round(row['PTS'], 1)),
                    "reb": float(round(row['REB'], 1)),
                    "ast": float(round(row['AST'], 1)),
                    "fgp": float(round(row['FG_PCT']*100, 1)),
                    "fg3p": float(round(row['FG3_PCT']*100, 1)),
                    "tsp": float(tsp)
                }

            if not overall.empty:
                splits_arr.append(map_split(overall.iloc[0], "Overall"))
            if len(location) >= 2:
                for _, row in location.iterrows():
                    splits_arr.append(map_split(row, row['GROUP_VALUE']))
            if len(winloss) >= 2:
                for _, row in winloss.iterrows():
                    splits_arr.append(map_split(row, "In " + row['GROUP_VALUE']))
        except Exception as e:
            print(f"Error fetching splits for {player_id}: {e}")

        # fetch shotchart and calculate zones
        zones_arr = []
        try:
            sc = shotchartdetail.ShotChartDetail(player_id=player_id, team_id=0, context_measure_simple='FGA', season_nullable=SEASON)
            df_sc = sc.get_data_frames()[0]
            if not df_sc.empty:
                df_sc = calculate_xpts(df_sc)
                zone_groups = df_sc.groupby('SHOT_ZONE_BASIC')
                for zone_name, group in zone_groups:
                    fga = len(group)
                    fgm = group['SHOT_MADE_FLAG'].sum()
                    fgp = round(fgm / fga * 100, 1) if fga > 0 else 0
                    
                    xfgp = round(group['xFG_pct'].mean() * 100, 1) if fga > 0 else 0
                    pts_val_avg = group['pts_value'].mean() if 'pts_value' in group.columns else 2
                    pps = round(pts_val_avg * (fgm / fga), 2) if fga > 0 else 0
                    
                    diff = fgp - xfgp
                    if diff > 5: rating = "ELITE"
                    elif diff > 0: rating = "GOOD"
                    elif diff > -5: rating = "AVG"
                    else: rating = "POOR"
                    
                    zones_arr.append({
                        "zone": str(zone_name),
                        "fga": int(fga),
                        "fgp": float(fgp),
                        "xfgp": float(xfgp),
                        "pps": float(pps),
                        "rating": rating
                    })
        except Exception as e:
            print(f"Error fetching shotchart for {player_id}: {e}")

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
            "gamelog": gamelog_arr,
            "splits": splits_arr,
            "hustle": {},
            "zones": zones_arr,
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
