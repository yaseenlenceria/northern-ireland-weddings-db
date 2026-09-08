from __future__ import annotations

import argparse
import json
import math
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


SOURCE_FILES = {
    "master": Path(r"C:\Users\Seenu\weddingdates-scrape\Master_Ireland_Wedding_Directory.xlsx"),
    "weddingdates_full": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingDates_Ireland_Full.xlsx"),
    "weddingsonline": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingsOnline_Ireland.xlsx"),
    "hitched_part_2": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland2.xlsx"),
    "wedding_planners": Path(r"C:\Users\Seenu\weddingdates-scrape\Wedding_Planners_Ireland.xlsx"),
    "weddingdates": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingDates_Directory_Complete.xlsx"),
    "hitched": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland.xlsx"),
    "hitched_top_50": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_Ireland_Top50.xlsx"),
    "wedding_suppliers": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingSuppliers_Ireland.xlsx"),
    "wedding_suppliers_2": Path(r"C:\Users\Seenu\weddingdates-scrape\WeddingSuppliers_Ireland2.xlsx"),
    "hitched_uk": Path(r"C:\Users\Seenu\weddingdates-scrape\Hitched_UK.xlsx"),
}

FULL_SUPPLIER_SHEETS = [
    "Bands",
    "Bridal Shops & Accessories",
    "Cakes & Sweet Treats",
    "Catering & Wine",
    "Celebrants",
    "Childcare & Nannies",
    "Church Singers & Music",
    "Decor, Lighting & Styling",
    "Djs",
    "Entertainment & Photobooths",
    "Florists",
    "Gifts & Favours",
    "Groomswear",
    "Hair Stylists",
    "Health & Fitness",
    "Hen & Stag",
    "Honeymoon",
    "Invitations & Stationery",
    "Jewellers",
    "Make Up Artists, Beauty & Cosme",
    "Marquee Hire",
    "Photographers",
    "Planners",
    "Services",
    "Transport",
    "Videographers",
]

WEDDINGSONLINE_SUPPLIER_SHEETS = [
    "Beauty & Skincare",
    "Bridesmaid Dresses",
    "Cakes & Accessories",
    "Ceremony Music",
    "Photographers",
]

WEDDING_SUPPLIERS_SOURCE_KEYS = ["wedding_suppliers", "wedding_suppliers_2"]

IMPORT_NAMESPACE = uuid.UUID("f907c78a-7915-41f0-8469-14fb7061deab")
PLACEHOLDER_IMAGE_MARKERS = (
    "image_placeholder",
    "defaultnoimage",
    "default-no-image",
    "no-image",
    "noimage",
    "placeholder",
    "undefined",
)
UNAVAILABLE_IMAGE_MARKERS = (
    "://cdn0.hitched.ie/",
    "://www.weddingsuppliers.ie/uploads/",
    "://www.weddingsuppliers.ie/public/uploads/",
)


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


def combine_lists(*values: Any) -> list[str] | None:
    out: list[str] = []
    seen: set[str] = set()
    for value in values:
        for item in split_list(value) or []:
            key = item.casefold()
            if key not in seen:
                seen.add(key)
                out.append(item)
    return out or None


def location_list(*values: Any) -> list[str] | None:
    out: list[str] = []
    seen: set[str] = set()
    for item in combine_lists(*values) or []:
        if re.search(r"(https?://|www\.|\.(?:co\.uk|ie|com|net|org)\b)", item, re.I):
            continue
        if re.fullmatch(r"[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}", item.strip(), re.I):
            continue
        key = item.casefold()
        if key not in seen:
            seen.add(key)
            out.append(item)
    return out or None


def split_images(value: Any) -> list[str] | None:
    text = clean(value)
    if text is None:
        return None
    urls = re.findall(r"https?://[^\s,;|]+", text)
    images = urls or split_list(text)
    if not images:
        return None
    useful = [image for image in (clean_image_url(image) for image in images) if image]
    return useful or None


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
        elif key in {"description", "overview", "slogan"} and isinstance(value, str) and isinstance(old, str) and len(value) > len(old):
            result[key] = value
        elif key in {"gallery_images", "venue_types", "styles", "facilities", "service_areas", "brochures", "real_weddings", "categories", "video_urls"}:
            combined = []
            for item in [*(old or []), *(value or [])]:
                if item not in combined:
                    combined.append(item)
            result[key] = combined
        elif key == "image_count" and isinstance(value, int) and (not isinstance(old, int) or value > old):
            result[key] = value
        elif key == "review_count" and isinstance(value, int) and (not isinstance(old, int) or value > old):
            result[key] = value
        elif key in {"rating", "avg_price_num"} and isinstance(value, (int, float)) and old in (None, "", []):
            result[key] = value
        elif key in {"featured", "award_winner"} and isinstance(value, bool):
            result[key] = bool(old) or value
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


