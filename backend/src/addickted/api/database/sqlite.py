from typing import Any, Optional
import aiosqlite
import time
import asyncio

from addickted.api.types.database import User, UserInLeaderboard, Leaderboard


sem = asyncio.Semaphore(5)


class SqliteDB():
    def __init__(self, path_to_db: str = 'main.db'):
        self.path_to_db = path_to_db

    @property
    async def connection(self):
        return await aiosqlite.connect(self.path_to_db)

    async def execute(self, sql: str, parameters: tuple[Any] | None = None, fetchone: bool = False,
                      fetchall: bool = False, commit: bool = False):
        if not parameters:
            parameters = tuple()

        async with sem:
            connection = await self.connection
            cursor = await connection.cursor()
            data = None
            await cursor.execute(sql, parameters)

            if commit:
                await connection.commit()
            if fetchone:
                data = await cursor.fetchone()
            if fetchall:
                data = await cursor.fetchall()
            await connection.close()

            return data

    async def create_table_users(self):
        sql = """
        CREATE TABLE IF NOT EXISTS twitter_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            twitter_handle TEXT UNIQUE,
            wallet_address TEXT UNIQUE,
            created_at INTEGER
        )
        """
        await self.execute(sql, commit=True)

    async def create_table_leaderboard(self):
        sql = """
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            twitter_handle TEXT UNIQUE,
            tweets_count INTEGER,
            views_count INTEGER,
            updated_at INTEGER DEFAULT 0,
            created_at INTEGER DEFAULT 0
        )
        """
        await self.execute(sql, commit=True)

    async def add_user(
            self,
            twitter_handle: str,
            wallet_address: Optional[str] = None
    ):
        if not wallet_address:
            sql = """
            INSERT INTO twitter_users (twitter_handle, created_at)
            VALUES (?, ?)
            """
            parameters = (twitter_handle, int(time.time()))
        else:
            sql = """
            INSERT INTO twitter_users (twitter_handle, wallet_address, created_at)
            VALUES (?, ?, ?)
            """
            parameters = (twitter_handle, wallet_address, int(time.time()))

        await self.execute(sql, parameters, commit=True) # type: ignore

    async def get_user_by_wallet_address(self, wallet_address: str) -> User | None:
        sql = """
        SELECT twitter_handle, created_at
        FROM twitter_users
        WHERE wallet_address = ?
        """
        user = await self.execute(sql, (wallet_address,), fetchone=True)
        if user:
            return User(twitter_handle=user[0], created_at=user[1], wallet_address=wallet_address) # type: ignore
        
    async def get_user_by_twitter_handle(self, twitter_handle: str) -> User | None:
        sql = """
        SELECT wallet_address, created_at
        FROM twitter_users
        WHERE twitter_handle = ?
        """
        user = await self.execute(sql, (twitter_handle,), fetchone=True)
        if user:
            return User(twitter_handle=twitter_handle, created_at=user[1], wallet_address=user[0]) # type: ignore

    async def get_users(self) -> list[User]:
        sql = """
        SELECT twitter_handle, created_at
        FROM twitter_users
        """
        users = await self.execute(sql, fetchall=True)
        if users:
            return [User(twitter_handle=user[0], created_at=user[1]) for user in users]
        return []

    async def edit_user_in_leaderboard(self, twitter_handle: str, tweets_count: int, views_count: int):
        sql = """
        INSERT OR REPLACE INTO leaderboard (twitter_handle, tweets_count, views_count)
        VALUES (?, ?, ?)
        """
        await self.execute(sql, (twitter_handle, tweets_count, views_count), commit=True) # type: ignore

    async def add_user_to_leaderboard(self, twitter_handle: str, tweets_count: int, views_count: int):
        sql = """
        INSERT INTO leaderboard (twitter_handle, tweets_count, views_count)
        VALUES (?, ?, ?)
        """
        await self.execute(sql, (twitter_handle, tweets_count, views_count), commit=True) # type: ignore

    async def get_user_in_leaderboard(self, twitter_handle: str) -> UserInLeaderboard | None:
        sql = """
        SELECT *
        FROM leaderboard
        WHERE twitter_handle = ?
        """
        user = await self.execute(sql, (twitter_handle,), fetchone=True)
        if user:
            return UserInLeaderboard(
                twitter_handle=user[1], # type: ignore
                tweets_count=user[2], # type: ignore
                views_count=user[3], # type: ignore
                updated_at=user[4], # type: ignore
                created_at=user[5] # type: ignore
            )

    async def get_leaderboard(self) -> Leaderboard | None:
        sql = """
        SELECT *
        FROM leaderboard
        ORDER BY views_count DESC
        """
        users = await self.execute(sql, fetchall=True)
        if users:
            return Leaderboard(
                leaderboard=[
                    UserInLeaderboard(
                        twitter_handle=user[1], # type: ignore
                        tweets_count=user[2], # type: ignore
                        views_count=user[3], # type: ignore
                        updated_at=user[4], # type: ignore
                        created_at=user[5] # type: ignore
                    ) for user in users
                ]
            )
