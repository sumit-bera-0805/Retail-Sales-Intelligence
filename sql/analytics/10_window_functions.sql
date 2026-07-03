-- =============================================
-- Running Total of Monthly Sales
-- =============================================

SELECT
    DATE_TRUNC('month', order_date) AS month,
    ROUND(SUM(sales),2) AS monthly_sales,

    ROUND(
        SUM(SUM(sales))
        OVER (
            ORDER BY DATE_TRUNC('month', order_date)
        ),2
    ) AS running_total

FROM raw_data.superstore_raw

GROUP BY DATE_TRUNC('month', order_date)

ORDER BY month;