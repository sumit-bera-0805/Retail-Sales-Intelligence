from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_sales: float
    total_profit: float
    total_orders: int
    total_customers: int