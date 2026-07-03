from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from backend.app.api.health import router as health_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.sales import router as sales_router
from backend.app.api.customers import router as customers_router
from backend.app.api.products import router as products_router
from backend.app.api.regions import router as regions_router

app = FastAPI(
    title="Retail Sales Intelligence API",
    description="Enterprise Retail Analytics Platform",
    version="1.0.0"
)

templates = Jinja2Templates(directory="backend/app/templates")

app.include_router(health_router)
app.include_router(dashboard_router)
app.include_router(sales_router)
app.include_router(customers_router)
app.include_router(products_router)
app.include_router(regions_router)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request
        }
    )