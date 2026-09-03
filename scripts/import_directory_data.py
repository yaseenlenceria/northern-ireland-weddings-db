from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time
import uuid
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import pandas as pd


SOURCE_FILES = {
    "hitched_part_2": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland2.xlsx"),
    "wedding_planners": Path(r"C:\Users\Seenu\weddingdates-scrape\Wedding_Planners_Ireland.xlsx"),
    "weddingdates": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingDates_Directory_Complete.xlsx"),
    "hitched": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland.xlsx"),
    "hitched_top_50": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland_Top50.xlsx"),
}

IMPORT_NAMESPACE = uuid.UUID("f907c78a-7915-41f0-8469-14fb7061deab")


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not path.exists():
        return env
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def clean(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    text = str(value).strip()
    if not text or text.lower() in {"nan", "none", "null"}:
        return None
    return text.replace("\u00a0", " ")


def clean_text(value: Any) -> str | None:
    text = clean(value)
    if text is None:
        return None
    return re.sub(r"\s+", " ", text).strip()


def number(value: Any) -> float | None:
    text = clean(value)
    if text is None:
        return None
    match = re.search(r"-?\d+(?:[.,]\d+)?", text.replace(",", ""))
    if not match:
        return None
    try:
        return float(match.group(0))
    except ValueError:
        return None


def integer(value: Any) -> int | None:
    parsed = number(value)
    return int(parsed) if parsed is not None else None


def slugify(value: str) -> str:
    text = value.lower()
    text = text.replace("&", " and ")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "listing"


def stable_id(kind: str, slug: str) -> str:
    return str(uuid.uuid5(IMPORT_NAMESPACE, f"{kind}:{slug}"))


def split_list(value: Any) -> list[str] | None:
    text = clean(value)
    if text is None:
        return None
    parts = re.split(r"\s*(?:,|\n|\r|;|\|)\s*", text)
    out = [p.strip() for p in parts if p and p.strip()]
    return out or None


def split_images(value: Any) -> list[str] | None:
    text = clean(value)
    if text is None:
        return None
    urls = re.findall(r"https?://[^\s,;|]+", text)
    return urls or split_list(text)


def first(*values: Any) -> str | None:
    for value in values:
        text = clean_text(value)
        if text is not None:
            return text
    return None


def best_record(existing: dict[str, Any] | None, incoming: dict[str, Any]) -> dict[str, Any]:
    if existing is None:
        return incoming
    result = dict(existing)
    for key, value in incoming.items():
        if value in (None, "", []):
            continue
        old = result.get(key)
        if old in (None, "", []):
            result[key] = value
        elif key in {"description", "overview"} and isinstance(value, str) and isinstance(old, str) and len(value) > len(old):
            result[key] = value
        elif key in {"gallery_images", "venue_types", "styles", "facilities", "service_areas", "brochures", "real_weddings", "categories"}:
            combined = []
            for item in [*(old or []), *(value or [])]:
                if item not in combined:
                    combined.append(item)
            result[key] = combined
        elif key == "image_count" and isinstance(value, int) and (not isinstance(old, int) or value > old):
            result[key] = value
    return result


def add_unique(target: dict[str, dict[str, Any]], record: dict[str, Any], kind: str) -> dict[str, Any]:
    base_slug = slugify(record["slug"])
    slug = base_slug
    suffix = 2
    while slug in target and target[slug].get("name") != record.get("name"):
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    record["slug"] = slug
    record["id"] = stable_id(kind, slug)
    target[slug] = best_record(target.get(slug), record)
    return target[slug]


def venue_from_weddingdates(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_text(row.get("Venue Name"))
    if not name:
        return None
    county = clean_text(row.get("County"))
    gallery = split_images(row.get("Gallery Images (all)"))
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "county": county,
        "badge": clean_text(row.get("Type / Badge")),
        "guest_capacity": clean_text(row.get("Guest Capacity")),
        "capacity_min": None,
        "capacity_max": integer(row.get("Guest Capacity")),
        "per_person_price": clean_text(row.get("Per Person Price")),
        "per_person_price_num": number(row.get("Per Person Price")),
        "venue_hire_price": clean_text(row.get("Venue Hire Price")),
        "rating": number(row.get("Rating (out of 5)")),
        "review_count": integer(row.get("Review Count")),
        "overview": clean_text(row.get("Overview")),
        "description": clean_text(row.get("Description")),
        "logo_image": clean_text(row.get("Logo Image")),
        "gallery_images": gallery,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "venue_types": split_list(row.get("Venue Types")),
        "styles": split_list(row.get("Styles")),
        "facilities": split_list(row.get("Facilities")),
        "real_weddings": split_list(row.get("Real Weddings (titles)")),
        "brochures": split_list(row.get("Brochures")),
        "featured": False,
        "address": clean_text(row.get("Address")),
        "postcode": clean_text(row.get("Postcode")),
        "contact_person": clean_text(row.get("Contact Person")),
        "contact_role": clean_text(row.get("Contact Role")),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_text(row.get("Phone")),
        "source_url": clean_text(row.get("Profile URL")),
        "website": clean_text(row.get("Website")),
    }


def venue_from_hitched(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_text(row.get("Name"))
    if not name:
        return None
    county = clean_text(row.get("County"))
    gallery = split_images(first(row.get("Gallery Images (all)"), row.get("All Images"), row.get("Top Image")))
    capacity_text = first(row.get("Capacity (range)"), row.get("Capacity"))
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "county": county,
        "badge": clean_text(row.get("Category")),
        "guest_capacity": capacity_text,
        "capacity_min": integer(row.get("Min Guests")),
        "capacity_max": integer(first(row.get("Max Guests"), capacity_text)),
        "per_person_price": first(row.get("Price From")),
        "per_person_price_num": number(row.get("Price From")),
        "rating": number(row.get("Rating")),
        "review_count": integer(first(row.get("Review Count"), row.get("Reviews"))),
        "overview": first(row.get("Description (short")),
        "description": first(row.get("Description"), row.get("All FAQs")),
        "logo_image": first(row.get("Logo Image"), row.get("Logo")),
        "gallery_images": gallery,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "venue_types": split_list(first(row.get("Venue Types"), row.get("Venue Types / Services"))),
        "styles": split_list(row.get("Ceremony Options")),
        "facilities": split_list(first(row.get("Dining Options"), row.get("Evening Entertainment"), row.get("Other Features"))),
        "featured": clean_text(row.get("Premium Listing")) == "Yes",
        "address": first(row.get("Full Address"), row.get("Street")),
        "postcode": clean_text(row.get("Postcode/Eircode")),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_text(row.get("Phone")),
        "source_url": clean_text(row.get("Profile URL")),
        "website": clean_text(row.get("Website")),
    }


def supplier_from_weddingdates(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_text(row.get("Supplier Name"))
    if not name:
        return None
    county = clean_text(row.get("County"))
    gallery = split_images(row.get("Gallery Images (all)"))
    categories = split_list(row.get("Categories")) or ["wedding-suppliers"]
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "categories": [slugify(c) for c in categories],
        "county": county,
        "avg_price": clean_text(row.get("Avg Price")),
        "avg_price_num": number(row.get("Avg Price")),
        "overview": clean_text(row.get("Overview")),
        "description": clean_text(row.get("Description")),
        "logo_image": clean_text(row.get("Logo Image")),
        "gallery_images": gallery,
        "featured": False,
        "service_areas": None,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "address": clean_text(row.get("Address")),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_text(row.get("Phone")),
        "source_url": clean_text(row.get("Profile URL")),
        "website": clean_text(row.get("Website")),
    }


def supplier_from_planner(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_text(row.get("Name"))
    if not name:
        return None
    county = clean_text(row.get("County"))
    gallery = split_images(row.get("Gallery Images"))
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "categories": ["wedding-planners"],
        "county": county,
        "avg_price": clean_text(row.get("Avg Price")),
        "avg_price_num": number(row.get("Avg Price")),
        "overview": clean_text(row.get("Overview")),
        "description": clean_text(row.get("Description")),
        "logo_image": clean_text(row.get("Logo")),
        "gallery_images": gallery,
        "featured": False,
        "service_areas": ["Ireland"],
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "address": clean_text(row.get("Address")),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_text(row.get("Phone")),
        "source_url": clean_text(row.get("Profile URL")),
        "website": clean_text(row.get("Website")),
    }


def fair_from_weddingdates(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_text(row.get("Event Name"))
    if not name:
        return None
    date_text = clean_text(row.get("Date"))
    return {
        "id": stable_id("wedding_fairs", slugify(f"{name}-{date_text or ''}")),
        "slug": slugify(f"{name}-{date_text or ''}"),
        "name": name,
        "date_text": date_text,
        "time_text": clean_text(row.get("Time")),
        "venue_name": clean_text(row.get("Venue")),
        "phone": clean_text(row.get("Phone (in text)")),
        "email": clean_text(row.get("Email (in text)")),
        "website": clean_text(row.get("Website (in text)")),
        "image": clean_text(row.get("Image")),
        "description": clean_text(row.get("Description")),
        "source_url": clean_text(row.get("Event URL")),
    }


def review_records(parent_kind: str, parent_id: str, row: dict[str, Any]) -> list[dict[str, Any]]:
    source_url = clean_text(row.get("Profile URL"))
    out = []
    for key in ["Top Review 1", "Top Review 2", "Top Review 3", "Top Reviews (verbatim)"]:
        body = clean_text(row.get(key))
        if not body:
            continue
        out.append({
            "id": stable_id("review", f"{parent_id}:{key}:{body[:80]}"),
            "venue_id": parent_id if parent_kind == "venue" else None,
            "supplier_id": parent_id if parent_kind == "supplier" else None,
            "author_name": None,
            "rating": number(row.get("Rating")),
            "title": None,
            "body": body,
            "source_name": clean_text(row.get("Source Site")) or "Imported spreadsheet",
            "source_url": source_url,
        })
    return out


def frame(path_key: str, sheet_name: str) -> pd.DataFrame:
    return pd.read_excel(SOURCE_FILES[path_key], sheet_name=sheet_name)


def build_payload() -> dict[str, list[dict[str, Any]]]:
    venues: dict[str, dict[str, Any]] = {}
    suppliers: dict[str, dict[str, Any]] = {}
    fairs: dict[str, dict[str, Any]] = {}
    reviews: dict[str, dict[str, Any]] = {}

    for _, row in frame("weddingdates", "Venues").iterrows():
        record = venue_from_weddingdates(row.to_dict())
        if record:
            added = add_unique(venues, record, "venue")
            for review in review_records("venue", added["id"], row.to_dict()):
                reviews[review["id"]] = review

    for key, sheet in [
        ("hitched", "Hitched Venues (IE)"),
        ("hitched_part_2", "Hitched Venues 2"),
        ("hitched_top_50", "Wedding Venues"),
    ]:
        for _, row in frame(key, sheet).iterrows():
            record = venue_from_hitched(row.to_dict())
            if record:
                added = add_unique(venues, record, "venue")
                for review in review_records("venue", added["id"], row.to_dict()):
                    reviews[review["id"]] = review

    for _, row in frame("weddingdates", "Suppliers").iterrows():
        record = supplier_from_weddingdates(row.to_dict())
        if record:
            added = add_unique(suppliers, record, "supplier")
            for review in review_records("supplier", added["id"], row.to_dict()):
                reviews[review["id"]] = review

    for _, row in frame("wedding_planners", "Wedding Planners").iterrows():
        record = supplier_from_planner(row.to_dict())
        if record:
            added = add_unique(suppliers, record, "supplier")
            for review in review_records("supplier", added["id"], row.to_dict()):
                reviews[review["id"]] = review

    for _, row in frame("weddingdates", "Wedding Fairs").iterrows():
        record = fair_from_weddingdates(row.to_dict())
        if record:
            fairs[record["slug"]] = best_record(fairs.get(record["slug"]), record)

    return {
        "venues": list(venues.values()),
        "suppliers": list(suppliers.values()),
        "wedding_fairs": list(fairs.values()),
        "imported_reviews": list(reviews.values()),
    }


def api_headers(key: str) -> dict[str, str]:
    headers = {
        "apikey": key,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    if not key.startswith("sb_"):
        headers["Authorization"] = f"Bearer {key}"
    return headers


def post_batch(url: str, key: str, table: str, rows: list[dict[str, Any]], batch_size: int) -> None:
    if not rows:
        return
    endpoint = f"{url.rstrip('/')}/rest/v1/{table}?{urlencode({'on_conflict': 'id'})}"
    headers = api_headers(key)
    for start in range(0, len(rows), batch_size):
        batch = rows[start:start + batch_size]
        body = json.dumps(batch, ensure_ascii=False).encode("utf-8")
        request = Request(endpoint, data=body, headers=headers, method="POST")
        try:
            with urlopen(request, timeout=60) as response:
                if response.status >= 300:
                    raise RuntimeError(f"{table} import returned HTTP {response.status}")
        except HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{table} import failed with HTTP {exc.code}: {detail}") from exc
        except URLError as exc:
            raise RuntimeError(f"{table} import failed: {exc}") from exc
        print(f"Imported {table}: {min(start + batch_size, len(rows))}/{len(rows)}")
        time.sleep(0.1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Import wedding directory spreadsheets into Supabase.")
    parser.add_argument("--env-file", default=".env")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--out", default=None, help="Optional JSON output file for the generated payload.")
    parser.add_argument("--batch-size", type=int, default=100)
    args = parser.parse_args()

    payload = build_payload()
    summary = {table: len(rows) for table, rows in payload.items()}
    print(json.dumps(summary, indent=2))

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.dry_run:
        return

    env = {**load_env(Path(args.env_file)), **os.environ}
    supabase_url = env.get("SUPABASE_URL") or env.get("VITE_SUPABASE_URL")
    supabase_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("SUPABASE_PUBLISHABLE_KEY") or env.get("VITE_SUPABASE_PUBLISHABLE_KEY")

    if not supabase_url or not supabase_key:
        print("Missing Supabase URL/key. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before importing.", file=sys.stderr)
        raise SystemExit(2)

    key_type = "service role" if env.get("SUPABASE_SERVICE_ROLE_KEY") else "publishable"
    print(f"Using {key_type} key for import.")
    for table in ["venues", "suppliers", "wedding_fairs", "imported_reviews"]:
        post_batch(supabase_url, supabase_key, table, payload[table], args.batch_size)


if __name__ == "__main__":
    main()
