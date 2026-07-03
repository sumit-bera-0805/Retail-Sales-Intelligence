from config.database import engine

try:
    with engine.connect() as connection:
        print("=" * 50)
        print("✅ Connected to PostgreSQL Successfully!")
        print("=" * 50)

except Exception as e:
    print("❌ Connection Failed")
    print(e)