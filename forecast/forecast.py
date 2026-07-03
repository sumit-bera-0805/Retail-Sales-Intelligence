import pandas as pd
from prophet import Prophet
from sqlalchemy import create_engine

# PostgreSQL Connection
DATABASE_URL = "postgresql://postgres:sumit@localhost:5432/retail_sales_intelligence"

engine = create_engine(DATABASE_URL)

# Read historical daily sales
query = """
SELECT
    order_date::date AS ds,
    SUM(sales) AS y
FROM raw_data.superstore_raw
GROUP BY order_date
ORDER BY order_date;
"""

df = pd.read_sql(query, engine)

print("Historical data loaded successfully!")
print(df.head())

# Train Prophet Model
model = Prophet()
model.fit(df)

# Create future dates (90 days)
future = model.make_future_dataframe(periods=90)

# Predict
forecast = model.predict(future)

# Keep only required columns
forecast = forecast[
    ["ds", "yhat", "yhat_lower", "yhat_upper"]
]

# Create analytics schema if it doesn't exist
with engine.begin() as conn:
    conn.exec_driver_sql("""
        CREATE SCHEMA IF NOT EXISTS analytics;
    """)

# Save forecast into PostgreSQL
forecast.to_sql(
    "sales_forecast",
    engine,
    schema="analytics",
    if_exists="replace",
    index=False
)

print("\nForecast generated successfully!")
print(forecast.tail())

print("\nForecast saved to PostgreSQL successfully!")