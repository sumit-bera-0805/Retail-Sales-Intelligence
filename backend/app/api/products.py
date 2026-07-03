from fastapi import APIRouter
from sqlalchemy import text
from backend.app.database import engine

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
def products():

    query = text("""
        SELECT
            product_id,
            product_name,
            category,
            SUM(sales) AS total_sales,
            SUM(profit) AS total_profit
        FROM raw_data.superstore_raw
        GROUP BY product_id, product_name, category
        ORDER BY total_sales DESC;
    """)

    with engine.connect() as conn:
        result = conn.execute(query).mappings().all()

    return [dict(row) for row in result]