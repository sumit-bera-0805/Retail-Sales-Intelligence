import pandas as pd
from sqlalchemy import text
from config.database import engine

# Read CSV
df = pd.read_csv("data/raw/Sample - Superstore.csv", encoding="latin1")

# Rename columns
df.columns = (
    df.columns.str.lower()
    .str.replace(" ", "_")
    .str.replace("-", "_")
)

# Convert dates
df["order_date"] = pd.to_datetime(df["order_date"])
df["ship_date"] = pd.to_datetime(df["ship_date"])

# Convert postal code to string
df["postal_code"] = df["postal_code"].astype(str)

with engine.begin() as conn:
    conn.execute(text("TRUNCATE TABLE raw_data.superstore_raw;"))

df.to_sql(
    "superstore_raw",
    schema="raw_data",
    con=engine,
    if_exists="append",
    index=False,
    chunksize=1000
)

print(f"✅ Loaded {len(df)} rows successfully.")