from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class Qtrs(BaseModel):
    h: List[int]
    a: List[int]

class GameSchema(BaseModel):
    id: int
    home: str
    away: str
    hs: int
    as_: int = Field(..., alias="as") # Python keyword
    status: str
    live: bool
    arena: str
    broadcast: str
    hRec: str
    aRec: str
    hLeader: str
    aLeader: str
    qtrs: Qtrs

    class Config:
        from_attributes = True
        populate_by_name = True

class StandingSchema(BaseModel):
    t: str
    city: str
    w: int
    l: int
    home: str = Field(..., validation_alias="home_rec", serialization_alias="home")
    road: str = Field(..., validation_alias="road_rec", serialization_alias="road")
    l10: str
    str_: str = Field(..., validation_alias="str_streak", serialization_alias="str")

    class Config:
        from_attributes = True
        populate_by_name = True

class StandingsResponse(BaseModel):
    EAST: List[StandingSchema]
    WEST: List[StandingSchema]

class LeaderSchema(BaseModel):
    name: str
    team: str
    pos: str
    init: str
    val: float

    class Config:
        from_attributes = True

class InjurySchema(BaseModel):
    name: str
    team: str
    status: str
    injury: str
    return_: str = Field(..., alias="return_date")

    class Config:
        from_attributes = True
        populate_by_name = True

class PlayerProfileSchema(BaseModel):
    name: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    number: Optional[int] = None
    pos: Optional[str] = None
    team: Optional[str] = None
    teamAbbr: Optional[str] = None
    age: Optional[int] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    draft: Optional[str] = None
    college: Optional[str] = None
    salary: Optional[str] = None
    
    season: Optional[Dict[str, Any]] = None
    career: Optional[List[Dict[str, Any]]] = None
    gamelog: Optional[List[Dict[str, Any]]] = None
    splits: Optional[List[Dict[str, Any]]] = None
    hustle: Optional[Dict[str, Any]] = None
    zones: Optional[List[Dict[str, Any]]] = None
    radar: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class TeamProfileSchema(BaseModel):
    team_id: str
    conference: str
    seed: str
    team: str
    city: str
    off_rtg: str
    def_rtg: str
    net_rtg: str
    pace: str
    wins: int
    losses: int
    
    four_factors: List[Dict[str, Any]]
    roster: List[Dict[str, Any]]

    class Config:
        from_attributes = True
