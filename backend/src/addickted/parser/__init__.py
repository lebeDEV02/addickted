import asyncio

from httpx import AsyncClient

from addickted.api.core import ApiUserInLeaderboard
from addickted.parser.tweetscout import TweetScout
from addickted.api.database.sqlite import SqliteDB
from addickted.api.types.database import User

from config import TS_API_KEY, WORD_TRIGGERS

from loguru import logger


ts = TweetScout(api_key=TS_API_KEY, proxy="http://fyrzubdq:2f3hn159czdo@216.19.206.129:6107")
db = SqliteDB()


async def parsing_users():
    logger.info("Starting parsing users.")

    cli = AsyncClient()

    async def get_users() -> list[User]:
        response = await cli.get("http://127.0.0.1:1337/users")
        response.raise_for_status()
        return [User.model_validate(user) for user in response.json()]
    
    async def edit_user_in_leaderboard(user: ApiUserInLeaderboard):
        response = await cli.post("http://127.0.0.1:1337/edit_user_in_leaderboard", json=user.model_dump())
        response.raise_for_status()

    while True:
        users = await get_users()
        logger.info(f"Got {len(users)} users from the database.")

        for user in users:
            continue_fetching = True
            cursor: str = ""

            while continue_fetching:
                tweets = await ts.get_user_tweets(username=user.twitter_handle, cursor=cursor)
                tweets_count = 0
                views_count = 0

                cursor = tweets.next_cursor

                for tweet in tweets.tweets:
                    if any(word in tweet.text.lower() for word in WORD_TRIGGERS):
                        logger.info(f"Found tweet with trigger word: {tweet.text}")
                        tweets_count += 1
                        views_count += tweet.views
                        continue_fetching = True
                    else:
                        logger.info(f"Tweet does not contain trigger word: {tweet.text}")
                        continue_fetching = False
                        continue

                if tweets_count or views_count:
                    logger.info(f"User @{user.twitter_handle} has {tweets_count} tweets and {views_count} views.")
                    await edit_user_in_leaderboard(ApiUserInLeaderboard(
                        twitter_handle=user.twitter_handle,
                        tweets_count=tweets_count,
                        views_count=views_count
                    ))

        logger.info("Sleeping for 24 hours.")

        # sleep for 24 hours
        await asyncio.sleep(86400)
