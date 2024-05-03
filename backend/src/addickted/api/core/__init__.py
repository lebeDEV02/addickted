from fastapi import FastAPI, HTTPException

from aiocache import cached, Cache # type: ignore
from aiocache.serializers import NullSerializer # type: ignore

from pydantic import BaseModel

from addickted.api.database.sqlite import SqliteDB

from addickted.api.types.database import User



class ApiUserInLeaderboard(BaseModel):
    """Leaderboard model, with additional rank field."""

    rank: int | None = None
    twitter_handle: str
    tweets_count: int
    views_count: int


async def startup():
    await db.create_table_users()
    await db.create_table_leaderboard()


app = FastAPI(on_startup=[startup])
db = SqliteDB()


# add cache for leaderboard
@app.get(
    "/leaderboard",
    responses={404: {"description": "Leaderboard is empty"}},
)
@cached(
    ttl=60 * 60 * 12, cache=Cache.MEMORY, key_builder=lambda *args, **kw: "key", # type: ignore
    serializer=NullSerializer(), namespace="main"
)
async def leaderboard() -> list[ApiUserInLeaderboard]:
    """Get the leaderboard (last 1000 users)."""

    _leaderboard = await db.get_leaderboard()

    if _leaderboard:
        _api_leaderboard: list[ApiUserInLeaderboard] = []

        for i, user in enumerate(_leaderboard.leaderboard, start=1):
            _api_leaderboard.append(
                ApiUserInLeaderboard(
                    rank=i,
                    twitter_handle=user.twitter_handle,
                    tweets_count=user.tweets_count,
                    views_count=user.views_count,
                )
            )

        return _api_leaderboard[:1000]

    raise HTTPException(status_code=404, detail="Leaderboard is empty")


@app.post(
    "/add_user",
    response_model=User,
    responses={400: {"description": "User already exists"}},
)
async def add_user(user: User) -> User:
    """Add a user to the database. (Using on frontend for parser.)"""

    try:
        await db.add_user(user.twitter_handle, user.wallet_address)
        return user
    except Exception:
        raise HTTPException(status_code=400, detail="User already exists")


@app.get(
        "user/by_wallet_address",
        responses={404: {"description": "User not found"}},
    )
async def get_user_by_wallet_address(wallet_address: str) -> User:
    """Get user by wallet address."""

    user = await db.get_user_by_wallet_address(wallet_address)
    if user:
        return user
    
    raise HTTPException(status_code=404, detail="User not found")


@app.get(
    "user/by_twitter_handle",
    responses={404: {"description": "User not found"}},
)
async def get_user_by_twitter_handle(twitter_handle: str) -> User:
    """Get user by twitter handle."""

    user = await db.get_user_by_twitter_handle(twitter_handle)
    if user:
        return user

    raise HTTPException(status_code=404, detail="User not found")


@app.get("/users")
async def users() -> list[User]:
    """Get all users from the database."""

    users = await db.get_users()
    return users


@app.get("/manifest")
async def manifest() -> dict[str, str]:
    return {
        "url": "https://ton-connect.github.io/demo-dapp-with-wallet/",
        "name": "Demo Dapp with wallet",
        "iconUrl": "https://ton-connect.github.io/demo-dapp-with-wallet/apple-touch-icon.png",
        "termsOfUseUrl": "https://ton-connect.github.io/demo-dapp-with-wallet/terms-of-use.txt",
        "privacyPolicyUrl": "https://ton-connect.github.io/demo-dapp-with-wallet/privacy-policy.txt"
    }


# CRUD operations for leaderboard (xD)
@app.post("/edit_user_in_leaderboard")
async def edit_user_in_leaderboard(user: ApiUserInLeaderboard):
    """Edit user in the leaderboard."""

    await db.edit_user_in_leaderboard(
        user.twitter_handle, user.tweets_count, user.views_count
    )
