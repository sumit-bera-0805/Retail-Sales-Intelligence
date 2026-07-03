from openpyxl import Workbook
from sqlalchemy import create_engine
import pandas as pd

DATABASE_URL = "postgresql://postgres:sumit@localhost:5432/retail_sales_intelligence"

engine = create_engine(DATABASE_URL)


def generate_excel_report():
    query = """
    SELECT
        order_date,
        customer_name,
        category,
        sales,
        profit
    FROM raw_data.superstore_raw
    ORDER BY order_date;
    """

    df = pd.read_sql(query, engine)

    wb = Workbook()
    ws = wb.active
    ws.title = "Sales Report"

    ws.append(df.columns.tolist())

    for row in df.itertuples(index=False):
        ws.append(list(row))

    output_file = "reports/output/Retail_Sales_Report.xlsx"
    wb.save(output_file)

    print(f"Excel report saved: {output_file}")


if __name__ == "__main__":
    generate_excel_report()