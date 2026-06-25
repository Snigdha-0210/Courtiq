import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

_XPTS_MODEL = None

def get_xpts_model():
    global _XPTS_MODEL
    if _XPTS_MODEL is None:
        # Train a quick synthetic ML model to predict shot probability
        X_train = []
        y_train = []
        for _ in range(2000):
            zone_id = np.random.randint(0, 5)
            # 0: Restricted, 1: Paint, 2: Mid-range, 3: Corner 3, 4: Above Break 3
            if zone_id == 0:
                prob = 0.65
            elif zone_id == 1:
                prob = 0.45
            elif zone_id == 2:
                prob = 0.40
            elif zone_id == 3:
                prob = 0.38
            else:
                prob = 0.35
            
            made = 1 if np.random.random() < prob else 0
            X_train.append([zone_id])
            y_train.append(made)
            
        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        clf.fit(X_train, y_train)
        _XPTS_MODEL = clf
    return _XPTS_MODEL

def calculate_xpts(shots_df: pd.DataFrame) -> pd.DataFrame:
    """
    Appends 'xPTS' and 'xFG_pct' columns to the shots DataFrame using an ML model.
    """
    if shots_df.empty:
        return shots_df
        
    df = shots_df.copy()
    model = get_xpts_model()
    
    def get_zone_id(zone):
        if 'Restricted Area' in str(zone): return 0
        elif 'In The Paint' in str(zone): return 1
        elif 'Mid-Range' in str(zone): return 2
        elif 'Corner 3' in str(zone): return 3
        else: return 4
        
    # Extract features
    df['zone_id'] = df['SHOT_ZONE_BASIC'].apply(get_zone_id)
    features = df[['zone_id']]
    
    # Predict probabilities (predict_proba returns [prob_miss, prob_make])
    probs = model.predict_proba(features)[:, 1]
    df['xFG_pct'] = np.clip(probs + np.random.normal(0, 0.02, len(probs)), 0.01, 0.99)
    
    def get_points(shot_type):
        return 3 if '3PT' in str(shot_type) else 2
        
    df['pts_value'] = df['SHOT_TYPE'].apply(get_points)
    df['xPTS'] = df['xFG_pct'] * df['pts_value']
    
    return df
