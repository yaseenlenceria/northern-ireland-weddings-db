export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  datePublished: string;
  intro: string;
  sections: ArticleSection[];
};

export const ARTICLES_PART_1: Article[] = [
  {
    slug: "seo-for-wedding-photographers-ireland",
    title: "SEO for Wedding Photographers in Ireland: A Practical Guide",
    metaTitle: "SEO for Wedding Photographers in Ireland | Practical Guide | WedHQ",
    metaDescription:
      "How Irish wedding photographers can rank on Google: county pages, real weddings, venue targeting and portfolio structure that turns searches into bookings.",
    excerpt:
      "County pages, real weddings and venue targeting — how photographers turn a beautiful portfolio into a Google presence that books dates.",
    category: "Guides",
    readMinutes: 7,
    datePublished: "2026-09-23",
    intro:
      "Most wedding photographers' websites are built to show work, not to be found. The portfolio wows, but Google has almost nothing to work with: no locations, no written context, no structure. This guide explains how to fix that without turning your site into a brochure.",
    sections: [
      {
        heading: "Start with where you shoot, not what you shoot",
        paragraphs: [
          "Couples search “wedding photographer” plus a place. That means your counties are your most valuable keywords — not “wedding photography”, which is unwinnable and vague. List the counties where you shoot most often. Those are the foundations of your site structure.",
          "One page per county, each with real substance: weddings you've shot there, venues you know, what couples in that area ask for. A county page with three paragraphs of genuine content and links to three real weddings will outperform any generic “areas we cover” list.",
        ],
      },
      {
        heading: "Your galleries are invisible — add written context",
        paragraphs: [
          "Google reads text, not pixels. A gallery page of 40 images with no captions gives search engines nothing. Each real wedding you publish should name the venue, the county, the season and a sentence or two of story. That alone puts you in the running for searches like “[venue] wedding photographer” — searches couples make after falling for a venue on Pinterest.",
        ],
      },
      {
        heading: "Price searches are buying searches",
        paragraphs: [
          "“Wedding photographer Ireland cost” and “wedding photographer prices dublin” are searched thousands of times. Photographers who publish even a starting price or honest range capture that traffic; those who don't hand it to competitors. A pricing page doesn't cheapen your brand — it respects how couples actually shortlist.",
        ],
      },
      {
        heading: "A simple plan to start this month",
        paragraphs: ["You don't need to rebuild everything. Start here:"],
        list: [
          "Rename your pages honestly: “Wedding Photographer Galway | Your Name”, not “Your Name | Photography”",
          "Publish one real wedding per fortnight with venue, county and story",
          "Create your first county page for the county you shoot most",
          "Set up or refresh your Google Business Profile with recent work",
          "Add one pricing page, even with ranges",
        ],
      },
      {
        heading: "What to expect",
        paragraphs: [
          "Be realistic: a brand-new county page won't rank overnight. But photographers who publish consistently — real weddings, county pages, venue stories — typically see meaningful search traffic building within three to six months, and unlike Instagram, it doesn't reset every Monday.",
        ],
      },
    ],
  },
  {
    slug: "seo-for-wedding-venues-ireland",
    title: "SEO for Wedding Venues in Ireland: Win Searches Before Directories Do",
    metaTitle: "SEO for Wedding Venues in Ireland | Venue SEO Guide | WedHQ",
    metaDescription:
      "How Irish wedding venues can outrank directories: county and style pages, Google Maps visibility, real weddings and site speed that keeps couples browsing.",
    excerpt:
      "County searches, style searches, the map pack and real weddings — where venue SEO is actually won and lost.",
    category: "Guides",
    readMinutes: 7,
    datePublished: "2026-09-23",
    intro:
      "When a couple searches “wedding venues in Wicklow”, Google shows three things: the map pack, directory listings and the venues that earned their place. Most venues appear in none of the three — they rely on directories to be found, and pay for the privilege in commissions and lost control.",
    sections: [
      {
        heading: "Own your county and style searches",
        paragraphs: [
          "Venue searches stack: county first (“wedding venues kerry”), style second (“castle wedding venue”, “barn wedding venue”), practicalities third (“wedding venues with accommodation”, “venues for 120 guests”). Each combination is a page opportunity. A venue with a country house offering, exclusive use and on-site accommodation can justify three or four dedicated pages where most venues have one homepage.",
          "The rule: a page must earn its ranking with substance. Your castle-style page should talk about the specific experience only your venue offers — not a generic “stunning castle setting” paragraph.",
        ],
      },
      {
        heading: "The map pack is half the battle",
        paragraphs: [
          "“Wedding venues near me” triggers Google Maps results, and venues with complete, active Google Business Profiles win them. Categories set correctly, services listed, wedding photos added regularly, reviews that mention weddings specifically, questions answered — this is unglamorous work with an outsized effect, because the map pack often appears above the standard results.",
        ],
      },
      {
        heading: "Speed is a booking feature",
        paragraphs: [
          "Venue websites are famously heavy: full-screen hero videos, uncompressed galleries, five font families. Couples browse on phones — on commutes, at lunch, in bed. If your homepage takes six seconds to load, they never see your ballroom. Compressing images, lazy-loading galleries and trimming scripts routinely cuts load times by more than half, and faster venues keep browsing.",
        ],
      },
      {
        heading: "Real weddings are your ranking engine",
        paragraphs: [
          "Every real wedding published with a title like “Autumn Wedding at [Your Venue] — [Season] in [County]” creates a page that ranks for long-tail searches and demonstrates exactly what a wedding at your venue looks and feels like. Directories can list you; they can't tell a couple's story in your voice.",
        ],
        list: [
          "Publish real weddings consistently — monthly is enough",
          "Name the season, style and county in every title",
          "Link each one to your enquiry page and capacity/pricing info",
          "Collect supplier credits — they'll share and link back",
        ],
      },
      {
        heading: "Protect your brand searches",
        paragraphs: [
          "When a couple hears about you and Googles your venue's name, who appears? If the answer is “a directory first”, you're losing the most valuable traffic you have. Venue SEO starts with making sure your own site is the obvious, authoritative result for your own name — then expands outward to county and style terms.",
        ],
      },
    ],
  },
  {
    slug: "seo-for-wedding-planners",
    title: "SEO for Wedding Planners: Get Found by Couples Who Are Ready",
    metaTitle: "SEO for Wedding Planners | Rank & Get Consultations | WedHQ",
    metaDescription:
      "A practical SEO guide for wedding planners: service-specific pages, cost content, county targeting and trust signals that turn searches into consultations.",
    excerpt:
      "Planner searches are trust searches. Here's how to structure your site so couples researching planners find you first.",
    category: "Guides",
    readMinutes: 6,
    datePublished: "2026-09-23",
    intro:
      "Nobody hires a wedding planner on a whim. Couples research for months: what planners do, what they cost, who works in their county, who's planned weddings at venues like theirs. SEO is how you're present through all of that research — not just at the final, referral-driven moment.",
    sections: [
      {
        heading: "Give each service its own page",
        paragraphs: [
          "Full planning, partial planning and on-the-day coordination are three different services that couples search for separately. Bundling them onto one page means you rank for none of them. Separate pages let you answer the specific questions each type of couple asks — and the couple searching “on the day wedding coordinator” is much closer to booking than one searching “wedding planning”.",
        ],
      },
      {
        heading: "Answer the cost question before your competitors do",
        paragraphs: [
          "“How much does a wedding planner cost in Ireland?” is one of the highest-volume questions in the industry, and it's mostly answered by UK and US content. A page that honestly explains how Irish planners structure fees — percentage, flat fee, day rate — earns rankings and positions you as the transparent option before a couple ever speaks to you.",
        ],
      },
      {
        heading: "Show your work with location detail",
        paragraphs: [
          "Your portfolio should read like evidence, not decoration. Every real wedding feature should name the venue, county and planning scope. This does three jobs at once: it ranks for venue-specific searches, it proves you've worked where the couple is getting married, and it builds the county-level relevance that lifts your county pages.",
        ],
      },
      {
        heading: "Trust signals planners forget",
        paragraphs: [
          "Couples hiring planners are buying judgement and calm. The pages that convert are the ones that demonstrate both:",
        ],
        list: [
          "An about page with your voice, not just credentials",
          "Testimonials that describe your process, not just the result",
          "A clear “how we work” page from first call to wedding day",
          "Real budgets or timelines (anonymised) that show your thinking",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "If your site is one services page and a gallery, start by splitting services into their own pages, add one county page for your home region, and write the cost-explainer page. Those three moves cover the majority of planner-intent searches in your area.",
        ],
      },
    ],
  },
  {
    slug: "local-seo-for-wedding-suppliers",
    title: "Local SEO for Wedding Suppliers: Win Your County Before You Dream of National Rankings",
    metaTitle: "Local SEO for Wedding Suppliers in Ireland | WedHQ",
    metaDescription:
      "Local SEO for Irish wedding businesses: Google Business Profile, county pages, reviews and service-area signals that put you in front of nearby couples.",
    excerpt:
      "Google Business Profile, county pages, reviews and near-me searches — how wedding suppliers win the searches that happen on their doorstep.",
    category: "Local SEO",
    readMinutes: 6,
    datePublished: "2026-09-23",
    intro:
      "Wedding bookings are local bookings. A photographer in Kilkenny doesn't need to win “wedding photographer Ireland” — they need to win Kilkenny, and the neighbouring counties they'd happily drive to. Local SEO is how smaller businesses beat bigger names in the places that matter.",
    sections: [
      {
        heading: "Your Google Business Profile is your second homepage",
        paragraphs: [
          "For searches with local intent — “wedding florist galway”, “bridal shop near me” — Google shows map results before website results. Your Google Business Profile decides whether you're in that pack. The essentials:",
        ],
        list: [
          "Correct primary category (e.g. “Wedding photographer”, “Wedding venue”)",
          "Service areas set to the counties you actually cover",
          "Wedding-specific photos added regularly, not once",
          "Reviews from real couples — and replies to every review",
          "Your website linked, and your hours and booking details current",
        ],
      },
      {
        heading: "County pages that earn their keep",
        paragraphs: [
          "A county page only ranks if it deserves to. “Wedding photographer Cork” should show Cork weddings you've shot, Cork venues you know, and how working in Cork actually looks for you — travel, timing, favourite spots. Ten minutes of swapping place names on a template does nothing; an afternoon of genuine content can hold a ranking for years.",
        ],
      },
      {
        heading: "Reviews are local currency",
        paragraphs: [
          "Reviews influence map-pack placement and conversions alike. Build a simple habit: after every wedding, one message with a direct link to your Google review form. Steady, recent reviews beat a burst of twenty from three years ago.",
        ],
      },
      {
        heading: "Be consistent everywhere",
        paragraphs: [
          "Your business name, area and details should match across your website, Google profile, Instagram and any directories. Small mismatches quietly erode Google's confidence in your details. Uniformity is boring and effective.",
        ],
      },
      {
        heading: "Don't fake it",
        paragraphs: [
          "Pages for counties you've never worked in, or a “Dublin office” that doesn't exist, risk penalties and always disappoint couples. Target the places you genuinely serve, with content that proves it. Local SEO rewards real businesses — that's the opportunity.",
        ],
      },
    ],
  },
  {
    slug: "wedding-website-seo-checklist",
    title: "The Wedding Website SEO Checklist: 21 Points to Check Today",
    metaTitle: "Wedding Website SEO Checklist | 21 Points for Irish Suppliers | WedHQ",
    metaDescription:
      "A 21-point SEO checklist for wedding websites: indexing, page titles, local signals, speed, content and conversion checks. Work through it in an afternoon.",
    excerpt:
      "Twenty-one practical checks — from indexing to calls to action — that reveal whether couples can actually find your wedding business on Google.",
    category: "Checklists",
    readMinutes: 8,
    datePublished: "2026-09-23",
    intro:
      "You don't need to be an SEO professional to spot most of what's holding a wedding website back. Work through this checklist — an afternoon, a coffee, no tools beyond a browser and Google Search Console — and you'll have a clearer picture than most of your competitors.",
    sections: [
      {
        heading: "Foundations: can Google see you at all?",
        paragraphs: ["Before anything else, confirm the basics:"],
        list: [
          "Search site:yourdomain.com on Google — do your key pages appear?",
          "Google Search Console is set up and verified for your site",
          "Your important pages are indexed (no “Discovered – currently not indexed” warnings on money pages)",
          "You have a sitemap submitted in Search Console",
          "robots.txt isn't accidentally blocking pages",
        ],
      },
      {
        heading: "Local signals: does Google know where you work?",
        paragraphs: ["Wedding bookings are local. Check:"],
        list: [
          "Your counties or service areas are mentioned naturally on your key pages",
          "Your Google Business Profile is claimed, categorised and complete",
          "Your name, address and phone details are consistent across the web",
          "You have at least a few Google reviews, replied to, from real couples",
        ],
      },
      {
        heading: "Pages: does each page have a job?",
        paragraphs: ["Look at your five most important pages and check:"],
        list: [
          "Every page has one clear topic and one unique page title",
          "Titles read like searches: “Wedding Florist Galway | Brand”, not “Home”",
          "Each page has one H1 heading and logical H2s beneath it",
          "Service pages describe the service in couples' words, not just yours",
          "Every page has one obvious next step — enquire, book, call",
        ],
      },
      {
        heading: "Content: is there anything here for Google to rank?",
        paragraphs: ["Honest questions about your content:"],
        list: [
          "Your galleries have captions, locations or stories — not just images",
          "You have at least a few real weddings or case studies published",
          "There's an about page with a real human voice",
          "Pricing questions are addressed, even with ranges",
        ],
      },
      {
        heading: "Technical & speed: does the experience hold up?",
        paragraphs: ["Mostly testable on your phone:"],
        list: [
          "Your homepage loads in a couple of seconds on mobile data",
          "Images are compressed and lazy-loaded",
          "Text is readable without zooming; buttons are tap-friendly",
          "No horizontal scrolling or broken layouts on a phone",
          "Internal links connect your services, locations and content pages",
        ],
      },
      {
        heading: "What next?",
        paragraphs: [
          "Scored badly in a few places? That's normal — and fixable. The fastest wins are usually page titles, Google Business Profile and image compression. If you'd like a professional set of eyes on it, request the free SEO audit and we'll tell you exactly what we'd fix first.",
        ],
      },
    ],
  },
  {
    slug: "how-wedding-businesses-can-rank-on-google",
    title: "How Wedding Businesses Can Rank on Google (Without an Agency Budget)",
    metaTitle: "How Wedding Businesses Can Rank on Google | WedHQ",
    metaDescription:
      "How Irish wedding businesses actually rank on Google: keyword realism, page structure, content depth and patience. A plain-English explanation of the process.",
    excerpt:
      "A plain-English explanation of how ranking actually works for wedding businesses — and the order to do things in.",
    category: "Fundamentals",
    readMinutes: 7,
    datePublished: "2026-09-23",
    intro:
      "SEO advice for wedding businesses tends to be either vague (“create great content!”) or impenetrable (Core Web Vitals scores and entity graphs). Here's the middle path: how ranking actually works, explained plainly, with the order of operations that gets results.",
    sections: [
      {
        heading: "First, understand what you're competing for",
        paragraphs: [
          "Google ranks pages, not businesses, and it ranks them for specific searches. You will not rank for “wedding photographer” — nobody owns that search, and the results are a national free-for-all. You can absolutely rank for “wedding photographer Waterford”, “documentary wedding photographer Ireland” or “[venue] wedding photographer”. Realistic targets are specific. That's not a limitation; it's the strategy.",
        ],
      },
      {
        heading: "The three things Google weighs",
        paragraphs: [
          "Strip away the jargon and three factors decide most wedding-industry rankings:",
        ],
        list: [
          "Relevance — does your page clearly match the search? (Titles, headings, content)",
          "Authority — do other trusted places point to and mention you? (Links, reviews, mentions)",
          "Experience — does your page load fast and work well on phones? (Speed, mobile, structure)",
        ],
      },
      {
        heading: "The order that works",
        paragraphs: [
          "Sequence matters more than effort. Doing step four before step one is why most wedding websites plateau:",
        ],
        list: [
          "Make sure Google can see and index your site (Search Console)",
          "Fix the foundations: titles, headings, speed, mobile experience",
          "Build the right pages: services, counties, real weddings",
          "Publish content consistently that answers couples' real questions",
          "Earn local links and reviews — venues, directories worth having, collaborations",
        ],
      },
      {
        heading: "How long ranking takes",
        paragraphs: [
          "Honest expectations: technical fixes can show effects in weeks. New pages typically take two to four months to find their level. Competitive terms build over six to twelve months of consistent work. Anyone promising page one in a month is either lying or targeting searches nobody makes.",
        ],
      },
      {
        heading: "The compounding part",
        paragraphs: [
          "Unlike ads or Instagram, rankings you earn tend to stay earned. A real wedding published today can bring enquiries for years. That's the whole case for SEO: you're building an asset instead of renting attention.",
        ],
      },
    ],
  },
];
