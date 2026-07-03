from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine

router = APIRouter(prefix="/regions", tags=["Regions"])

@router.get("/")
def regions():

    query = text("""
        SELECT
            region,
            SUM(sales) AS total_sales,
            SUM(profit) AS total_profit
        FROM raw_data.superstore_raw
        GROUP BY region
        ORDER BY total_sales DESC;
    """)

    with engine.connect() as conn:
        result = conn.execute(query).mappings().all()

    return [dict(row) for row in result]