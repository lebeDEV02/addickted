from typing import List, Optional
from pydantic import BaseModel


class User(BaseModel):
    """User model, from 'users' table in the database."""

    twitter_handle: str
    wallet_address: Optional[str] = None
    created_at: int


class UserInLeaderboard(BaseModel):
    """User in leaderboard model, from 'leaderboard' table in the database."""

    twitter_handle: str
    tweets_count: int
    views_count: int
    updated_at: int
    created_at: int


class Leaderboard(BaseModel):
    """Leaderboard model, from 'leaderboard' table in the database."""

    leaderboard: List[UserInLeaderboard]
