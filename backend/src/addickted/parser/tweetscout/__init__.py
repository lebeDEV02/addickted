from httpx import AsyncClient

from addickted.parser.tweetscout.models import Tweets, UserInfo


class TweetScout:
    def __init__(self, api_key: str, proxy: str = None): # type: ignore
        self.client = AsyncClient(
            headers={
                "ApiKey": api_key,
                "accept": "application/json",
            },
            proxies={"all://": proxy} if proxy else None,
            timeout=300
        )

    async def get_user_tweets(self, username: str = None, user_id: str = None, cursor: str = None) -> Tweets: # type: ignore
        response = await self.client.post(
            "https://api.tweetscout.io/api/user-timeline-with-date",
            json={"link": username, "user_id": user_id, "cursor": cursor if cursor else None},
        )
        response.raise_for_status()
        return Tweets.model_validate(response.json())

    async def get_user_info(self, username: str) -> UserInfo:
        response = await self.client.get(
            f"https://api.tweetscout.io/api/info/{username}"
        )
        response.raise_for_status()
        return UserInfo.model_validate(response.json())

    async def get_user_follows(self, username: str) -> list[str]:
        response = await self.client.get(
            "https://api.tweetscout.io/api/follows",
            params={"link": username},
        )
        response.raise_for_status()
        return response.json()
