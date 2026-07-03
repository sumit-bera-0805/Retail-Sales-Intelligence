import pandas as pd

# Path to the CSV file
file_path = "data/raw/Sample - Superstore.csv"

# Read the CSV
df = pd.read_csv(file_path, encoding="latin1")

print("=" * 50)
print("Retail Sales Intelligence Platform")
print("=" * 50)

print("\nFirst 5 Rows:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())