def has_listing_image(record: dict[str, Any]) -> bool:
    return bool(record.get("banner_image") or record.get("logo_image") or record.get("gallery_images"))


def should_import_supplier(record: dict[str, Any]) -> bool:
    if record.get("country") == "United Kingdom":
        return True
    if "wedding-cars" in (record.get("categories") or []) and not has_listing_image(record):
        return False
    return True


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
        "logo_image": clean_image_url(row.get("Logo Image")),
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
        "logo_image": clean_image_url(first(row.get("Logo Image"), row.get("Logo"))),
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


def clean_mojibake(value: Any) -> str | None:
    text = clean_text(value)
    if text is None:
        return None
    return (
        text.replace("�", "'")
        .replace("â€™", "'")
        .replace("â€“", "-")
        .replace("â€”", "-")
        .replace("Â", "")
    )


def clean_phone(value: Any) -> str | None:
    text = clean_mojibake(value)
    if not text:
        return None
    if re.fullmatch(r"\d+\.0", text):
        text = text[:-2]
    digits = re.sub(r"\D+", "", text)
    if digits.startswith("353"):
        return f"+{digits}"
    if len(digits) == 9 and digits.startswith("8"):
        return f"0{digits}"
    return text


def clean_url(value: Any, host: str | None = None) -> str | None:
    text = clean_mojibake(value)
    if not text:
        return None
    text = text.strip()
    if text.startswith("@"):
        text = text[1:]
    if text.lower() in {"n/a", "na", "none", "no", "0"}:
        return None
    if text.startswith(("http://", "https://")):
        return text
    if host and " " not in text and "." not in text:
        return f"https://{host}/{text.strip('/')}"
    if re.match(r"^(?:www\.|[a-z0-9-]+\.)", text, flags=re.I):
        return f"https://{text}"
    return None


def clean_image_url(value: Any) -> str | None:
    url = clean_url(value)
    if not url:
        return None
    lowered = url.lower()
    if any(marker in lowered for marker in PLACEHOLDER_IMAGE_MARKERS):
        return None
    if any(marker in lowered for marker in UNAVAILABLE_IMAGE_MARKERS):
        return None
    return url


def split_urls(*values: Any) -> list[str] | None:
    combined: list[str] = []
    for value in values:
        text = clean_mojibake(value)
        if not text:
            continue
        urls = re.findall(r"https?://[^\s,;|]+", text)
        if not urls:
            urls = [item for item in (split_list(text) or []) if item.startswith(("http://", "https://"))]
        for url in urls:
            cleaned = clean_url(url)
            if cleaned and cleaned not in combined:
                combined.append(cleaned)
    return combined or None


def source_url_from_row(row: dict[str, Any]) -> str | None:
    for key in ["Profile URL", "Categories", "Source URL"]:
        value = clean_url(row.get(key))
        if value and value.startswith("http"):
            return value
    return None


def category_from_sheet(sheet_name: str) -> str:
    replacements = {
        "Bands": "Wedding Bands",
        "Beauty & Skincare": "Beauty Skincare",
        "Bridal Shops & Accessories": "Bridal Shops Accessories",
        "Bridesmaid Dresses": "Bridesmaid Dresses",
        "Bridal Shops": "Bridal Shops Accessories",
        "DJs": "Wedding DJs",
        "Cakes & Accessories": "Cakes Sweet Treats",
        "Cakes & Sweet Treats": "Cakes Sweet Treats",
        "Cakes & Toppers": "Cakes Sweet Treats",
        "Catering & Bars": "Catering Wine",
        "Catering & Wine": "Catering Wine",
        "Celebrants": "Wedding Celebrants",
        "Celebrants & Solemnisers": "Wedding Celebrants",
        "Childcare & Nannies": "Childcare Nannies",
        "Church Singers & Music": "Church Singers Music",
        "Content Creators": "Wedding Content Creators",
        "Decor & Event Styling": "Wedding Decor Lighting Styling",
        "Decor, Lighting & Styling": "Wedding Decor Lighting Styling",
        "Djs": "Wedding DJs",
        "Entertainment": "Wedding Entertainment Photobooths",
        "Entertainment & Photobooths": "Wedding Entertainment Photobooths",
        "Florists": "Wedding Florists",
        "Gifts & Favours": "Wedding Gifts Favours",
        "Hair Stylists": "Wedding Hair Stylists",
        "Health & Fitness": "Health Fitness",
        "Hen & Stag": "Hens Stags",
        "Jewellers": "Wedding Jewellers",
        "Invitations & Stationery": "Wedding Invitations Stationery",
        "Make Up Artists, Beauty & Cosme": "Make Up Artists",
        "Other Services": "Wedding Services",
        "Photobooth & Selfie Mirrors": "Wedding Entertainment Photobooths",
        "Photographers": "Wedding Photographers",
        "Planners": "Wedding Planners",
        "Wedding Music": "Church Singers Music",
        "Wedding Planners": "Wedding Planners",
        "Services": "Wedding Services",
        "Transport": "Wedding Cars",
        "Videographers": "Wedding Videographers",
    }
    return replacements.get(sheet_name, sheet_name)


