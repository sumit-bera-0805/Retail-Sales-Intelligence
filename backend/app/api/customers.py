from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/")
def customers():

    query = text("""
        SELECT
            customer_id,
            customer_name,
            SUM(sales) AS total_sales,
            SUM(profit) AS total_profit
        FROM raw_data.superstore_raw
        GROUP BY customer_id, customer_name
        ORDER BY total_sales DESC;
    """)

    with engine.connect() as conn:
        result = conn.execute(query).mappings().all()

    return [dict(row) for row in result]