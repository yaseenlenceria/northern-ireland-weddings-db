CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  county text,
  badge text,
  guest_capacity text,
  capacity_min integer,
  capacity_max integer,
  per_person_price text,
  per_person_price_num numeric,
  rating numeric,
  review_count integer,
  overview text,
  description text,
  logo_image text,
  gallery_images text[],
  venue_types text[],
  styles text[],
  facilities text[],
  brochures text[],
  real_weddings text[],
  featured boolean NOT NULL DEFAULT false,
  address text,
  postcode text,
  contact_person text,
  contact_role text,
  latitude numeric,
  longitude numeric,
  phone text,
  source_url text,
  website text,
  venue_hire_price text,
  image_count integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  county text,
  avg_price text,
  avg_price_num numeric,
  overview text,
  description text,
  logo_image text,
  gallery_images text[],
  featured boolean NOT NULL DEFAULT false,
  service_areas text[],
  image_count integer,
  address text,
  latitude numeric,
  longitude numeric,
  phone text,
  source_url text,
  website text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_fairs (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  date_text text,
  time_text text,
  venue_name text,
  phone text,
  email text,
  website text,
  image text,
  description text,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS imported_reviews (
  id uuid PRIMARY KEY,
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  author_name text,
  rating numeric,
  title text,
  body text NOT NULL,
  review_date date,
  source_name text,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS venues_county_idx ON venues(county);
CREATE INDEX IF NOT EXISTS venues_featured_idx ON venues(featured);
CREATE INDEX IF NOT EXISTS venues_rating_idx ON venues(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS venues_capacity_max_idx ON venues(capacity_max);
CREATE INDEX IF NOT EXISTS venues_name_trgm_idx ON venues USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS venues_types_idx ON venues USING gin (venue_types);

CREATE INDEX IF NOT EXISTS suppliers_county_idx ON suppliers(county);
CREATE INDEX IF NOT EXISTS suppliers_featured_idx ON suppliers(featured);
CREATE INDEX IF NOT EXISTS suppliers_categories_idx ON suppliers USING gin (categories);
CREATE INDEX IF NOT EXISTS suppliers_name_trgm_idx ON suppliers USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS imported_reviews_venue_idx ON imported_reviews(venue_id);
CREATE INDEX IF NOT EXISTS imported_reviews_supplier_idx ON imported_reviews(supplier_id);
