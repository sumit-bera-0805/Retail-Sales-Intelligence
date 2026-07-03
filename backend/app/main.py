from fastapi import FastAPI

# Import Routers
from backend.app.api.health import router as health_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.sales import router as sales_router
from backend.app.api.customers import router as customers_router
from backend.app.api.products import router as products_router
from backend.app.api.regions import router as regions_router

# Create FastAPI App
app = FastAPI(
    title="Retail Sales Intelligence API",
    description="End-to-End Retail Sales Intelligence Platform using FastAPI, PostgreSQL, SQL and Power BI",
    version="1.0.0"
)

# Register Routers
app.include_router(health_router)
app.include_router(dashboard_router)
app.include_router(sales_router)
app.include_router(customers_router)
app.include_router(products_router)
app.include_router(regions_router)

# Home Route
@app.get("/", tags=["Home"])
def home():
    return {
        "message": "Retail Sales Intelligence API is Running 🚀",
        "version": "1.0.0",
        "documentation": "http://127.0.0.1:8000/docs"
    }