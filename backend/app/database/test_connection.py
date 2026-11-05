from app.database.connection import check_database_connection

try:
    check_database_connection()
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection failed:", e)