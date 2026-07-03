-- =============================================
-- RFM Analysis
-- =============================================

SELECT
    customer_id,
    customer_name,
    MAX(order_date) AS last_order_date,
    COUNT(DISTINCT order_id) AS frequency,
    ROUND(SUM(sales),2) AS monetary
FROM raw_data.superstore_raw
GROUP BY
    customer_id,
    customer_name
ORDER BY
    monetary DESC;