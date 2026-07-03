-- =============================================
-- Monthly Sales Trend Analysis
-- =============================================

SELECT
    DATE_TRUNC('month', order_date) AS month,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit,
    SUM(quantity) AS total_quantity,
    COUNT(DISTINCT order_id) AS total_orders
FROM raw_data.superstore_raw
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;