import pandas as pd
import numpy as np

# In a real scenario, this would load a trained XGBoost model.
# For now, we will use a simplified heuristic based on shot distance and zone.

def calculate_xpts(shots_df: pd.DataFrame) -> pd.DataFrame:
    """
    Appends 'xPTS' and 'xFG_pct' columns to the shots DataFrame.
    """
    if shots_df.empty:
        return shots_df
        
    df = shots_df.copy()
    
    # Very basic heuristic for Expected FG%
    # In reality, this would be: model.predict_proba(features)[:, 1]
    
    def estimate_fg_prob(row):
        # Base probability
        prob = 0.45
        
        # Adjust based on shot zone
        zone = row.get('SHOT_ZONE_BASIC', '')
        if 'Restricted Area' in zone:
            prob = 0.65
        elif 'In The Paint' in zone:
            prob = 0.45
        elif 'Mid-Range' in zone:
            prob = 0.40
        elif 'Left Corner 3' in zone or 'Right Corner 3' in zone:
            prob = 0.38
        elif 'Above the Break 3' in zone:
            prob = 0.35
        elif 'Backcourt' in zone:
            prob = 0.05
            
        # Add a tiny bit of noise
        prob += np.random.normal(0, 0.02)
        return max(0.01, min(0.99, prob))
        
    df['xFG_pct'] = df.apply(estimate_fg_prob, axis=1)
    
    # Calculate xPTS
    # Shot type tells us if it's a 2 or 3 pointer
    def get_points(shot_type):
        return 3 if '3PT' in str(shot_type) else 2
        
    df['pts_value'] = df['SHOT_TYPE'].apply(get_points)
    df['xPTS'] = df['xFG_pct'] * df['pts_value']
    
    return df
