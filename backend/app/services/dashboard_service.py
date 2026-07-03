from sqlalchemy import text
from backend.app.database import engine


def get_dashboard_data():
    query = text("""
        SELECT
            SUM(sales) AS total_sales,
            SUM(profit) AS total_profit,
            COUNT(DISTINCT order_id) AS total_orders,
            COUNT(DISTINCT customer_id) AS total_customers
        FROM raw_data.superstore_raw;
    """)

    with engine.connect() as conn:
        result = conn.execute(query).mappings().first()

    return dict(result)