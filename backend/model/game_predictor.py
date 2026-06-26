import pandas as pd
import joblib
import os

_MODEL = None

def get_game_predictor():
    global _MODEL
    if _MODEL is None:
        try:
            model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
            _MODEL = joblib.load(os.path.join(model_dir, 'xgb_game_predictor.joblib'))
        except Exception as e:
            print("Failed to load game predictor:", e)
    return _MODEL

def predict_game(home_team, away_team, home_score=0, away_score=0, status=""):
    """
    Predicts the winner between two TeamProfile objects.
    Dynamically adjusts if the game is currently live based on the score differential.
    Returns the probability of the home team winning.
    """
    model = get_game_predictor()
    if not model:
        return {"error": "Model not loaded", "home_win_prob": 0.5}
        
    def parse_stat(val, default):
        try:
            if val:
                return float(val)
            return default
        except:
            return default
            
    h_off = parse_stat(home_team.off_rtg, 110.0)
    h_def = parse_stat(home_team.def_rtg, 110.0)
    h_win_pct = parse_stat(home_team.wins, 41) / 82.0
    
    a_off = parse_stat(away_team.off_rtg, 110.0)
    a_def = parse_stat(away_team.def_rtg, 110.0)
    a_win_pct = parse_stat(away_team.wins, 41) / 82.0
    
    features = pd.DataFrame([{
        'h_off': h_off,
        'h_def': h_def,
        'h_win_pct': h_win_pct,
        'a_off': a_off,
        'a_def': a_def,
        'a_win_pct': a_win_pct
    }])
    
    prob = model.predict_proba(features)[0][1] # Pre-game Probability of class 1 (Home Win)
    
    # LIVE ADJUSTMENT LOGIC
    # If the game is Final, probability is 100% or 0%
    if "Final" in status:
        prob = 1.0 if home_score > away_score else 0.0
    elif "Q" in status or "Half" in status:
        # Game is live! Adjust probability based on score differential
        diff = home_score - away_score
        
        # A rough heuristic: every 1 point lead shifts probability by 2-3%
        # The later in the game, the more a lead matters. We'll just do a basic shift.
        prob_shift = diff * 0.025
        prob = max(0.01, min(0.99, prob + prob_shift))
        
    return {
        "home_team_id": home_team.team_id,
        "away_team_id": away_team.team_id,
        "home_win_prob": round(float(prob) * 100, 1),
        "away_win_prob": round((1.0 - float(prob)) * 100, 1),
        "predicted_winner": home_team.team_id if prob > 0.5 else away_team.team_id
    }
