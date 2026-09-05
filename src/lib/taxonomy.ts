/**
 * Shortlist.ie taxonomy.
 *
 * Maps the raw category slugs stored on supplier rows (imported from the
 * directory spreadsheet) to public-facing URL slugs and display labels, and
 * lists the counties present in the data.
 */

export type CategoryDef = {
  /** value stored in suppliers.categories */
  key: string;
  /** URL slug used in /{slug}-{county} pages */
  slug: string;
  label: string;
  plural: string;
  blurb: string;
};

export const CATEGORIES: CategoryDef[] = [
  {
    key: "wedding-photographers",
    slug: "wedding-photographers",
    label: "Photographers",
    plural: "Wedding Photographers",
    blurb: "Documentary, fine-art and classic photographers to record the day.",
  },
  {
    key: "cakes-sweet-treats",
    slug: "wedding-cakes",
    label: "Cakes & Sweet Treats",
    plural: "Wedding Cakes",
    blurb: "Tiered cakes, dessert tables and late-night sweet stations.",
  },
  {
    key: "wedding-florists",
    slug: "wedding-florists",
    label: "Florists",
    plural: "Wedding Florists",
    blurb: "Bouquets, ceremony arches, installations and table florals.",
  },
  {
    key: "wedding-bands",
    slug: "wedding-bands",
    label: "Bands",
    plural: "Wedding Bands",
    blurb: "Live bands to fill the floor from the first dance onward.",
  },
  {
    key: "church-singers-music",
    slug: "wedding-singers",
    label: "Singers & Ceremony Music",
    plural: "Wedding Singers",
    blurb: "Soloists, harpists, string trios and church music groups.",
  },
  {
    key: "wedding-videographers",
    slug: "wedding-videographers",
    label: "Videographers",
    plural: "Wedding Videographers",
    blurb: "Cinematic films, highlight reels and full-day coverage.",
  },
  {
    key: "wedding-content-creators",
    slug: "wedding-content-creators",
    label: "Content Creators",
    plural: "Wedding Content Creators",
    blurb:
      "Short-form wedding content creators for social clips, reels and behind-the-scenes coverage.",
  },
  {
    key: "make-up-artists",
    slug: "wedding-makeup-artists",
    label: "Makeup Artists",
    plural: "Wedding Makeup Artists",
    blurb: "Bridal makeup, trials and on-the-day touch-ups for the party.",
  },
  {
    key: "beauty-skincare",
    slug: "wedding-beauty-skincare",
    label: "Beauty & Skincare",
    plural: "Wedding Beauty & Skincare",
    blurb: "Skin clinics, beauty treatments and pre-wedding skincare support.",
  },
  {
    key: "wedding-hair-stylists",
    slug: "wedding-hair-stylists",
    label: "Hair Stylists",
    plural: "Wedding Hair Stylists",
    blurb: "Bridal hair design, trials and morning-of styling teams.",
  },
  {
    key: "wedding-djs",
    slug: "wedding-djs",
    label: "DJs",
    plural: "Wedding DJs",
    blurb: "Resident and mobile DJs for the afters and late bar.",
  },
  {
    key: "wedding-celebrants",
    slug: "wedding-celebrants",
    label: "Celebrants",
    plural: "Wedding Celebrants",
    blurb: "Solemnisers and celebrants for civil and spiritual ceremonies.",
  },
  {
    key: "wedding-planners",
    slug: "wedding-planners",
    label: "Planners",
    plural: "Wedding Planners",
    blurb: "Full planning, partial planning and on-the-day coordination.",
  },
  {
    key: "wedding-cars",
    slug: "wedding-transport",
    label: "Transport",
    plural: "Wedding Transport",
    blurb: "Vintage cars, buses and chauffeur services for the wedding party.",
  },
  {
    key: "wedding-decor-lighting-styling",
    slug: "wedding-decor-styling",
    label: "Decor, Lighting & Styling",
    plural: "Wedding Decor & Styling",
    blurb: "Room styling, draping, lighting design and prop hire.",
  },
  {
    key: "wedding-entertainment-photobooths",
    slug: "wedding-entertainment",
    label: "Entertainment & Photobooths",
    plural: "Wedding Entertainment",
    blurb: "Photobooths, magicians, casino tables and novelty acts.",
  },
  {
    key: "bridal-shops-accessories",
    slug: "bridal-shops",
    label: "Bridal Shops & Accessories",
    plural: "Bridal Shops",
    blurb: "Boutiques, designer gowns, veils and bridal accessories.",
  },
  {
    key: "bridesmaid-dresses",
    slug: "bridesmaid-dresses",
    label: "Bridesmaid Dresses",
    plural: "Bridesmaid Dresses",
    blurb: "Dresses, fittings and styling for bridesmaids and the bridal party.",
  },
  {
    key: "groomswear",
    slug: "groomswear",
    label: "Groomswear",
    plural: "Groomswear",
    blurb: "Suit hire, made-to-measure tailoring and groomsmen outfitting.",
  },
  {
    key: "wedding-invitations-stationery",
    slug: "wedding-stationery",
    label: "Invitations & Stationery",
    plural: "Wedding Stationery",
    blurb: "Invitations, save the dates, signage and on-the-day print.",
  },
  {
    key: "catering-wine",
    slug: "wedding-catering",
    label: "Catering & Wine",
    plural: "Wedding Catering",
    blurb: "Independent caterers, food trucks and drinks specialists.",
  },
  {
    key: "wedding-jewellers",
    slug: "wedding-jewellers",
    label: "Jewellers",
    plural: "Wedding Jewellers",
    blurb: "Engagement rings, wedding bands and bespoke commissions.",
  },
  {
    key: "wedding-gifts-favours",
    slug: "wedding-favours",
    label: "Gifts & Favours",
    plural: "Wedding Gifts & Favours",
    blurb: "Guest favours, thank-you gifts and keepsakes.",
  },
  {
    key: "marquee-hire",
    slug: "marquee-hire",
    label: "Marquee Hire",
    plural: "Marquee Hire",
    blurb: "Tipis, sailcloth marquees and structures for outdoor weddings.",
  },
  {
    key: "hens-stags",
    slug: "hens-and-stags",
    label: "Hens & Stags",
    plural: "Hen & Stag Suppliers",
    blurb: "Activities, packages and party planning before the big day.",
  },
  {
    key: "honeymoon",
    slug: "honeymoons",
    label: "Honeymoons",
    plural: "Honeymoon Specialists",
    blurb: "Travel agents and honeymoon planners for the trip afterwards.",
  },
  {
    key: "health-fitness",
    slug: "health-and-fitness",
    label: "Health & Fitness",
    plural: "Wedding Health & Fitness",
    blurb: "Training, skincare and wellbeing in the run-up to the wedding.",
  },
  {
    key: "childcare-nannies",
    slug: "wedding-childcare",
    label: "Childcare & Nannies",
    plural: "Wedding Childcare",
    blurb: "Creche services and nannies to keep younger guests happy.",
  },
  {
    key: "wedding-services",
    slug: "other-wedding-services",
    label: "Other Services",
    plural: "Other Wedding Services",
    blurb: "Specialist suppliers that do not fit a single category.",
  },
];

