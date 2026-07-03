from fastapi import APIRouter
from sqlalchemy import text

from backend.app.database import engine

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.get("/")
def monthly_sales():

    query = text("""
        SELECT
            DATE_TRUNC('month', order_date) AS month,
            ROUND(SUM(sales)::numeric,2) AS total_sales
        FROM raw_data.superstore_raw
        GROUP BY DATE_TRUNC('month', order_date)
        ORDER BY month;
    """)

    with engine.connect() as conn:
        result = conn.execute(query).mappings().all()

    return [dict(row) for row in result]