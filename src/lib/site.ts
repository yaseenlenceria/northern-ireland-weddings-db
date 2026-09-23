export const BRAND = {
  name: "WedHQ",
  tagline: "Marketing & SEO for Irish Wedding Businesses",
  promise:
    "Get found by couples searching on Google. WedHQ helps wedding venues, photographers, planners and suppliers turn search visibility into real enquiries.",
  promiseShort: "More visibility. More relevant enquiries. More bookings.",
} as const;

export type ServiceLink = {
  slug: string;
  name: string;
  short: string;
  summary: string;
};

export const SERVICES: ServiceLink[] = [
  {
    slug: "wedding-seo",
    name: "Wedding SEO",
    short: "Wedding SEO",
    summary:
      "Keyword research, technical SEO, on-page optimisation, internal linking and content that builds lasting search visibility for wedding businesses.",
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    short: "Local SEO",
    summary:
      "County, city and service-area optimisation so couples in the locations you actually cover can find your business.",
  },
  {
    slug: "technical-seo",
    name: "Technical SEO",
    short: "Technical SEO",
    summary:
      "Site speed, indexing, crawlability, mobile experience and the behind-the-scenes health that decides whether Google can rank you at all.",
  },
  {
    slug: "content-seo",
    name: "Content & SEO Strategy",
    short: "Content Strategy",
    summary:
      "Real weddings, venue guides, FAQs and advice content planned around what couples actually search for.",
  },
  {
    slug: "seo-audits",
    name: "SEO Audits",
    short: "SEO Audits",
    summary:
      "A clear review of your rankings, technical issues, local visibility and conversion problems — with prioritised actions.",
  },
  {
    slug: "website-optimisation",
    name: "Website Optimisation",
    short: "Website Optimisation",
    summary:
      "Improve the service pages, structure, copy and calls to action on the website you already have, without a rebuild.",
  },
];

export type IndustryLink = {
  slug: string;
  name: string;
  plural: string;
};

export const INDUSTRIES: IndustryLink[] = [
  { slug: "wedding-venue-seo", name: "wedding venue", plural: "Wedding Venues" },
  {
    slug: "wedding-photographer-seo",
    name: "wedding photographer",
    plural: "Wedding Photographers",
  },
  {
    slug: "wedding-videographer-seo",
    name: "wedding videographer",
    plural: "Wedding Videographers",
  },
  { slug: "wedding-planner-seo", name: "wedding planner", plural: "Wedding Planners" },
  { slug: "wedding-florist-seo", name: "wedding florist", plural: "Florists" },
  { slug: "wedding-band-seo", name: "wedding band", plural: "Bands" },
  { slug: "wedding-dj-seo", name: "wedding DJ", plural: "DJs" },
  { slug: "wedding-celebrant-seo", name: "wedding celebrant", plural: "Celebrants" },
  { slug: "bridal-shop-seo", name: "bridal shop", plural: "Bridal Boutiques" },
  {
    slug: "wedding-hair-makeup-seo",
    name: "wedding hair and makeup artist",
    plural: "Hair & Makeup",
  },
  { slug: "wedding-cake-seo", name: "wedding cake business", plural: "Wedding Cake Businesses" },
  { slug: "wedding-transport-seo", name: "wedding transport business", plural: "Transport" },
  { slug: "wedding-stationery-seo", name: "wedding stationery business", plural: "Stationery" },
  {
    slug: "wedding-decor-hire-seo",
    name: "wedding décor and event hire company",
    plural: "Décor & Event Hire",
  },
];

/** Broad categories shown in the homepage "Who we help" grid. */
export const WHO_WE_HELP = [
  "Wedding Venues",
  "Wedding Photographers",
  "Wedding Videographers",
  "Wedding Planners",
  "Florists",
  "Bands & DJs",
  "Celebrants",
  "Bridal Boutiques",
  "Hair & Makeup Artists",
  "Wedding Cake Businesses",
  "Wedding Transport",
  "Décor & Event Hire",
  "Stationery",
  "Wedding Content Creators",
  "Other Wedding Suppliers",
] as const;

