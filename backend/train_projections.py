import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sqlalchemy.orm import Session
from database import SessionLocal
import models

def generate_synthetic_data(players, num_games=82):
    """
    Generate synthetic game logs for players based on their current season averages.
    This simulates historical game logs to train the ML model.
    """
    data = []
    
    for p in players:
        season_data = p.season if p.season else {}
        pts_avg = float(season_data.get('pts', 10.0))
        reb_avg = float(season_data.get('reb', 4.0))
        ast_avg = float(season_data.get('ast', 2.0))
        
        for i in range(num_games):
            rolling_pts = max(0, np.random.normal(pts_avg, 2.0))
            rolling_reb = max(0, np.random.normal(reb_avg, 1.0))
            rolling_ast = max(0, np.random.normal(ast_avg, 1.0))
            
            rest_days = np.random.choice([1, 2, 3, 4])
            opp_def_rating = np.random.normal(110.0, 5.0)
            
            def_modifier = (110.0 - opp_def_rating) / 10.0
            
            actual_pts = max(0, int(np.random.normal(rolling_pts + def_modifier * 2, 6.0)))
            actual_reb = max(0, int(np.random.normal(rolling_reb + def_modifier * 0.5, 3.0)))
            actual_ast = max(0, int(np.random.normal(rolling_ast + def_modifier * 0.5, 2.0)))
            
            data.append({
                'player_key': p.player_key,
                'rolling_pts': rolling_pts,
                'rolling_reb': rolling_reb,
                'rolling_ast': rolling_ast,
                'rest_days': rest_days,
                'opp_def_rating': opp_def_rating,
                'actual_pts': actual_pts,
                'actual_reb': actual_reb,
                'actual_ast': actual_ast
            })
            
    return pd.DataFrame(data)

def train_models():
    print("Fetching player profiles from DB...")
    db = SessionLocal()
    players = db.query(models.PlayerProfile).all()
    db.close()
    
    if not players:
        print("No players found in database. Run seed_db.py first.")
        return
        
    print(f"Generating synthetic training data for {len(players)} players...")
    df = generate_synthetic_data(players, num_games=100)
    
    features = ['rolling_pts', 'rolling_reb', 'rolling_ast', 'rest_days', 'opp_def_rating']
    X = df[features]
    
    targets = ['actual_pts', 'actual_reb', 'actual_ast']
    
    os.makedirs('model/saved_models', exist_ok=True)
    
    for target in targets:
        print(f"Training XGBoost model for {target}...")
        y = df[target]
        
        model = xgb.XGBRegressor(
            n_estimators=100, 
            learning_rate=0.1, 
            max_depth=4, 
            random_state=42
        )
        
        model.fit(X, y)
        
        train_preds = model.predict(X)
        mae = np.mean(np.abs(train_preds - y))
        print(f"[{target}] Training MAE: {mae:.2f}")
        
        model_path = f"model/saved_models/xgb_{target}.joblib"
        joblib.dump(model, model_path)
        print(f"Saved model to {model_path}")
        
    print("Training complete!")

if __name__ == "__main__":
    train_models()
