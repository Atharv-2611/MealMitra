import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("mealmitra")

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "mealmitra")

client = None
db = None
is_connected = False

try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
    db = client[DATABASE_NAME]
    # Ping database to verify live connection
    client.admin.command("ping")
    is_connected = True
    logger.info("Connected to MongoDB at %s, database: %s", MONGODB_URL, DATABASE_NAME)
    
    # Initialize 2dsphere geospatial indexes for GeoJSON Point queries
    try:
        db["restaurants"].create_index([("location", "2dsphere")])
        db["donations"].create_index([("pickupLocation", "2dsphere")])
        logger.info("Geospatial 2dsphere indexes verified on restaurants and donations.")
    except Exception as idx_err:
        logger.warning("Could not create 2dsphere index: %s", idx_err)

except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
    logger.warning("MongoDB not reachable at %s (%s). Operating in persistent fallback mode.", MONGODB_URL, e)
    is_connected = False
    # If client is not available or ping failed, db will be checked in operations


def check_database_connection():
    if client is not None:
        try:
            client.admin.command("ping")
            return True
        except Exception:
            return False
    return False


def get_db():
    return db
