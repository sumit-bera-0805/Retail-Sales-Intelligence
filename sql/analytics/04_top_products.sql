-- =============================================
-- Top 10 Products by Sales
-- =============================================

SELECT
    product_name,
    category,
    sub_category,
    ROUND(SUM(sales),2) AS total_sales,
    ROUND(SUM(profit),2) AS total_profit,
    SUM(quantity) AS total_quantity
FROM raw_data.superstore_raw
GROUP BY
    product_name,
    category,
    sub_category
ORDER BY
    total_sales DESC
LIMIT 10;