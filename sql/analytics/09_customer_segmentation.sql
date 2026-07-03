-- =============================================
-- Customer Segment Analysis
-- =============================================

SELECT
    segment,
    COUNT(DISTINCT customer_id) AS total_customers,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit,
    ROUND(AVG(sales),2) AS average_order_value
FROM raw_data.superstore_raw
GROUP BY segment
ORDER BY total_sales DESC;