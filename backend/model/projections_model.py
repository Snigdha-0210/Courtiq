import pandas as pd
import joblib
import os

_MODELS = {}

def get_models():
    if not _MODELS:
        try:
            model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
            _MODELS['pts'] = joblib.load(os.path.join(model_dir, 'xgb_actual_pts.joblib'))
            _MODELS['reb'] = joblib.load(os.path.join(model_dir, 'xgb_actual_reb.joblib'))
            _MODELS['ast'] = joblib.load(os.path.join(model_dir, 'xgb_actual_ast.joblib'))
        except Exception as e:
            print("Failed to load models:", e)
    return _MODELS

def predict_player_stats(player):
    """
    Predicts PTS, REB, AST for a given PlayerProfile object.
    Uses the trained XGBoost models.
    """
    models = get_models()
    if not models:
        season = player.season if player.season else {}
        return {
            "proj_pts": round(float(season.get('pts', 10.0)), 1),
            "proj_reb": round(float(season.get('reb', 4.0)), 1),
            "proj_ast": round(float(season.get('ast', 2.0)), 1)
        }
        
    season = player.season if player.season else {}
    pts_avg = float(season.get('pts', 10.0))
    reb_avg = float(season.get('reb', 4.0))
    ast_avg = float(season.get('ast', 2.0))
    
    features = pd.DataFrame([{
        'rolling_pts': pts_avg,
        'rolling_reb': reb_avg,
        'rolling_ast': ast_avg,
        'rest_days': 2,
        'opp_def_rating': 110.0
    }])
    
    proj_pts = float(models['pts'].predict(features)[0])
    proj_reb = float(models['reb'].predict(features)[0])
    proj_ast = float(models['ast'].predict(features)[0])
    
    # "Who is Good" - Calculate CourtIQ Rating (0-100)
    # A simple formula based on production (PTS + 1.2*REB + 1.5*AST)
    production_score = proj_pts + (1.2 * proj_reb) + (1.5 * proj_ast)
    # Scale: 50 is an MVP season, so multiply by 2 to get a 100-point scale
    rating_raw = production_score * 2.0
    # Add a slight boost for highly efficient/projected players
    rating = min(99, max(40, int(rating_raw)))
    
    return {
        "proj_pts": round(max(0, proj_pts), 1),
        "proj_reb": round(max(0, proj_reb), 1),
        "proj_ast": round(max(0, proj_ast), 1),
        "courtiq_rating": rating
    }
