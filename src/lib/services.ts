import type { Faq } from "./site";

export type ServiceSection = {
  heading: string;
  body: string;
  points?: string[];
};

export type ServicePageData = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  introBullets: string[];
  sections: ServiceSection[];
  forYouIf: string[];
  faqs: Faq[];
};

export const SERVICES_DATA: Record<string, ServicePageData> = {
  "wedding-seo": {
    slug: "wedding-seo",
    name: "Wedding SEO",
    metaTitle: "Wedding SEO Services Ireland | Rank for Searches That Matter | WedHQ",
    metaDescription:
      "Specialist SEO for wedding businesses in Ireland. Keyword research, on-page SEO, internal linking and content strategy that turns Google visibility into enquiries.",
    h1: "Wedding SEO that puts your business in front of couples who are ready to book",
    intro:
      "Couples planning a wedding in Ireland search Google thousands of times before they ever fill in an enquiry form. Wedding SEO is the work of making sure your business shows up in those searches — for your service, your county and the kind of weddings you actually want to book.",
    introBullets: [
      "Built specifically for how couples search for wedding suppliers",
      "Covers your service pages, county pages, content and site structure",
      "Focused on enquiries, not vanity rankings",
    ],
    sections: [
      {
        heading: "Keyword research based on real wedding searches",
        body: "Generic keyword tools miss how couples actually search. We research the phrases couples use at every stage — from early ideas like “unique wedding venues Ireland” to booking-intent searches like “wedding photographer Kilkenny prices” — and map them to the right pages on your site.",
      },
      {
        heading: "On-page SEO for your money pages",
        body: "Your service and location pages are what generate enquiries, so they get the most attention. We optimise page titles, headings, copy, images and internal links so each page has a clear job and a clear chance of ranking.",
      },
      {
        heading: "Content that builds topical authority",
        body: "Google trusts websites that cover their subject in depth. We plan and support content like real weddings, planning guides and venue advice that earns rankings for hundreds of long-tail searches — and feeds authority to your money pages through internal links.",
      },
      {
        heading: "Technical foundations",
        body: "Crawlability, indexing, site speed and mobile experience decide whether everything else can work at all. We make sure the fundamentals are solid so your pages can compete.",
        points: [
          "Indexing and crawl checks in Search Console",
          "Page speed and Core Web Vitals improvements",
          "Clean URL structure and logical internal linking",
        ],
      },
    ],
    forYouIf: [
      "Your website gets little or no traffic from Google",
      "Competitors appear above you for searches in your county",
      "You rely on Instagram and want a channel that works without daily posting",
      "You want bookings from couples actively searching, not just scrolling",
    ],
    faqs: [
      {
        question: "How is wedding SEO different from normal SEO?",
        answer:
          "Wedding searches are seasonal, location-driven and heavily influenced by visual trust. Couples compare many suppliers across several counties, so your site needs service pages, location coverage, real-wedding proof and fast galleries — all working together. A generic SEO checklist misses most of that.",
      },
      {
        question: "Can you guarantee first page rankings?",
        answer:
          "No one can honestly guarantee specific rankings, and we will never pretend otherwise. What we can do is follow a proven process, target keywords where you can realistically compete, and report transparently on what is improving.",
      },
    ],
  },
  "local-seo": {
    slug: "local-seo",
    name: "Local SEO",
    metaTitle: "Local SEO for Wedding Businesses in Ireland | WedHQ",
    metaDescription:
      "County, city and service-area SEO for Irish wedding suppliers. Google Business Profile optimisation, local pages and reviews so nearby couples find you first.",
    h1: "Local SEO that makes you the obvious choice in your county",
    intro:
      "Most wedding bookings happen within a defined area — the counties you travel to, the venue you're based at, the cities you serve. Local SEO makes sure that when couples search “wedding supplier near me” or “your service + your county”, you are right there.",
    introBullets: [
      "Google Business Profile set up and optimised properly",
      "County and town coverage that matches where you actually work",
      "Reviews, citations and local signals that build trust",
    ],
    sections: [
      {
        heading: "Google Business Profile optimisation",
        body: "For many wedding searches, the map results appear above everything else. We optimise your Google Business Profile — categories, services, photos, posts, Q&A and review strategy — so you show up in map results and the profile itself starts generating enquiries.",
      },
      {
        heading: "Location pages with real value",
        body: "A proper location page explains your service in a specific place: venues you've worked at, real weddings from the area, travel and logistics couples ask about. We build county and town pages that deserve to rank, not thin pages with swapped-out place names.",
      },
      {
        heading: "Service-area clarity",
        body: "Couples regularly search “do you travel to…”. Clear service-area signals on your website and Google profile answer that question before it's asked, and help you rank across every county you cover.",
      },
      {
        heading: "Reviews and local trust signals",
        body: "Reviews influence both rankings and conversions. We help you build a simple, consistent way to collect reviews, and make sure they're visible where they matter — on your profile and on your website.",
      },
    ],
    forYouIf: [
      "You work across one or a handful of counties and want to dominate them",
      "Your Google Business Profile is unclaimed, thin or collecting dust",
      "Map results show competitors but not you",
      "Couples find you but ask “do you cover our area?” too often",
    ],
    faqs: [
      {
        question: "Which Irish counties do you target?",
        answer:
          "Wherever your business actually operates. We regularly work with businesses targeting Dublin, Cork, Galway, Kerry, Wicklow, Limerick, Kildare, Meath, Clare, Waterford, Kilkenny, Wexford and beyond. The strategy follows your real service area — never fake location pages.",
      },
      {
        question: "I'm based in one county but travel anywhere. Does local SEO still apply?",
        answer:
          "Yes. Destination and travelling suppliers need a different local structure — service pages paired with the venues and regions you serve — rather than a single-town strategy. That is a normal part of our local SEO work.",
      },
    ],
  },
  "technical-seo": {
    slug: "technical-seo",
    name: "Technical SEO",
    metaTitle: "Technical SEO for Wedding Websites | Speed, Indexing & Site Health | WedHQ",
    metaDescription:
      "Technical SEO for Irish wedding businesses: site speed, Core Web Vitals, indexing, crawlability and mobile experience. Fix what's holding every other effort back.",
    h1: "Technical SEO that stops your website quietly underperforming",
    intro:
      "If Google can't properly crawl, index or load your site, nothing else you do will matter. Technical SEO finds and fixes the hidden problems — slow galleries, missing pages, broken structure — that quietly cap your visibility.",
    introBullets: [
      "Find out which of your pages Google actually indexes",
      "Fix speed and mobile issues that cost you rankings and visitors",
      "A healthy foundation every other effort builds on",
    ],
    sections: [
      {
        heading: "Indexing and crawlability",
        body: "We check Search Console for pages Google can't find, pages it won't index, redirect chains, broken links and duplicate content. Wedding sites accumulate these issues quietly — old blogs, orphaned pages, gallery plugins — and each one dilutes your site's authority.",
      },
      {
        heading: "Site speed and Core Web Vitals",
        body: "Wedding websites are heavy: full-width galleries, video backgrounds, custom fonts. Couples on mobile data in a field at a venue won't wait, and neither will Google. We compress and lazy-load images, tame scripts and fix whatever is making your pages slow.",
      },
      {
        heading: "Mobile experience",
        body: "The overwhelming majority of couples browse on their phones, often between meetings or late at night. We make sure your site isn't just responsive but genuinely comfortable on mobile — readable text, tap-friendly buttons and no horizontal scrolling.",
      },
      {
        heading: "Site architecture",
        body: "A clear structure — services, locations, content, proof — helps both visitors and search engines understand your business. We untangle messy menus and internal linking so authority flows to the pages that win you work.",
      },
    ],
    forYouIf: [
      "Your site takes more than a couple of seconds to load on a phone",
      "Search Console shows errors, exclusions or pages “Discovered – currently not indexed”",
      "Your site has been migrated or rebuilt at any point",
      "You publish content that never seems to rank anywhere",
    ],
    faqs: [
      {
        question: "Will technical SEO alone get me ranking?",
        answer:
          "It removes the brakes rather than adding the engine. A technically sound site lets your content, pages and local signals perform as they should. For most sites, fixing the technical layer is step one — then content and authority work pays off far faster.",
      },
      {
        question: "Do I need to change my website platform?",
        answer:
          "Almost never. Most technical issues can be fixed on the platform you already use. If your platform genuinely can't support what you need, we'll tell you plainly — and help you plan the move without losing your existing rankings.",
      },
    ],
  },
  "content-seo": {
    slug: "content-seo",
    name: "Content & SEO Strategy",
    metaTitle: "Wedding Content Strategy & SEO | Real Weddings, Guides & Topical Authority | WedHQ",
    metaDescription:
      "Content strategy for Irish wedding businesses: real weddings, venue guides, FAQs and advice content planned around what couples actually search for.",
    h1: "Content strategy that turns your wedding work into search traffic",
    intro:
      "Every real wedding you photograph, style, plan or cater is a page couples will find on Google — if it's published properly. Content strategy is the difference between a blog that sits unseen and a library of pages that captures searches for years.",
    introBullets: [
      "A plan for real weddings, guides and FAQs that earn rankings",
      "Content mapped to how couples search at each stage of planning",
      "Internal linking that pushes authority to your service pages",
    ],
    sections: [
      {
        heading: "Real weddings that rank",
        body: "A real wedding post with the right structure — venue, county, supplier credits, story and galleries — can rank for searches like “venue name wedding” and “county real wedding”, and it promotes every supplier involved. We show you the format that works and what to skip.",
      },
      {
        heading: "Guides and FAQs couples actually search for",
        body: "“How much does a wedding photographer cost in Ireland”, “best months for a wedding in Kerry”, “questions to ask a wedding florist”. These searches happen months before couples are ready to enquire, and answering them is how you get on their shortlist early.",
      },
      {
        heading: "Topical authority",
        body: "When your site covers wedding topics in depth — linked clusters of guides, real weddings and service pages — Google treats it as a credible source for the whole subject. That lifts your money pages, not just your blog.",
      },
      {
        heading: "A calendar you can actually keep",
        body: "Ambitious content plans fail when they don't fit real life. We build a realistic publishing rhythm around your wedding season, and format each piece so it takes an afternoon, not a week.",
      },
    ],
    forYouIf: [
      "You have dozens of real weddings sitting unused in your archive",
      "Your blog exists but brings no traffic",
      "You post on Instagram but have nothing on your website working for you",
      "You want to be found early in couples' planning research",
    ],
    faqs: [
      {
        question: "How many blog posts do I need before SEO works?",
        answer:
          "There is no magic number — quality and structure matter more than volume. A dozen well-optimised real weddings and guides, properly interlinked with your service pages, will usually outperform fifty unstructured posts. We plan for impact, not output.",
      },
      {
        question: "Can you write the content for me?",
        answer:
          "We plan the strategy, outlines and keyword targeting, and either write drafts for you to approve or guide whoever creates your content. Your voice and your real weddings stay at the centre — that authenticity is exactly what ranks and converts.",
      },
    ],
  },
  "seo-audits": {
    slug: "seo-audits",
    name: "SEO Audits",
    metaTitle: "Wedding Website SEO Audit Ireland | See What's Holding You Back | WedHQ",
    metaDescription:
      "A clear, prioritised SEO audit for Irish wedding businesses: rankings, technical issues, local visibility, content gaps and conversion problems. Free audit available.",
    h1: "Find out exactly what's stopping your website from ranking",
    intro:
      "An SEO audit answers the question every wedding business owner asks: “why isn't my website bringing in enquiries?” We review your site end to end and hand you a prioritised, plain-English list of what to fix and in what order.",
    introBullets: [
      "Rankings, technical health, local SEO, content and conversions reviewed",
      "Prioritised actions — no 80-page PDF of noise",
      "Start with the free audit, go deeper when you're ready",
    ],
    sections: [
      {
        heading: "What we review",
        body: "Every audit covers the areas that decide whether a wedding business gets found and booked:",
        points: [
          "Where you rank today for the searches that matter in your counties",
          "Technical health: indexing, speed, mobile, crawlability",
          "Google Business Profile and local visibility",
          "Service and location page structure and quality",
          "Content and internal linking opportunities",
          "What converts — and what's leaking enquiries",
          "Competitors: what they rank for that you don't",
        ],
      },
      {
        heading: "Plain English, prioritised",
        body: "You don't get a technical dump. You get the five things to fix first, why they matter, and what changed for sites that fixed them. If you can implement actions yourself, the audit is written so you can. If you'd rather we did it, that's a conversation — never a hard sell.",
      },
      {
        heading: "Free audit, then deeper options",
        body: "The free SEO audit gives you the headline findings. If you want the full depth — competitor keyword gaps, a content roadmap, county-by-county local analysis — we'll scope a paid audit to your business. Many clients start free and take it from there.",
      },
    ],
    forYouIf: [
      "You suspect your website is underperforming but can't see why",
      "You've had SEO work done before and want a second opinion",
      "You're about to invest in a new website and want to get it right",
      "You want a clear, honest picture before committing to monthly SEO",
    ],
    faqs: [
      {
        question: "What happens after I request the free audit?",
        answer:
          "We review your website, its Google visibility and its local signals, then email you a summary of the key findings and the first fixes we'd make. Usually within a few working days. No obligation, no pressure.",
      },
      {
        question: "Will the audit tell me why my competitor ranks above me?",
        answer:
          "Yes — competitor comparison is part of every audit. We look at what the businesses ranking above you have that you don't: pages, content, local signals, technical quality — and what it would realistically take to close the gap.",
      },
    ],
  },
  "website-optimisation": {
    slug: "website-optimisation",
    name: "Website Optimisation",
    metaTitle: "Wedding Website Optimisation | Better Pages, More Enquiries | WedHQ",
    metaDescription:
      "Improve the wedding website you already have: sharper service pages, clearer structure, stronger calls to action and copy that converts visitors into enquiries.",
    h1: "Get more enquiries from the website you already have",
    intro:
      "You don't need a new website — you need your current one to work harder. Website optimisation improves the pages, copy, structure and calls to action on your existing site so the visitors you already get turn into enquiries.",
    introBullets: [
      "Sharper service pages built around how couples buy",
      "Clear structure, navigation and internal linking",
      "Calls to action that feel natural, not pushy",
    ],
    sections: [
      {
        heading: "Service pages that sell your work",
        body: "Most wedding supplier websites describe services instead of answering couples' real questions. We rebuild your key pages around what couples need to see before they enquire: your style, your coverage, your process, social proof and a natural next step.",
      },
      {
        heading: "Structure and navigation",
        body: "If couples can't find your pricing hints, real weddings or contact page within a couple of taps, they leave. We simplify navigation, fix buried pages and make the journey from landing to enquiry obvious.",
      },
      {
        heading: "Conversion copy and calls to action",
        body: "“Get in touch” is easy to ignore. Specific, low-pressure calls to action — “Check your date”, “Request the full gallery”, “Ask about your county” — consistently turn more of the visitors you already have into conversations.",
      },
      {
        heading: "Page speed as a conversion feature",
        body: "Slow pages cost enquiries before couples see a single photo. Optimising images, fonts and scripts is one of the highest-return changes most wedding websites can make.",
      },
    ],
    forYouIf: [
      "You get decent traffic but few enquiries",
      "Your website looks good but feels like a brochure, not a booking tool",
      "You've been quoted for a full rebuild you're not sure you need",
      "Couples who enquire say they almost left your site",
    ],
    faqs: [
      {
        question: "Will optimisation help my Google rankings too?",
        answer:
          "Yes. Better page structure, clearer headings, faster load times and stronger internal linking are ranking factors as well as conversion factors. Optimisation usually improves both at once — which is why we treat them as one job.",
      },
      {
        question: "Do you rebuild websites?",
        answer:
          "Our focus is improving the website you already have — it's faster, cheaper and preserves the search equity you've built. If your platform truly can't deliver what your business needs, we'll say so and help you plan a rebuild the right way.",
      },
    ],
  },
};
