-- =============================================
-- Region Performance Analysis
-- =============================================

SELECT
    region,
    state,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit,
    SUM(quantity) AS total_quantity
FROM raw_data.superstore_raw
GROUP BY
    region,
    state
ORDER BY
    total_sales DESC;