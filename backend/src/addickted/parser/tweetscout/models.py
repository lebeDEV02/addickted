from typing import List

from pydantic import BaseModel


class Tweet(BaseModel):
    text: str
    date: str
    views: int


class Tweets(BaseModel):
    next_cursor: str
    tweets: List[Tweet]


class UserInfo(BaseModel):
    avatar: str
    banner: str
    description: str
    followers_count: int
    friends_count: int
    id: str
    name: str
    register_date: str
    screen_name: str
    statuses_count: int
    verified: bool