export const COUNTIES = [
  "Dublin",
  "Cork",
  "Galway",
  "Kerry",
  "Wicklow",
  "Limerick",
  "Kildare",
  "Meath",
  "Clare",
  "Waterford",
  "Kilkenny",
  "Wexford",
  "Other / multiple counties",
  "All of Ireland",
] as const;

export const MARKETING_CHALLENGES = [
  "I barely get any website traffic",
  "I get traffic but very few enquiries",
  "I rely almost entirely on Instagram",
  "Competitors rank above me on Google",
  "I don't know what's wrong with my website",
  "I don't know where to start with SEO",
  "Other",
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Audit",
    body: "We review your website, current rankings, technical SEO, content and local visibility to understand exactly where you stand today.",
  },
  {
    number: "02",
    title: "Opportunity Map",
    body: "We research the keywords, locations, services and competitors that matter for your business, and map where realistic wins are.",
  },
  {
    number: "03",
    title: "Improve",
    body: "We optimise your pages, content, internal linking, technical setup and local relevance — focused on the changes that move enquiries.",
  },
  {
    number: "04",
    title: "Measure & Grow",
    body: "We track rankings, Search Console performance and traffic, and keep building on what is working, month after month.",
  },
] as const;

export type Faq = { question: string; answer: string };

export const HOME_FAQS: Faq[] = [
  {
    question: "Who is WedHQ for?",
    answer:
      "WedHQ is for wedding businesses in Ireland — venues, photographers, videographers, planners, florists, bands, DJs, celebrants, bridal boutiques, cake makers, transport companies, décor hire and other suppliers — who want more couples to find them through Google.",
  },
  {
    question: "Do you only work with Irish wedding businesses?",
    answer:
      "Ireland is our specialism and the market we build everything around. If you serve couples getting married in Ireland — even if your business is based elsewhere — we can help.",
  },
  {
    question: "What is included in the free SEO audit?",
    answer:
      "We review your website, its visibility on Google, technical issues, local SEO signals, page structure and conversion opportunities, then send you a summary of the key findings and what we would fix first. There is no cost and no obligation.",
  },
  {
    question: "How long does SEO take?",
    answer:
      "SEO is a compounding channel, not an instant one. Some fixes, like page titles or a Google Business Profile issue, can have an effect within weeks. Competitive ranking improvements usually build over three to six months and keep growing from there. We will always tell you honestly what timeline is realistic for your market.",
  },
  {
    question: "Can you help if most of my leads come from Instagram?",
    answer:
      "Yes — that is one of the most common starting points. Instagram works while you are posting, but it does not capture couples who are actively searching and comparing suppliers. SEO adds a channel that works in the background and compounds over time.",
  },
  {
    question: "Do you work with Shopify, WordPress and other website platforms?",
    answer:
      "Yes. We work with WordPress, Shopify, Squarespace, Wix, Showit, Webflow and custom builds. The platform matters far less than the structure, content and technical health of the site.",
  },
  {
    question: "Can you improve my current website instead of rebuilding it?",
    answer:
      "In most cases, yes. Improving an existing website's structure, pages and content is usually faster and more cost-effective than starting again. We will tell you honestly if a rebuild would serve you better.",
  },
  {
    question: "Do you offer local SEO?",
    answer:
      "Yes. Local SEO is a core part of what we do for Irish wedding businesses: Google Business Profile optimisation, county and town targeting, service-area pages, reviews and local links.",
  },
  {
    question: "Can you help with Google Search Console?",
    answer:
      "Yes. We set up Search Console correctly if it is missing, and use it to find indexing problems, ranking opportunities and the queries couples actually use to find businesses like yours.",
  },
  {
    question: "Do you offer ongoing monthly SEO?",
    answer:
      "Yes. After the initial improvements, ongoing monthly work builds content, authority and local visibility, and keeps you ahead of competitors. Some clients start with a one-off audit and go from there.",
  },
];
