-- =============================================
-- Discount Impact Analysis
-- =============================================

SELECT
    discount,
    COUNT(*) AS total_orders,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit,
    ROUND(AVG(profit),2) AS avg_profit
FROM raw_data.superstore_raw
GROUP BY
    discount
ORDER BY
    discount;