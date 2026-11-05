import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000
)

db = client[DATABASE_NAME]

def check_database_connection():
    client.admin.command("ping")
    return True