export const VENUE_SLUG = "wedding-venues";

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));
export const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));

/** Counties present in the imported listings. */
export const COUNTIES = [
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Donegal",
  "Dublin",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
] as const;

/** Counties surfaced in the homepage "browse by county" grid. */
export const FEATURED_COUNTIES = [
  "Dublin",
  "Cork",
  "Galway",
  "Kerry",
  "Limerick",
  "Waterford",
  "Clare",
  "Mayo",
  "Donegal",
  "Kilkenny",
  "Wicklow",
  "Meath",
];

export const countySlug = (county: string) => county.toLowerCase().replace(/\s+/g, "-");

export const countyFromSlug = (slug: string) =>
  COUNTIES.find((c) => countySlug(c) === slug.toLowerCase());

export type DirectoryTarget = {
  kind: "venues" | "suppliers";
  category?: CategoryDef | undefined;
  county?: string | undefined;

  /** "Wedding Photographers in Dublin" */
  heading: string;
  blurb: string;
};

/**
 * Parses a directory landing-page slug such as `wedding-photographers-dublin`
 * or `wedding-venues-ireland` into the category + county it represents.
 * Returns null when the slug is not a real directory page.
 */
export function parseDirectorySlug(raw: string): DirectoryTarget | null {
  const slug = raw.toLowerCase();

  const build = (
    base: string,
    kind: "venues" | "suppliers",
    category?: CategoryDef,
  ): DirectoryTarget | null => {
    const plural = category ? category.plural : "Wedding Venues";
    if (slug === `${base}-ireland`) {
      return {
        kind,
        category,
        heading: `${plural} in Ireland`,
        blurb: category
          ? category.blurb
          : "Ceremony and reception venues the length of the country.",
      };
    }
    if (slug.startsWith(`${base}-`)) {
      const county = countyFromSlug(slug.slice(base.length + 1));
      if (county) {
        return {
          kind,
          category,
          county,
          heading: `${plural} in ${county}`,
          blurb: category ? category.blurb : "Ceremony and reception venues across the county.",
        };
      }
    }
    return null;
  };

  const venueMatch = build(VENUE_SLUG, "venues");
  if (venueMatch) return venueMatch;

  // longest slug first so `wedding-hair-stylists` wins over a shorter prefix
  const ordered = [...CATEGORIES].sort((a, b) => b.slug.length - a.slug.length);
  for (const category of ordered) {
    const match = build(category.slug, "suppliers", category);
    if (match) return match;
  }
  return null;
}
