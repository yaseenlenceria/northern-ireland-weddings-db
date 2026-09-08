CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'Ireland',
  county text,
  town_city text,
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
  google_maps_url text,
  phone text,
  source_url text,
  source_site text,
  website text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  rating_label text,
  recommended_percent text,
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
  country text NOT NULL DEFAULT 'Ireland',
  county text,
  town_city text,
  avg_price text,
  avg_price_num numeric,
  rating numeric,
  review_count integer,
  overview text,
  description text,
  slogan text,
  logo_image text,
  banner_image text,
  gallery_images text[],
  video_urls text[],
  featured boolean NOT NULL DEFAULT false,
  award_winner boolean NOT NULL DEFAULT false,
  package_plan text,
  service_areas text[],
  image_count integer,
  address text,
  postcode text,
  latitude numeric,
  longitude numeric,
  google_maps_url text,
  phone text,
  email text,
  contact_person text,
  source_url text,
  source_site text,
  profile_url text,
  website text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  twitter_url text,
  rating_label text,
  recommended_percent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rating numeric;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS review_count integer;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS slogan text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS banner_image text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS video_urls text[];
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS award_winner boolean NOT NULL DEFAULT false;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_plan text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS profile_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS tiktok_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS youtube_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Ireland';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Ireland';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS town_city text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS source_site text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS facebook_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS twitter_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS rating_label text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS recommended_percent text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS town_city text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS postcode text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS source_site text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rating_label text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS recommended_percent text;

CREATE TABLE IF NOT EXISTS wedding_fairs (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  country text NOT NULL DEFAULT 'Ireland',
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

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'listing_enquiry',
  listing_name text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  wedding_date date,
  guest_count integer,
  message text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE wedding_fairs ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Ireland';

CREATE INDEX IF NOT EXISTS venues_country_idx ON venues(country);
CREATE INDEX IF NOT EXISTS venues_county_idx ON venues(county);
CREATE INDEX IF NOT EXISTS venues_featured_idx ON venues(featured);
CREATE INDEX IF NOT EXISTS venues_rating_idx ON venues(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS venues_capacity_max_idx ON venues(capacity_max);
CREATE INDEX IF NOT EXISTS venues_name_trgm_idx ON venues USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS venues_types_idx ON venues USING gin (venue_types);

CREATE INDEX IF NOT EXISTS suppliers_country_idx ON suppliers(country);
CREATE INDEX IF NOT EXISTS suppliers_county_idx ON suppliers(county);
CREATE INDEX IF NOT EXISTS suppliers_featured_idx ON suppliers(featured);
CREATE INDEX IF NOT EXISTS suppliers_award_winner_idx ON suppliers(award_winner);
CREATE INDEX IF NOT EXISTS suppliers_rating_idx ON suppliers(rating DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS suppliers_categories_idx ON suppliers USING gin (categories);
CREATE INDEX IF NOT EXISTS suppliers_name_trgm_idx ON suppliers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS wedding_fairs_country_idx ON wedding_fairs(country);

CREATE INDEX IF NOT EXISTS imported_reviews_venue_idx ON imported_reviews(venue_id);
CREATE INDEX IF NOT EXISTS imported_reviews_supplier_idx ON imported_reviews(supplier_id);
CREATE INDEX IF NOT EXISTS enquiries_supplier_idx ON enquiries(supplier_id);
CREATE INDEX IF NOT EXISTS enquiries_venue_idx ON enquiries(venue_id);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at DESC);
