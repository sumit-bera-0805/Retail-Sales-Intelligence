-- =============================================
-- Top Profitable Products
-- =============================================

SELECT
    product_name,
    category,
    ROUND(SUM(profit),2) AS total_profit,
    ROUND(SUM(sales),2) AS total_sales
FROM raw_data.superstore_raw
GROUP BY
    product_name,
    category
ORDER BY
    total_profit DESC
LIMIT 10;