from fastapi import APIRouter

from backend.app.schemas.dashboard import DashboardResponse
from backend.app.services.dashboard_service import get_dashboard_data

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/", response_model=DashboardResponse)
def dashboard():
    return get_dashboard_data()