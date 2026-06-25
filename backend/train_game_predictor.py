import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from sqlalchemy.orm import Session
from database import SessionLocal
import models

def generate_team_game_data(teams, num_games=500):
    """
    Generate synthetic historical matches between teams based on their profiles.
    Used to train the Win Probability classifier.
    """
    data = []
    
    # We will simulate random matchups
    team_list = list(teams)
    
    for _ in range(num_games):
        home_team = np.random.choice(team_list)
        away_team = np.random.choice(team_list)
        while away_team == home_team:
            away_team = np.random.choice(team_list)
            
        # Parse stats
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
        
        # Home court advantage
        home_adv = 2.5
        
        # Simple formula for "true" probability of home team winning
        # Net rating diff
        net_diff = (h_off - h_def) - (a_off - a_def) + home_adv
        
        # Add some random noise
        match_result = net_diff + np.random.normal(0, 10.0)
        
        home_win = 1 if match_result > 0 else 0
        
        data.append({
            'h_off': h_off,
            'h_def': h_def,
            'h_win_pct': h_win_pct,
            'a_off': a_off,
            'a_def': a_def,
            'a_win_pct': a_win_pct,
            'home_win': home_win
        })
        
    return pd.DataFrame(data)

def train_predictor():
    print("Fetching team profiles from DB...")
    db = SessionLocal()
    teams = db.query(models.TeamProfile).all()
    db.close()
    
    if not teams:
        print("No teams found. Run seed_db.py first.")
        return
        
    print("Generating synthetic game dataset...")
    df = generate_team_game_data(teams, num_games=2000)
    
    features = ['h_off', 'h_def', 'h_win_pct', 'a_off', 'a_def', 'a_win_pct']
    X = df[features]
    y = df['home_win']
    
    print("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.05,
        max_depth=3,
        random_state=42
    )
    
    model.fit(X, y)
    
    train_acc = model.score(X, y)
    print(f"Training Accuracy: {train_acc:.2f}")
    
    os.makedirs('model/saved_models', exist_ok=True)
    model_path = "model/saved_models/xgb_game_predictor.joblib"
    joblib.dump(model, model_path)
    print(f"Saved game predictor to {model_path}")

if __name__ == "__main__":
    train_predictor()