CANONICAL_CATEGORY_ALIASES = {
    "accessories": "bridal-shops-accessories",
    "bands": "wedding-bands",
    "bands-marquee-hire-in-ireland-private-and-exclusive-wedding-venues-castle-wedding-venues": "wedding-bands",
    "beauty-and-skincare": "beauty-skincare",
    "beauty-and-make-up": "make-up-artists",
    "beauty-make-up": "make-up-artists",
    "beauty-hair-and-make-up": "make-up-artists",
    "bridal-shops": "bridal-shops-accessories",
    "cakes-and-accessories": "cakes-sweet-treats",
    "cakes-and-toppers": "cakes-sweet-treats",
    "cakes-accessories": "cakes-sweet-treats",
    "cakes": "cakes-sweet-treats",
    "cars-and-travel": "wedding-cars",
    "catering-and-bars": "catering-wine",
    "catering": "catering-wine",
    "ceremony-music": "church-singers-music",
    "celebrants": "wedding-celebrants",
    "celebrants-and-solemnisers": "wedding-celebrants",
    "content-creators": "wedding-content-creators",
    "decor-and-event-styling": "wedding-decor-lighting-styling",
    "decorative-hire": "wedding-decor-lighting-styling",
    "destinations": "honeymoon",
    "entertainment": "wedding-entertainment-photobooths",
    "favours": "wedding-gifts-favours",
    "florists": "wedding-florists",
    "groom-attire": "groomswear",
    "bridalwear-shops": "bridal-shops-accessories",
    "catering-sweets": "catering-wine",
    "ceremony-music-pre-dinner-music": "church-singers-music",
    "childcare": "childcare-nannies",
    "destination-weddings": "wedding-planners",
    "entertainment-dj-s-and-sax": "wedding-djs",
    "gifts-and-favours": "wedding-gifts-favours",
    "grooms-wear-and-styling": "groomswear",
    "hair-stylists": "wedding-hair-stylists",
    "hen-party-and-stag-party": "hens-stags",
    "honeymoons": "honeymoon",
    "irish-dancers": "wedding-entertainment-photobooths",
    "invitations-and-stationery": "wedding-invitations-stationery",
    "jewellers": "wedding-jewellers",
    "magicians": "wedding-entertainment-photobooths",
    "mobile-bar-services": "catering-wine",
    "mobile-bars-and-food-trucks": "catering-wine",
    "mobile-bars-and-food-trucks-mobile-bars-and-food-trucks": "catering-wine",
    "music-and-djs": "wedding-djs",
    "dj-s-and-sax": "wedding-djs",
    "djs": "wedding-djs",
    "other-service": "wedding-services",
    "personalised-items": "wedding-gifts-favours",
    "photo-booths": "wedding-entertainment-photobooths",
    "photobooth-and-selfie-mirrors": "wedding-entertainment-photobooths",
    "photographers": "wedding-photographers",
    "pre-dinner-music": "church-singers-music",
    "something-different": "wedding-entertainment-photobooths",
    "stationery": "wedding-invitations-stationery",
    "sweets": "cakes-sweet-treats",
    "toastmaster": "wedding-services",
    "transport": "wedding-cars",
    "venue": "wedding-venues",
    "videographers": "wedding-videographers",
    "wedding-candles": "wedding-decor-lighting-styling",
    "wedding-invitations-and-stationery": "wedding-invitations-stationery",
    "wedding-invitations-and-stationery-decor-and-event-styling": "wedding-invitations-stationery",
    "wedding-planners-destination-weddings": "wedding-planners",
    "wine-and-bubbles": "catering-wine",
}


def category_key(value: str) -> str:
    key = slugify(value)
    return CANONICAL_CATEGORY_ALIASES.get(key, key)


def county_from_row(row: dict[str, Any]) -> str | None:
    county = clean_mojibake(row.get("County"))
    if county:
        return county.removeprefix("Co. ").strip()
    location = clean_mojibake(row.get("Location Text"))
    if not location:
        return None
    match = re.search(r"\bCo\.\s+([A-Za-z ]+)", location)
    if match:
        return match.group(1).strip()
    return location.removeprefix("Co. ").strip()


def useful_profile_text(value: Any) -> str | None:
    text = clean_mojibake(value)
    if not text:
        return None
    lowered = text.lower()
    if lowered.startswith("awards advertise about contact welcome!") or "use our venue finder > suppliers" in lowered:
        return None
    return text


