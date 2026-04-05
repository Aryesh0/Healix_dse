from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DB_NAME

client: AsyncIOMotorClient = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGO_URI)


async def close_db():
    global client
    if client:
        client.close()


def get_db():
    return client[DB_NAME]
