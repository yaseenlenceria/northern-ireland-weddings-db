CREATE TABLE public.imported_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE,
  author_name text,
  rating numeric,
  title text,
  body text NOT NULL,
  review_date date,
  source_name text,
  source_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.imported_reviews TO anon;
GRANT SELECT ON public.imported_reviews TO authenticated;
GRANT ALL ON public.imported_reviews TO service_role;

ALTER TABLE public.imported_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "imported reviews public read" ON public.imported_reviews FOR SELECT USING (true);
CREATE POLICY "admin manage imported reviews" ON public.imported_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_imported_reviews_venue ON public.imported_reviews(venue_id);
CREATE INDEX idx_imported_reviews_supplier ON public.imported_reviews(supplier_id);

CREATE TRIGGER t_imported_reviews_upd BEFORE UPDATE ON public.imported_reviews FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();