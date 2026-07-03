-- =============================================
-- Top 10 Customers by Sales
-- =============================================

SELECT
    customer_name,
    segment,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit
FROM raw_data.superstore_raw
GROUP BY
    customer_name,
    segment
ORDER BY
    total_sales DESC
LIMIT 10;