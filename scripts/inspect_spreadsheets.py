from __future__ import annotations

from pathlib import Path

import pandas as pd


FILES = [
    Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland2.xlsx"),
    Path(r"C:\Users\Seenu\weddingdates-scrape\Wedding_Planners_Ireland.xlsx"),
    Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingDates_Directory_Complete.xlsx"),
    Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland.xlsx"),
    Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland_Top50.xlsx"),
]


def main() -> None:
    for file_path in FILES:
        print(f"\nFILE {file_path.name}")
        workbook = pd.ExcelFile(file_path)
        for sheet_name in workbook.sheet_names:
            data = pd.read_excel(file_path, sheet_name=sheet_name)
            print(f"SHEET {sheet_name} rows={len(data)} cols={list(data.columns)}")
            if not data.empty:
                sample = data.head(1).to_json(orient="records", force_ascii=False)
                print(f"SAMPLE {sample[:1400]}")


if __name__ == "__main__":
    main()
