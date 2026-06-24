from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    home = Column(String)
    away = Column(String)
    hs = Column(Integer)
    as_score = Column(Integer, name="as") # 'as' is a reserved keyword in SQL, so rename the column in python if needed, or use 'as_score'
    status = Column(String)
    live = Column(Boolean)
    arena = Column(String)
    broadcast = Column(String)
    hRec = Column(String)
    aRec = Column(String)
    hLeader = Column(String)
    aLeader = Column(String)
    qtrs = Column(JSON) # { "h": [], "a": [] }

class Standing(Base):
    __tablename__ = "standings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    conference = Column(String, index=True) # "EAST" or "WEST"
    t = Column(String)
    city = Column(String)
    w = Column(Integer)
    l = Column(Integer)
    home_rec = Column(String)
    road_rec = Column(String)
    l10 = Column(String)
    str_streak = Column(String, name="str") # 'str' is builtin in python

class Leader(Base):
    __tablename__ = "leaders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category = Column(String, index=True) # "pts", "reb", "ast", etc.
    name = Column(String)
    team = Column(String)
    pos = Column(String)
    init = Column(String)
    val = Column(Float)

class Injury(Base):
    __tablename__ = "injuries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    team = Column(String)
    status = Column(String)
    injury = Column(String)
    return_date = Column(String, name="return")

class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    player_key = Column(String, primary_key=True, index=True) # e.g. "curry", "luka"
    name = Column(String)
    firstName = Column(String)
    lastName = Column(String)
    number = Column(Integer)
    pos = Column(String)
    team = Column(String)
    teamAbbr = Column(String)
    age = Column(Integer)
    height = Column(String)
    weight = Column(String)
    draft = Column(String)
    college = Column(String)
    salary = Column(String)
    
    season = Column(JSON)
    career = Column(JSON)
    gamelog = Column(JSON)
    splits = Column(JSON)
    hustle = Column(JSON)
    zones = Column(JSON)
    radar = Column(JSON)

class TeamProfile(Base):
    __tablename__ = "team_profiles"

    team_id = Column(String, primary_key=True, index=True) # e.g. "GSW", "LAL"
    conference = Column(String)
    seed = Column(String)
    team = Column(String)
    city = Column(String)
    off_rtg = Column(String)
    def_rtg = Column(String)
    net_rtg = Column(String)
    pace = Column(String)
    wins = Column(Integer)
    losses = Column(Integer)
    
    four_factors = Column(JSON)
    roster = Column(JSON)