def boolish(value: Any) -> bool:
    text = clean_text(value)
    if not text:
        return False
    return text.lower() in {"1", "true", "yes", "y", "premium"}


def profile_url_from_row(row: dict[str, Any]) -> str | None:
    return first(row.get("Profile URL"), row.get("Source URL"), row.get("Breadcrumb"))


def date_iso(value: str | None) -> str | None:
    if not value:
        return None
    for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(value.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None


def parse_review_blob(value: Any) -> list[dict[str, Any]]:
    text = clean_mojibake(value)
    if not text:
        return []

    chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n+", text) if chunk.strip()]
    if len(chunks) <= 1:
        pattern = re.compile(r"(?=.{3,160}?\([^()\n]{1,80},\s*\d{1,2}/\d{1,2}/\d{4},\s*\d(?:\.\d)?/5\):)")
        chunks = [chunk.strip() for chunk in pattern.split(text) if chunk.strip()]

    reviews = []
    for chunk in chunks:
        match = re.match(
            r"(?P<title>.+?)\s+\((?P<author>[^,()]+),\s*(?P<date>\d{1,2}/\d{1,2}/\d{4}),\s*(?P<rating>\d(?:\.\d)?)/5\):\s*(?P<body>.+)",
            chunk,
            flags=re.S,
        )
        if match:
            title = clean_review_title(match.group("title"))
            body = clean_mojibake(match.group("body"))
            if body:
                reviews.append({
                    "title": title,
                    "author_name": clean_mojibake(match.group("author")),
                    "review_date": date_iso(match.group("date")),
                    "rating": number(match.group("rating")),
                    "body": body,
                })
        elif len(chunk) > 30:
            reviews.append({
                "title": None,
                "author_name": None,
                "review_date": None,
                "rating": None,
                "body": chunk,
            })
    return reviews


def parse_review_titles_dates(value: Any) -> list[dict[str, Any]]:
    text = clean_mojibake(value)
    if not text:
        return []
    reviews = []
    for chunk in [part.strip() for part in text.split("|") if part.strip()]:
        match = re.match(r"(?P<title>.+?)\s*\((?P<date>[^()]*)\)\s*$", chunk)
        title = clean_review_title(match.group("title") if match else chunk)
        date = clean_text(match.group("date")) if match else None
        if not title:
            continue
        reviews.append({
            "title": title,
            "author_name": None,
            "review_date": date_iso(date),
            "rating": None,
            "body": title,
        })
    return reviews


def clean_review_title(value: Any) -> str | None:
    title = clean_mojibake(value)
    if not title:
        return None
    title = title.strip(" -:;,.\"'")
    words = [word for word in re.split(r"\s+", title) if word]
    if len(title) < 8 or len(words) < 2:
        return None
    return title


def venue_from_master(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_mojibake(row.get("Business Name"))
    if not name:
        return None
    county = clean_mojibake(row.get("County"))
    gallery = split_images(first(row.get("All Images"), row.get("Top Image"), row.get("Logo Image")))
    capacity_text = first(row.get("Capacity"))
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "county": county,
        "badge": clean_mojibake(row.get("Category")),
        "guest_capacity": capacity_text,
        "capacity_min": integer(row.get("Min Guests")),
        "capacity_max": integer(first(row.get("Max Guests"), capacity_text)),
        "per_person_price": clean_mojibake(row.get("Price From")),
        "per_person_price_num": number(row.get("Price From")),
        "venue_hire_price": None,
        "rating": number(row.get("Rating")),
        "review_count": integer(row.get("Review Count")),
        "overview": clean_mojibake(row.get("Description")),
        "description": first(clean_mojibake(row.get("Description")), clean_mojibake(row.get("Extra Info"))),
        "logo_image": clean_image_url(first(row.get("Logo Image"), row.get("Top Image"))),
        "gallery_images": gallery,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "venue_types": split_list(row.get("Services / Venue Types")),
        "styles": None,
        "facilities": split_list(first(row.get("All Facilities & FAQs"), row.get("Extra Info"))),
        "real_weddings": None,
        "brochures": None,
        "featured": boolish(row.get("Premium")),
        "address": clean_mojibake(first(row.get("Full Address"), row.get("Street"))),
        "postcode": clean_mojibake(row.get("Postcode")),
        "contact_person": None,
        "contact_role": None,
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_mojibake(row.get("Phone")),
        "source_url": profile_url_from_row(row),
        "website": clean_mojibake(row.get("Website")),
    }


def supplier_from_master(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_mojibake(row.get("Business Name"))
    if not name:
        return None
    county = clean_mojibake(row.get("County"))
    category = clean_mojibake(row.get("Category")) or "Wedding Suppliers"
    gallery = split_images(first(row.get("All Images"), row.get("Top Image"), row.get("Logo Image")))
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "categories": [category_key(category)],
        "county": county,
        "avg_price": clean_mojibake(row.get("Price From")),
        "avg_price_num": number(row.get("Price From")),
        "overview": clean_mojibake(row.get("Description")),
        "description": first(clean_mojibake(row.get("Description")), clean_mojibake(row.get("Extra Info"))),
        "logo_image": clean_image_url(first(row.get("Logo Image"), row.get("Top Image"))),
        "gallery_images": gallery,
        "featured": boolish(row.get("Premium")),
        "service_areas": split_list(row.get("Areas Served")),
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "address": clean_mojibake(first(row.get("Full Address"), row.get("Street"), row.get("Town/City"))),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_mojibake(row.get("Phone")),
        "source_url": profile_url_from_row(row),
        "profile_url": clean_url(profile_url_from_row(row)),
        "website": clean_mojibake(row.get("Website")),
        "facebook_url": clean_url(row.get("Facebook"), "www.facebook.com"),
        "instagram_url": clean_url(row.get("Instagram"), "www.instagram.com"),
        "twitter_url": clean_url(row.get("Twitter/X"), "twitter.com"),
    }


def supplier_from_weddingdates(row: dict[str, Any], sheet_name: str | None = None) -> dict[str, Any] | None:
    name = clean_mojibake(first(row.get("Supplier Name"), row.get("Name")))
    if not name:
        return None
    if name.lower().startswith("wedding ") and " in " in name.lower() and integer(row.get("Image Count")) == 0:
        return None
    county = county_from_row(row)
    gallery = split_images(first(row.get("Gallery Images (all)"), row.get("All Images")))
    raw_categories = split_list(row.get("Categories"))
    if not raw_categories:
        raw_categories = split_list(row.get("Category"))
    categories = [
        item for item in (raw_categories or [])
        if not item.startswith("http") and not item.lower().startswith("www.")
    ]
    if not categories and sheet_name:
        categories = [category_from_sheet(sheet_name)]
    if not categories:
        categories = ["Wedding Suppliers"]
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "categories": [category_key(c) for c in categories],
        "county": county,
        "avg_price": clean_mojibake(row.get("Avg Price")),
        "avg_price_num": number(row.get("Avg Price")),
        "overview": first(
            useful_profile_text(row.get("Overview")),
            useful_profile_text(row.get("Meta Description")),
            useful_profile_text(row.get("Profile Text (excerpt)")),
        ),
        "description": first(
            useful_profile_text(row.get("Description")),
            useful_profile_text(row.get("Profile Text (excerpt)")),
        ),
        "logo_image": clean_image_url(first(row.get("Logo Image"), row.get("Logo"), row.get("Top Image"))),
        "gallery_images": gallery,
        "featured": False,
        "service_areas": None,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "address": clean_mojibake(first(row.get("Address"), row.get("Town/Address"))),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_mojibake(row.get("Phone")),
        "source_url": source_url_from_row(row),
        "website": clean_mojibake(row.get("Website")),
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
        "logo_image": clean_image_url(row.get("Logo")),
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


def supplier_from_wedding_suppliers(row: dict[str, Any], sheet_name: str) -> dict[str, Any] | None:
    name = clean_mojibake(row.get("Name"))
    if not name:
        return None
    county = county_from_row(row)
    gallery = split_images(row.get("Gallery Images (all)"))
    category = category_from_sheet(sheet_name)
    raw_category = clean_mojibake(row.get("Category"))
    categories = [category_key(category)]
    if raw_category:
        key = category_key(raw_category)
        if key not in categories:
            categories.append(key)
    banner = clean_image_url(row.get("Logo / Banner Image"))
    videos = split_urls(row.get("Videos"), row.get("Reels"))
    profile_url = clean_url(row.get("Profile URL"))
    avg_price_num = number(row.get("Avg Price"))
    avg_price = clean_mojibake(row.get("Avg Price")) if avg_price_num and avg_price_num > 0 else None
    return {
        "slug": slugify(f"{name}-{county or ''}"),
        "name": name,
        "categories": categories,
        "county": county,
        "avg_price": avg_price,
        "avg_price_num": avg_price_num if avg_price_num and avg_price_num > 0 else None,
        "rating": number(row.get("Rating (out of 5)")),
        "review_count": integer(row.get("Review Count")),
        "overview": first(row.get("Overview / Slogan"), row.get("Description (About)")),
        "description": useful_profile_text(row.get("Description (About)")),
        "slogan": clean_mojibake(row.get("Overview / Slogan")),
        "logo_image": banner,
        "banner_image": banner,
        "gallery_images": gallery,
        "video_urls": videos,
        "featured": boolish(row.get("Featured")),
        "award_winner": boolish(row.get("Award Winner")),
        "package_plan": clean_mojibake(row.get("Plan / Package")),
        "service_areas": split_list(row.get("Counties Served")),
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "address": clean_mojibake(row.get("Address / Location")),
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "phone": clean_phone(row.get("Phone")),
        "email": clean_mojibake(row.get("Email")),
        "contact_person": clean_mojibake(row.get("Contact Person")),
        "source_url": profile_url,
        "profile_url": profile_url,
        "website": clean_url(row.get("Website")),
        "facebook_url": clean_url(row.get("Facebook"), "www.facebook.com"),
        "instagram_url": clean_url(row.get("Instagram"), "www.instagram.com"),
        "tiktok_url": clean_url(row.get("TikTok"), "www.tiktok.com"),
        "youtube_url": clean_url(row.get("YouTube"), "www.youtube.com"),
        "twitter_url": clean_url(row.get("Twitter/X"), "twitter.com"),
    }


def venue_from_hitched_uk(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_mojibake(row.get("Name"))
    if not name:
        return None
    county = clean_mojibake(row.get("County/Region"))
    gallery = split_images(row.get("Gallery Images (all)"))
    capacity_text = clean_mojibake(row.get("Capacity (range)"))
    source_url = profile_url_from_row(row)
    return {
        "slug": slugify(f"{name}-{county or ''}-uk"),
        "name": name,
        "country": "United Kingdom",
        "county": county,
        "town_city": clean_mojibake(row.get("Town/City")),
        "badge": "Wedding Venue",
        "guest_capacity": capacity_text,
        "capacity_min": integer(row.get("Min Guests")),
        "capacity_max": integer(first(row.get("Max Guests"), capacity_text)),
        "per_person_price": clean_mojibake(row.get("Price From")),
        "per_person_price_num": number(row.get("Price From")),
        "venue_hire_price": None,
        "rating": number(row.get("Rating")),
        "review_count": integer(row.get("Review Count")),
        "rating_label": clean_mojibake(row.get("Rating Label")),
        "recommended_percent": clean_mojibake(row.get("Recommended %")),
        "overview": useful_profile_text(row.get("Description")),
        "description": first(useful_profile_text(row.get("Description")), useful_profile_text(row.get("All FAQs"))),
        "logo_image": clean_image_url(row.get("Logo Image")),
        "gallery_images": gallery,
        "image_count": integer(row.get("Image Count")) or (len(gallery) if gallery else None),
        "venue_types": split_list(row.get("Venue Types")),
        "styles": split_list(row.get("Ceremony Options")),
        "facilities": combine_lists(
            row.get("Dining Options"),
            row.get("Evening Entertainment"),
            row.get("Overnight Accommodation"),
            row.get("Staff Assistance"),
            row.get("Leisure Facilities"),
            row.get("Other Features"),
            row.get("All FAQs"),
        ),
        "real_weddings": None,
        "brochures": None,
        "featured": boolish(row.get("Premium Listing")),
        "address": clean_mojibake(first(row.get("Full Address"), row.get("Street"))),
        "postcode": clean_mojibake(row.get("Postcode")),
        "contact_person": None,
        "contact_role": None,
        "latitude": number(row.get("Latitude")),
        "longitude": number(row.get("Longitude")),
        "google_maps_url": clean_url(row.get("Google Maps URL")),
        "phone": clean_phone(row.get("Phone")),
        "source_url": source_url,
        "source_site": clean_mojibake(row.get("Source Site")) or "hitched.co.uk",
        "website": clean_url(row.get("Website")),
        "facebook_url": clean_url(row.get("Facebook"), "www.facebook.com"),
        "instagram_url": clean_url(row.get("Instagram"), "www.instagram.com"),
        "twitter_url": clean_url(row.get("Twitter/X"), "twitter.com"),
    }


def supplier_from_hitched_uk(row: dict[str, Any]) -> dict[str, Any] | None:
    name = clean_mojibake(row.get("Name"))
    if not name:
        return None
    county = clean_mojibake(first(row.get("Category"), row.get("County/Region")))
    category = clean_mojibake(row.get("Description Word Count")) or "Wedding Suppliers"
    gallery = split_images(row.get("All FAQs"))
    logo = clean_image_url(row.get("Other Features"))
    source_url = clean_url(row.get("Breadcrumb"))
    return {
        "slug": slugify(f"{name}-{county or ''}-uk"),
        "name": name,
        "categories": [category_key(category)],
        "country": "United Kingdom",
        "county": county,
        "town_city": clean_mojibake(row.get("Town/City")),
        "avg_price": clean_mojibake(row.get("Max Guests")),
        "avg_price_num": number(row.get("Max Guests")),
        "rating": number(row.get("Price From")),
        "review_count": integer(row.get("Rating Label")),
        "rating_label": clean_mojibake(row.get("Review Count")),
        "recommended_percent": clean_mojibake(row.get("Recommended %")),
        "overview": useful_profile_text(row.get("Twitter/X")),
        "description": first(useful_profile_text(row.get("Twitter/X")), useful_profile_text(row.get("Services"))),
        "slogan": None,
        "logo_image": logo,
        "banner_image": logo,
        "gallery_images": gallery,
        "video_urls": None,
        "featured": boolish(row.get("On Platform Since")),
        "award_winner": False,
        "package_plan": "UK directory",
        "service_areas": location_list(county, row.get("Category"), row.get("Town/City")),
        "image_count": integer(row.get("Logo Image")) or (len(gallery) if gallery else None),
        "address": clean_mojibake(first(row.get("Full Address"), row.get("Town/City"))),
        "latitude": number(row.get("Recommended %")),
        "longitude": number(row.get("Latitude")),
        "google_maps_url": clean_url(row.get("Longitude")),
        "phone": None,
        "email": None,
        "contact_person": None,
        "source_url": source_url,
        "source_site": "hitched.co.uk",
        "profile_url": source_url,
        "website": clean_url(row.get("Phone")),
        "facebook_url": clean_url(row.get("Website"), "www.facebook.com"),
        "instagram_url": clean_url(row.get("Facebook"), "www.instagram.com"),
        "tiktok_url": None,
        "youtube_url": None,
        "twitter_url": clean_url(row.get("Instagram"), "twitter.com"),
    }


def hitched_uk_supplier_review_row(row: dict[str, Any]) -> dict[str, Any]:
    source = dict(row)
    source["All Reviews (verbatim)"] = first(row.get("Image Count"), row.get("Image Captions"))
    source["Rating"] = row.get("Price From")
    source["Source Site"] = "hitched.co.uk"
    source["Profile URL"] = clean_url(row.get("Breadcrumb"))
    return source


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
    source_url = profile_url_from_row(row)
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

    review_blob = first(
        row.get("All Reviews (verbatim)"),
        row.get("Top Reviews (verbatim)"),
        row.get("Review Highlights (3)"),
    )
    for index, review in enumerate(parse_review_blob(review_blob)[:20], start=1):
        out.append({
            "id": stable_id("review", f"{parent_id}:parsed:{index}:{review.get('title') or ''}:{review['body'][:80]}"),
            "venue_id": parent_id if parent_kind == "venue" else None,
            "supplier_id": parent_id if parent_kind == "supplier" else None,
            "author_name": review.get("author_name"),
            "rating": review.get("rating") or number(row.get("Rating")),
            "title": review.get("title"),
            "body": review["body"],
            "review_date": review.get("review_date"),
            "source_name": clean_text(row.get("Source Site")) or clean_text(row.get("Listed On (sites)")) or "Imported spreadsheet",
            "source_url": source_url,
        })
    for index, review in enumerate(parse_review_titles_dates(row.get("Reviews (titles & dates)"))[:30], start=1):
        out.append({
            "id": stable_id("review", f"{parent_id}:title-date:{index}:{review.get('title') or ''}:{review['body'][:80]}"),
            "venue_id": parent_id if parent_kind == "venue" else None,
            "supplier_id": parent_id if parent_kind == "supplier" else None,
            "author_name": review.get("author_name"),
            "rating": review.get("rating") or number(row.get("Rating (out of 5)")) or number(row.get("Rating")),
            "title": review.get("title"),
            "body": review["body"],
            "review_date": review.get("review_date"),
            "source_name": clean_text(row.get("Source Site")) or "WeddingSuppliers.ie",
            "source_url": source_url,
        })
    return out


def frame(path_key: str, sheet_name: str) -> pd.DataFrame:
    return pd.read_excel(SOURCE_FILES[path_key], sheet_name=sheet_name)


def workbook_sheets(path_key: str) -> list[str]:
    path = SOURCE_FILES[path_key]
    if not path.exists():
        return []
    return [
        sheet_name
        for sheet_name in pd.ExcelFile(path).sheet_names
        if not sheet_name.lower().startswith("summary")
    ]


def add_hitched_uk_payload(
    venues: dict[str, dict[str, Any]],
    suppliers: dict[str, dict[str, Any]],
    reviews: dict[str, dict[str, Any]],
) -> None:
    if not SOURCE_FILES["hitched_uk"].exists():
        return

    for _, row in frame("hitched_uk", "UK Venues").iterrows():
        row_dict = row.to_dict()
        record = venue_from_hitched_uk(row_dict)
        if record:
            added = add_unique(venues, record, "venue")
            for review in review_records("venue", added["id"], row_dict):
                reviews[review["id"]] = review

    for _, row in frame("hitched_uk", "UK Suppliers").iterrows():
        row_dict = row.to_dict()
        record = supplier_from_hitched_uk(row_dict)
        if record and should_import_supplier(record):
            added = add_unique(suppliers, record, "supplier")
            review_source = hitched_uk_supplier_review_row(row_dict)
            for review in review_records("supplier", added["id"], review_source):
                reviews[review["id"]] = review


def build_payload(uk_only: bool = False) -> dict[str, list[dict[str, Any]]]:
    venues: dict[str, dict[str, Any]] = {}
    suppliers: dict[str, dict[str, Any]] = {}
    fairs: dict[str, dict[str, Any]] = {}
    reviews: dict[str, dict[str, Any]] = {}

    if uk_only:
        add_hitched_uk_payload(venues, suppliers, reviews)
        return {
            "venues": list(venues.values()),
            "suppliers": list(suppliers.values()),
            "wedding_fairs": [],
            "imported_reviews": list(reviews.values()),
        }

    primary_key = "weddingdates_full" if SOURCE_FILES["weddingdates_full"].exists() else "weddingdates"
    use_master = SOURCE_FILES["master"].exists()

    if use_master:
        for _, row in frame("master", "Venues (All)").iterrows():
            row_dict = row.to_dict()
            record = venue_from_master(row_dict)
            if record:
                added = add_unique(venues, record, "venue")
                for review in review_records("venue", added["id"], row_dict):
                    reviews[review["id"]] = review

        for _, row in frame("master", "Suppliers (All)").iterrows():
            row_dict = row.to_dict()
            record = supplier_from_master(row_dict)
            if record and should_import_supplier(record):
                added = add_unique(suppliers, record, "supplier")
                for review in review_records("supplier", added["id"], row_dict):
                    reviews[review["id"]] = review
    else:
        for _, row in frame(primary_key, "Venues").iterrows():
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

        if primary_key == "weddingdates_full":
            for sheet_name in FULL_SUPPLIER_SHEETS:
                for _, row in frame(primary_key, sheet_name).iterrows():
                    record = supplier_from_weddingdates(row.to_dict(), sheet_name)
                    if record and should_import_supplier(record):
                        added = add_unique(suppliers, record, "supplier")
                        for review in review_records("supplier", added["id"], row.to_dict()):
                            reviews[review["id"]] = review
        else:
            for _, row in frame("weddingdates", "Suppliers").iterrows():
                record = supplier_from_weddingdates(row.to_dict())
                if record and should_import_supplier(record):
                    added = add_unique(suppliers, record, "supplier")
                    for review in review_records("supplier", added["id"], row.to_dict()):
                        reviews[review["id"]] = review

        if SOURCE_FILES["wedding_planners"].exists():
            for _, row in frame("wedding_planners", "Wedding Planners").iterrows():
                record = supplier_from_planner(row.to_dict())
                if record and should_import_supplier(record):
                    added = add_unique(suppliers, record, "supplier")
                    for review in review_records("supplier", added["id"], row.to_dict()):
                        reviews[review["id"]] = review

        if SOURCE_FILES["weddingsonline"].exists():
            for sheet_name in WEDDINGSONLINE_SUPPLIER_SHEETS:
                for _, row in frame("weddingsonline", sheet_name).iterrows():
                    record = supplier_from_weddingdates(row.to_dict(), sheet_name)
                    if record and should_import_supplier(record):
                        added = add_unique(suppliers, record, "supplier")
                        for review in review_records("supplier", added["id"], row.to_dict()):
                            reviews[review["id"]] = review

    for source_key in WEDDING_SUPPLIERS_SOURCE_KEYS:
        for sheet_name in workbook_sheets(source_key):
            for _, row in frame(source_key, sheet_name).iterrows():
                row_dict = row.to_dict()
                record = supplier_from_wedding_suppliers(row_dict, sheet_name)
                if record and should_import_supplier(record):
                    added = add_unique(suppliers, record, "supplier")
                    for review in review_records("supplier", added["id"], row_dict):
                        reviews[review["id"]] = review

    for _, row in frame(primary_key, "Wedding Fairs").iterrows():
        record = fair_from_weddingdates(row.to_dict())
        if record:
            fairs[record["slug"]] = best_record(fairs.get(record["slug"]), record)

    add_hitched_uk_payload(venues, suppliers, reviews)

    return {
        "venues": list(venues.values()),
        "suppliers": list(suppliers.values()),
        "wedding_fairs": list(fairs.values()),
        "imported_reviews": list(reviews.values()),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the wedding directory import payload from spreadsheets.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--out", default=None, help="Optional JSON output file for the generated payload.")
    parser.add_argument("--uk-only", action="store_true", help="Only build the Hitched UK import payload.")
    args = parser.parse_args()

    payload = build_payload(uk_only=args.uk_only)
    summary = {table: len(rows) for table, rows in payload.items()}
    print(json.dumps(summary, indent=2))

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    if not args.dry_run:
        print("This script only builds JSON payloads. Run npm run db:import to upsert into Neon Postgres.", file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    main()
