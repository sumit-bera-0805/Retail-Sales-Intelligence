from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def dashboard():

    return {

        "total_sales": 2300000,

        "customers": 793,

        "products": 1862,

        "profit": 286000,

        "monthly_sales": [
            120,
            150,
            170,
            180,
            210,
            240,
            280,
            310,
            295,
            340,
            390,
            450
        ]

    }