import type { Faq } from "./site";

export type IndustryPageData = {
  slug: string;
  /** Display name, e.g. "Wedding Photographers" */
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  problems: string[];
  keywordsTitle: string;
  keywordsIntro: string;
  keywords: string[];
  structureTitle: string;
  structureIntro: string;
  structure: string[];
  local: string[];
  contentIdeas: string[];
  mistakes: string[];
  faqs: Faq[];
};

export const INDUSTRY_DATA: Record<string, IndustryPageData> = {
  "wedding-photographer-seo": {
    slug: "wedding-photographer-seo",
    name: "Wedding Photographers",
    metaTitle: "SEO for Wedding Photographers in Ireland | Get Booked on Google | WedHQ",
    metaDescription:
      "SEO for Irish wedding photographers: rank in your counties, turn your portfolio into search traffic and get enquiries from couples actively looking to book.",
    h1: "SEO for wedding photographers in Ireland",
    intro:
      "Couples find their photographer in two ways: someone's Instagram, or Google. The ones who come from Google are actively searching in your counties, comparing styles and asking about dates. SEO makes sure that search leads to you — not just whoever posts most that week.",
    problems: [
      "Your portfolio is stunning, but your website barely mentions your counties or venues, so Google has no idea where to show you",
      "Your galleries are image-only pages with almost no indexable text — invisible for every search except your brand name",
      "You're competing for “wedding photographer Ireland” against everyone on the island, instead of ranking where you actually shoot",
      "Couples love your work on Instagram but never find your website when planning on Google",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro:
      "Photography searches split into county searches, style searches and venue-specific searches. The money is in the mix:",
    keywords: [
      "wedding photographer [county]",
      "documentary / candid / relaxed wedding photographer ireland",
      "wedding photographer [venue name]",
      "wedding photographer prices ireland",
      "engagement photographer [county]",
      "destination wedding photographer ireland",
    ],
    structureTitle: "A website structure that works as hard as your portfolio",
    structureIntro:
      "Photographer sites are usually built for browsing, not ranking. This is the structure that does both:",
    structure: [
      "A homepage targeting your core style plus your primary county",
      "County pages for each area you regularly shoot (Dublin, Galway, Kerry…)",
      "Venue pages for the venues you know inside out",
      "A real weddings section where every post is tagged by county and venue",
      "A pricing or investment page — it captures high-intent “price” searches",
      "An about page with a clear, personal voice and a next step",
    ],
    local: [
      "One page per county you shoot in — with real weddings from that county linked inside",
      "Venue pages that rank for “[venue] wedding photographer” searches couples make after falling in love with a venue",
      "A Google Business Profile with your best work — map results matter for “wedding photographer near me”",
    ],
    contentIdeas: [
      "Real weddings, published consistently, each naming the venue and county",
      "“Wedding photographer [county] pricing guide” — answers the most-asked question",
      "Venue-specific posts: the best photo spots at the venues you shoot most",
      "Seasonal content: winter weddings, golden hour timing by season in Ireland",
    ],
    mistakes: [
      "Publishing galleries with no captions, locations or text for Google to read",
      "One homepage trying to rank for all of Ireland — and ranking nowhere",
      "Hiding prices completely and losing every “wedding photographer cost” search",
      "Letting the blog die after a busy season, exactly when enquiries matter",
    ],
    faqs: [
      {
        question: "I post on Instagram constantly. Why do I need SEO?",
        answer:
          "Instagram rewards the last 7 days of your work. Google rewards the last 5 years. Couples who search are past the scrolling stage — they're shortlisting and checking dates. Both channels together beat either one alone.",
      },
      {
        question: "Will county pages work if I shoot everywhere?",
        answer:
          "Yes, as long as each page has real substance: weddings you've shot there, venues you know, travel details couples ask about. We build pages that earn their rankings — never thin, swapped-place-name templates.",
      },
    ],
  },

  "wedding-venue-seo": {
    slug: "wedding-venue-seo",
    name: "Wedding Venues",
    metaTitle: "SEO for Wedding Venues in Ireland | More Tours & Bookings | WedHQ",
    metaDescription:
      "SEO for Irish wedding venues: rank for county and style searches, show up on Google Maps, and turn venue browsers into show-around bookings.",
    h1: "SEO for wedding venues in Ireland",
    intro:
      "Venue is the first big decision couples make, and the searches start earlier than almost anything else: “wedding venues in Wicklow”, “small wedding venues Ireland”, “country house wedding venue with accommodation”. Ranking for those searches fills your show-around diary months in advance.",
    problems: [
      "Your homepage competes for one or two keywords while hundreds of style-and-county searches go to competitors",
      "Third-party listing sites rank above you for your own venue's name",
      "Your galleries take so long to load that couples bounce before they see the ballroom",
      "“Wedding venues near me” map results favour venues with an optimised Google Business Profile — yours may be bare",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro:
      "Venue searches are about place, style and practicality. The highest-intent ones combine all three:",
    keywords: [
      "wedding venues [county]",
      "wedding venues near [city]",
      "country house / castle / barn wedding venue ireland",
      "small / intimate wedding venues ireland",
      "wedding venue with accommodation [county]",
      "wedding venues for 100 guests",
      "[venue name] wedding prices",
    ],
    structureTitle: "A website structure that captures how couples choose",
    structureIntro:
      "Couples search by county first, style second, practicalities third. Your site should mirror that:",
    structure: [
      "A homepage for your venue's name, style and county",
      "Style or experience pages: country house, castle, marquee, exclusive use",
      "County and nearby-city pages for the surrounding catchment",
      "Real weddings section, tagged by season and style",
      "Practical pages: capacities, accommodation, directions, FAQs",
      "An enquiry page that invites a show-around, not just “contact us”",
    ],
    local: [
      "A fully optimised Google Business Profile — venues live or die in the map pack",
      "Coverage for the towns and cities within a two-hour drive, not just your county",
      "Reviews on Google that mention wedding-specific experiences",
    ],
    contentIdeas: [
      "Real weddings at your venue, published with season and style in the title",
      "Local area guides: where to stay, things to do, photos spots for guests",
      "Open day and showcase event pages that capture “venue open days” searches",
      "Planning content couples actually want: timelines, capacity guides, weather plans",
    ],
    mistakes: [
      "Relying on directory listings while your own site ranks below them",
      "No style pages, so couples searching “castle wedding venue” never find you",
      "Slow, uncompressed galleries that kill mobile browsing",
      "Ignoring the map pack — where half of all venue searches begin",
    ],
    faqs: [
      {
        question: "We already get bookings from word of mouth. Why invest in SEO?",
        answer:
          "Word of mouth starts a couple's shortlist — then they Google you. SEO protects those branded searches from directories and competitors, and captures the couples who never heard of you but are searching your county right now.",
      },
      {
        question: "Can you compete with the big venue directories?",
        answer:
          "For county and style searches, yes — with depth directories can't fake: real weddings, specific capacities, honest local detail. Directories list everyone; your site can actually sell your venue.",
      },
    ],
  },

  "wedding-planner-seo": {
    slug: "wedding-planner-seo",
    name: "Wedding Planners",
    metaTitle: "SEO for Wedding Planners in Ireland | Visibility for Your Services | WedHQ",
    metaDescription:
      "SEO for wedding planners in Ireland: rank for planning, coordination and destination searches in your counties and turn website visits into consultations.",
    h1: "SEO for wedding planners in Ireland",
    intro:
      "Hiring a planner is a trust decision made months before the wedding. Couples research heavily — full planning versus on-the-day coordination, costs, and who works in their county. SEO puts you in front of them during that research, not after they've shortlisted your competitors.",
    problems: [
      "You offer three very different services (full planning, partial, on-the-day) but your website describes them on one page",
      "“Wedding planner Ireland” is dominated by directories and UK agencies — and you're trying to compete there instead of in your counties",
      "Couples searching “how much does a wedding planner cost in Ireland” find everyone but you",
      "Your beautiful Instagram portfolio doesn't translate into Google visibility",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro:
      "Planner searches are service-type and location driven, with cost searches as a high-intent layer:",
    keywords: [
      "wedding planner [county]",
      "wedding planner cost ireland",
      "on the day wedding coordinator [county]",
      "destination wedding planner ireland",
      "luxury wedding planner ireland",
      "wedding planning packages explained",
    ],
    structureTitle: "A website structure that matches how couples buy planning",
    structureIntro:
      "Each service deserves its own page, and trust content needs a home of its own:",
    structure: [
      "A homepage positioning you by service and primary counties",
      "One page per service: full planning, partial planning, on-the-day coordination",
      "County or region pages for where you work",
      "A portfolio of real weddings, organised by style and venue",
      "An investment page addressing cost questions openly",
      "An about page that carries your personality — planners are hired as people",
    ],
    local: [
      "County pages naming the venues you regularly work at",
      "Google Business Profile with reviews that speak to your planning process",
      "Local press and vendor collaboration links that build county-level authority",
    ],
    contentIdeas: [
      "“How much does a wedding planner cost in Ireland?” — the question every couple asks",
      "Real wedding features with the planning story, not just the gallery",
      "Venue guides for the counties you plan in",
      "Month-of-wedding checklists that attract early-stage researchers",
    ],
    mistakes: [
      "One services page trying to sell full planning and on-the-day coordination",
      "No cost content, losing the most-searched planning question in Ireland",
      "A portfolio with no location or venue names for Google to connect",
      "Writing for other planners on Instagram instead of for couples on Google",
    ],
    faqs: [
      {
        question: "My business is very personal. Will SEO make my website feel generic?",
        answer:
          "The opposite. SEO structure and your voice are separate layers — we optimise how pages are organised and found, while your tone, story and portfolio stay unmistakably yours. Couples should feel more of you, not less.",
      },
      {
        question: "I mostly get clients through venues. Does SEO still matter?",
        answer:
          "Venue referrals are great — and couples will still Google you before booking. SEO wins that check, captures couples venues haven't reached yet, and reduces how dependent you are on any single referral source.",
      },
    ],
  },

  "wedding-videographer-seo": {
    slug: "wedding-videographer-seo",
    name: "Wedding Videographers",
    metaTitle: "SEO for Wedding Videographers in Ireland | Get Found & Booked | WedHQ",
    metaDescription:
      "SEO for Irish wedding videographers: rank in your counties, make your films load fast and rank, and capture couples searching for their wedding video.",
    h1: "SEO for wedding videographers in Ireland",
    intro:
      "Videography searches are different from photography: couples search “wedding videographer cost”, wonder whether they need one at all, and judge you on films that are heavy, slow and often invisible to Google. Specialist SEO fixes all three.",
    problems: [
      "Your showreel autoplays as a giant video and your pages take forever to load",
      "Video embeds give Google nothing to read, so your film pages rank for nothing",
      "You're invisible for “videographer vs photographer” and “is a wedding videographer worth it” searches — where couples decide",
      "Your county coverage exists in your head but not on your website",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Videography searches mix county, style and decision-stage questions:",
    keywords: [
      "wedding videographer [county]",
      "wedding videographer cost ireland",
      "wedding film vs wedding video",
      "super 8 wedding film ireland",
      "wedding videographer and photographer packages",
      "drone wedding video [county]",
    ],
    structureTitle: "A website structure built around films and speed",
    structureIntro: "Your films should star, but the text around them does the ranking:",
    structure: [
      "A homepage with a fast, lazy-loaded showreel and county-focused copy",
      "County pages for your core filming areas",
      "A films/portfolio section where each film has a story page — venue, couple, details",
      "A pricing page capturing cost searches",
      "A “photography + video” page for couples searching combined packages",
      "FAQs answering the is-it-worth-it questions honestly",
    ],
    local: [
      "County pages naming venues you film at regularly",
      "A Google Business Profile with short, well-chosen clips and genuine reviews",
      "A YouTube channel treated as a search channel — titled and described for how couples search",
    ],
    contentIdeas: [
      "Film stories: each wedding written up with venue, county and the couple's brief",
      "“What's included in a wedding video” explainers",
      "Venue film spotlights — filming conditions and best moments at venues you know",
      "Decision-stage guides: videographer vs photographer, and how to budget for both",
    ],
    mistakes: [
      "Full-screen autoplay video that wrecks mobile load times",
      "Portfolio pages that are just embeds with no written context",
      "No pricing signals at all, losing every cost search to competitors",
      "Treating YouTube as a dumping ground instead of a search channel",
    ],
    faqs: [
      {
        question: "How do we rank pages when our product is video?",
        answer:
          "Google ranks text and context; couples buy the film. Each film gets a story page — the venue, the county, the couple's plans, stills — with the film embedded. That page ranks; the film sells.",
      },
      {
        question: "Will SEO slow my website down with all this content?",
        answer:
          "Done properly, the opposite: part of our work is making video load smarter — lazy loading, poster frames, right-sized embeds — so your site gets faster even as it gets more findable.",
      },
    ],
  },

  "wedding-florist-seo": {
    slug: "wedding-florist-seo",
    name: "Florists",
    metaTitle: "SEO for Wedding Florists in Ireland | Get Found by Couples | WedHQ",
    metaDescription:
      "SEO for wedding florists in Ireland: rank in your counties, show up for seasonal and style searches, and turn your portfolio into a steady stream of enquiries.",
    h1: "SEO for wedding florists in Ireland",
    intro:
      "Couples find their florist on Instagram — then lose you the moment they switch to Google to compare, price and shortlist. Florist SEO moves your website from an online business card to a channel that wins enquiries while you're up to your elbows in stems.",
    problems: [
      "Your Instagram is full of stunning work; your website is three sentences and a contact form",
      "Seasonal searches — peonies in June, dried flowers, winter palettes — go to competitors with actual content",
      "You've never told Google which counties and venues you work in, so “wedding florist [county]” never shows you",
      "“How much do wedding flowers cost in Ireland” searches land on UK sites, not Irish florists like you",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Floral searches are seasonal, stylistic and strongly local:",
    keywords: [
      "wedding florist [county]",
      "wedding flowers cost ireland",
      "bridal bouquet / buttonholes / table flowers",
      "seasonal wedding flowers ireland (peonies, dahlias, dried)",
      "wildflower / arch / meadow wedding flowers",
      "wedding florist [venue name]",
    ],
    structureTitle: "A website structure that works in every season",
    structureIntro: "Your structure should carry both browsing couples and searching Google:",
    structure: [
      "A homepage targeting florist + primary county",
      "Service pages: bridal party, ceremony, reception, arches and installations",
      "County pages for your delivery and install area",
      "A portfolio organised by season and colour palette",
      "A pricing approach page — ranges beat silence for high-intent searchers",
      "Avenues page listing venues you work at regularly",
    ],
    local: [
      "County coverage pages for where you deliver and install",
      "Venue-specific pages — florists who rank for “[venue] wedding flowers” win couples at the planning stage",
      "A Google Business Profile with fresh seasonal photos and review activity",
    ],
    contentIdeas: [
      "What's in season: month-by-month Irish flower guides",
      "Real weddings written up with venue, palette and season",
      "Cost guides: what bridal party flowers typically cost in Ireland",
      "Style explainers: meadow vs classic vs modern arch designs",
    ],
    mistakes: [
      "A website with no text — beautiful images, nothing for Google to rank",
      "No county or venue mentions anywhere, making local ranking impossible",
      "Letting a UK-biased “wedding flowers cost” SERP own your market's biggest question",
      "Posting a new portfolio on Instagram weekly while the website hasn't changed in two years",
    ],
    faqs: [
      {
        question: "My bookings come from venues and planners. Is SEO worth it?",
        answer:
          "Those referrals still Google you before committing — SEO makes that check end in an enquiry. And it opens a second stream: couples researching flowers independently in your counties, who currently never find you.",
      },
      {
        question: "Can I rank without publishing constantly?",
        answer:
          "Yes. A small, well-structured set of pages — services, counties, seasonal guides, real weddings — outperforms a neglected blog. We plan a realistic rhythm around your wedding season, not against it.",
      },
    ],
  },

  "wedding-band-seo": {
    slug: "wedding-band-seo",
    name: "Bands",
    metaTitle: "SEO for Wedding Bands in Ireland | Get Booked Direct | WedHQ",
    metaDescription:
      "SEO for wedding bands in Ireland: compete with agencies, rank in your counties and turn couples searching for live music into direct bookings.",
    h1: "SEO for wedding bands in Ireland",
    intro:
      "“Wedding bands Ireland” is one of the most competitive searches in the industry — and it's dominated by agencies taking commission on every booking. SEO gives bands a direct channel: county searches, video-first pages and reviews that let couples book you directly.",
    problems: [
      "Agency sites outrank your own website for nearly every wedding band search",
      "Your band exists across videos and socials, but your website is a single page with no counties, no reviews, no depth",
      "Couples searching “wedding band [county]” or “bands like [name]” never find you directly",
      "Without visibility, every booking costs you agency commission",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro:
      "Band searches are location, genre and occasion driven — and mostly bypassable to agencies:",
    keywords: [
      "wedding band [county / city]",
      "live wedding music ireland",
      "wedding band with brass / acoustic / rock / pop",
      "wedding bands for small weddings",
      "bands like [well-known band]",
      "wedding band + DJ package ireland",
    ],
    structureTitle: "A website structure that books you direct",
    structureIntro: "Give couples everything the agency page gives them — and more:",
    structure: [
      "A homepage targeting your genre plus primary region",
      "County/city pages for your gigging area",
      "A videos page with gig and wedding footage, properly contextualised in text",
      "Setlist and song list page — couples search for specific songs",
      "Reviews and testimonials page",
      "A pricing/availability page with a fast, low-friction enquiry",
    ],
    local: [
      "County pages that name venues you've played — couples search “[venue] wedding band”",
      "Google Business Profile with photos, clips and reviews from real weddings",
      "Venue and supplier cross-links that build local authority",
    ],
    contentIdeas: [
      "First dance and party-set videos written up with venue and county",
      "“Choosing a wedding band” guides — honest, couple-first content that ranks",
      "Song choice guides: first dances, party openers, anthem endings",
      "Seasonal demand explainers: why summer Saturdays book 18 months out",
    ],
    mistakes: [
      "One generic page trying to rank nationally against agency giants",
      "Videos with no titles, captions or context for Google to understand",
      "No reviews on your own site — couples trust agencies more by default",
      "Ignoring “band + DJ” searches when you already offer the full evening",
    ],
    faqs: [
      {
        question: "Can a single band really outrank the agencies?",
        answer:
          "For national head terms, agencies will usually win. But for county searches, venue-specific searches and genre niches, a well-built band site with videos and reviews ranks — and those searchers are closer to booking.",
      },
      {
        question: "Will this conflict with the agencies we work with?",
        answer:
          "No. Your site targets couples searching directly, agencies target their own audience, and your direct pricing can respect agency terms. Most bands use SEO to grow the direct share of bookings, not to burn agency relationships.",
      },
    ],
  },

  "wedding-dj-seo": {
    slug: "wedding-dj-seo",
    name: "DJs",
    metaTitle: "SEO for Wedding DJs in Ireland | Direct Bookings from Google | WedHQ",
    metaDescription:
      "SEO for wedding DJs in Ireland: rank for county and venue searches, show up for add-on searches like photo booths, and win bookings without agency fees.",
    h1: "SEO for wedding DJs in Ireland",
    intro:
      "Couples searching for a wedding DJ are practical: county, date, price, reviews. But most DJ websites answer none of that — and agencies hoover up the searches you should own. DJ SEO builds pages that answer couples' real questions and rank in your counties.",
    problems: [
      "Your website is a logo and a Mixcloud link — nothing Google can rank for “wedding DJ [county]”",
      "Agencies and directories take the top of Google, and take commission on top",
      "You offer photo booths, uplighting or ceremony music, but nobody finds you for those searches",
      "Couples can't find reviews, setlists or pricing — so they enquire with whoever answered first",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "DJ searches are practical and package-driven:",
    keywords: [
      "wedding DJ [county / city]",
      "wedding DJ prices ireland",
      "wedding DJ with photo booth",
      "DJ + sax / violin / percussion",
      "wedding party DJ vs club DJ",
      "wedding DJ [venue name]",
    ],
    structureTitle: "A website structure that converts date-checkers",
    structureIntro: "Practical searchers need practical pages:",
    structure: [
      "A homepage targeting wedding DJ + primary counties",
      "County pages for your gigging radius",
      "A packages page covering evening DJ, ceremony/evening combos and add-ons",
      "A setlist/music planning page",
      "Reviews page with real couple feedback",
      "An availability/pricing page with a 30-second enquiry form",
    ],
    local: [
      "County and venue coverage — “[venue] wedding DJ” is a booking waiting to happen",
      "Google Business Profile with reviews; map results matter for last-minute searches",
      "Links from venues and suppliers you work with regularly",
    ],
    contentIdeas: [
      "“How much does a wedding DJ cost in Ireland?” — direct answer, honest ranges",
      "Wedding party timelines: when to play what",
      "Add-on explainers: photo booths, uplighting, late-night extensions",
      "Real wedding write-ups with venue and county",
    ],
    mistakes: [
      "A one-page site with no counties, prices or reviews",
      "Trying to rank nationally instead of owning your gigging area",
      "Burying the fact you also do ceremony music or booths",
      "No mobile-friendly enquiry — couples plan weddings on phones, at lunch, in a hurry",
    ],
    faqs: [
      {
        question: "Do couples really Google DJs, or just use agencies?",
        answer:
          "Both — but the ones who Google are reading reviews and checking dates themselves, and they book direct. Ranking for your counties captures them before they ever see an agency markup.",
      },
      {
        question: "I also play clubs and festivals. Should the site cover everything?",
        answer:
          "Keep weddings front and centre. Wedding searches have their own language, season and questions — a dedicated wedding-focused site (or section) will always outperform a general “book me for anything” page.",
      },
    ],
  },

  "wedding-celebrant-seo": {
    slug: "wedding-celebrant-seo",
    name: "Celebrants",
    metaTitle: "SEO for Wedding Celebrants in Ireland | Be Found by Couples | WedHQ",
    metaDescription:
      "SEO for wedding celebrants in Ireland: rank for celebrant and ceremony searches in your counties and turn curious couples into consultations.",
    h1: "SEO for wedding celebrants in Ireland",
    intro:
      "Celebrancy is still a discovery category in Ireland: many couples don't know they can have a fully personal ceremony until they search “what does a celebrant do” or “humanist vs celebrant ireland”. Ranking for those discovery searches — and for celebrant + county — is how your calendar fills.",
    problems: [
      "Couples who've never hired a celebrant don't know what to search — and your site answers questions nobody has typed yet",
      "Registry offices and UK celebrant sites capture Irish celebrant searches",
      "Your personal warmth shines in consultations but your website reads like a brochure",
      "You serve a wide area, but the site never names a single county",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Celebrant searches are part discovery, part comparison, part local:",
    keywords: [
      "wedding celebrant [county]",
      "what does a wedding celebrant do ireland",
      "humanist vs celebrant vs registry office",
      "personalised wedding ceremony ireland",
      "celebrant cost ireland",
      "handfasting / vow renewal ceremony ireland",
    ],
    structureTitle: "A website structure that explains and sells",
    structureIntro: "Discovery-stage couples need education; ready couples need reassurance:",
    structure: [
      "A homepage that explains what you do in the first screen",
      "A “how it works” page: consultation, script, rehearsal, ceremony",
      "County pages for your ceremony area",
      "A ceremonies page covering weddings, vow renewals, handfastings",
      "Real ceremonies page — stories and excerpts (with couples' permission)",
      "An FAQ page answering legality, cost and logistics honestly",
    ],
    local: [
      "County pages naming venues and outdoor spots you've married couples",
      "Google Business Profile — celebrant searches often include “near me”",
      "Content that answers the Ireland-specific legal questions couples always ask",
    ],
    contentIdeas: [
      "“What a celebrant can and can't do legally in Ireland” — the trust-building post every couple needs",
      "Ceremony idea guides: readings, rituals, vows",
      "Real ceremony stories with the couple's brief and venue",
      "Venue guides: the best outdoor ceremony spots in your counties",
    ],
    mistakes: [
      "Writing only about yourself and never answering the questions couples are actually Googling",
      "No county signals, so local searches surface distant competitors",
      "Avoiding cost entirely, pushing ready-to-book couples to celebrants who answer it",
      "No distinction from humanist or spiritual options — couples can't self-select you",
    ],
    faqs: [
      {
        question: "Most couples haven't heard of celebrants. Can SEO create demand?",
        answer:
          "SEO captures the demand that already exists — the “what does a celebrant do” and “personalised ceremony Ireland” searches happening daily. Being the answer at that discovery moment is exactly how new couples enter your world.",
      },
      {
        question: "My whole business is my personality. Will optimised pages feel templated?",
        answer:
          "Structure and soul aren't in conflict. We organise pages so couples find you; your voice — scripts, stories, ceremonies — is what keeps them there. Every page stays written by you, for couples like the ones you want.",
      },
    ],
  },

  "bridal-shop-seo": {
    slug: "bridal-shop-seo",
    name: "Bridal Boutiques",
    metaTitle: "SEO for Bridal Shops in Ireland | More Appointment Bookings | WedHQ",
    metaDescription:
      "SEO for bridal boutiques in Ireland: rank for “wedding dress shops near me”, designer stockist searches and county searches that fill your appointment diary.",
    h1: "SEO for bridal boutiques in Ireland",
    intro:
      "Dress shopping starts with a search: “wedding dress shops dublin”, “bridal shops cork”, “[designer] stockist ireland”. Boutiques that rank for those searches fill Saturdays weeks ahead. Boutiques that don't rely on footfall and luck.",
    problems: [
      "You stock beautiful designers, but your website doesn't mention them in any way Google can rank",
      "“Wedding dress shops near me” map results favour boutiques with active Google Business Profiles",
      "Couples searching “[dress] shop ireland” or “plus size bridal ireland” find competitors instead",
      "Your appointment booking isn't findable — or the page doesn't mention location, price band or designers",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Bridal searches are local, designer and category driven:",
    keywords: [
      "wedding dress shops [city / county]",
      "bridal shop near me",
      "[designer name] stockist ireland",
      "plus size / petite bridal ireland",
      "affordable wedding dresses [county]",
      "wedding dress alterations [county]",
    ],
    structureTitle: "A website structure that books appointments",
    structureIntro: "Every page should funnel toward the appointment book:",
    structure: [
      "A homepage targeting bridal shop + your city or county",
      "A designers/stockists page listing every label you carry, by name",
      "Collection pages by style: classic, modern, boho, plus size, petite",
      "An appointments page with real booking detail",
      "An alterations/services page if offered",
      "A real brides gallery with permissions — social proof that ranks",
    ],
    local: [
      "Google Business Profile with photos of the boutique, gowns and reviews — this drives “near me” results",
      "City and county pages covering your catchment area",
      "Mentions and links from local venues, planners and photographers",
    ],
    contentIdeas: [
      "Designer spotlight pages for each label you stock",
      "“What to expect at your first appointment” — the post that converts nervous brides",
      "Budget guides: what gowns cost at different price points",
      "Seasonal and trend content: sleeves, fabrics, silhouettes this year",
    ],
    mistakes: [
      "Never naming your stocked designers — the single biggest missed keyword for boutiques",
      "A thin Google Business Profile while competitors collect reviews weekly",
      "No “near me” optimisation for a search that is almost always local",
      "Hiding price bands entirely, losing practical searchers to boutiques that give a range",
    ],
    faqs: [
      {
        question: "Couples can't buy gowns online from us. Why does website traffic matter?",
        answer:
          "Because appointments are booked online. Ranking for designer stockist and “near me” searches puts your diary in front of brides at the exact moment they decide to start trying dresses on.",
      },
      {
        question: "We're in a rural town. Can we compete with city boutiques?",
        answer:
          "Yes — with different searches. “Wedding dress shops near [city]”, designer stockists and relaxed, personal appointment experiences are all winnable angles. Rural boutiques often win on experience; SEO makes that visible.",
      },
    ],
  },

  "wedding-hair-makeup-seo": {
    slug: "wedding-hair-makeup-seo",
    name: "Hair & Makeup Artists",
    metaTitle: "SEO for Wedding Hair & Makeup Artists Ireland | More Bookings | WedHQ",
    metaDescription:
      "SEO for bridal hair and makeup artists in Ireland: rank for county and mobile searches, show up for trials and pricing searches and fill your wedding season.",
    h1: "SEO for wedding hair & makeup artists in Ireland",
    intro:
      "Hair and makeup searches are intensely local and mobile: “bridal makeup artist [county]”, “wedding hair stylist that travels”, “HMUA near me”. Couples book early for peak season — the artist who ranks when they search wins the date.",
    problems: [
      "You travel to venues across several counties, but your site mentions none of them",
      "Instagram shows your work; Google — where couples compare trials and prices — doesn't know you exist",
      "“Bridal makeup artist prices ireland” and “do I need a makeup trial” searches never surface you",
      "You're one artist with a diary — every enquiry lost to a competitor's website is a full-day booking gone",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "HMUA searches are county, mobile-service and pricing heavy:",
    keywords: [
      "bridal makeup artist [county]",
      "wedding hair and makeup [county]",
      "mobile bridal makeup that travels",
      "bridal makeup trial [county]",
      "wedding hair and makeup prices ireland",
      "makeup artist for [venue name]",
    ],
    structureTitle: "A website structure that fills the diary",
    structureIntro: "One clear offer, many locations, obvious next step:",
    structure: [
      "A homepage targeting hair & makeup + primary counties",
      "County/area pages for everywhere you travel regularly",
      "A pricing & packages page (bridal party sizes, trials, travel)",
      "A portfolio organised by look: natural, glam, classic",
      "A venues page naming where you work often",
      "An enquiry page asking exactly what your quote needs: date, location, party size",
    ],
    local: [
      "Area pages with real travel detail couples ask about",
      "Google Business Profile with reviews and fresh looks — “near me” is half your market",
      "Venue and planner cross-links for the counties you cover",
    ],
    contentIdeas: [
      "Trial guides: what happens, how to prepare, when to book",
      "Timeline posts: getting-ready schedules for different party sizes",
      "Real weddings written up with venue and county",
      "Pricing explainers for your area — the searches competitors avoid",
    ],
    mistakes: [
      "An Instagram-only presence with no bookable website",
      "One generic service page for hair, makeup, trials and travel",
      "No counties mentioned anywhere on the site",
      "Enquiry forms that don't ask for date, party size or location — so every reply takes twice as long",
    ],
    faqs: [
      {
        question: "I'm booked out in peak season already. Why do I need SEO?",
        answer:
          "SEO fills the edges of your calendar — off-peak dates, weekday weddings, early-season bookings — and raises your profile so you can be selective. It also protects you when Instagram reach inevitably dips.",
      },
      {
        question: "I work solo. Is this too much website for me?",
        answer:
          "Not at all — solo artists benefit most from efficient SEO. A tight site: homepage, area pages, pricing, portfolio and a smart enquiry form. Five pages that quietly filter serious enquiries for you.",
      },
    ],
  },

  "wedding-cake-seo": {
    slug: "wedding-cake-seo",
    name: "Wedding Cake Businesses",
    metaTitle: "SEO for Wedding Cake Businesses in Ireland | Get More Enquiries | WedHQ",
    metaDescription:
      "SEO for wedding cake designers in Ireland: rank for county, style and pricing searches, and turn cake browsing into consultations and bookings.",
    h1: "SEO for wedding cake businesses in Ireland",
    intro:
      "Cake searches are wonderfully specific: “semi naked wedding cake galway”, “wedding cake prices ireland”, “gluten free wedding cake dublin”. Every one of those is a couple a step from enquiring — and most cake makers' websites are invisible to all of them.",
    problems: [
      "Your gallery shows your work but never names styles, counties or dietary options in text",
      "“How much do wedding cakes cost in Ireland” is answered by UK bakers, not you",
      "Couples searching for exactly what you make — sugar flowers, buttercream, vegan — can't find you",
      "You deliver across several counties but your website acts like a single-town business",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Cake searches split by style, budget, dietary need and location:",
    keywords: [
      "wedding cake [county / city]",
      "wedding cake prices ireland",
      "sugar flower / buttercream / semi naked wedding cake",
      "gluten free / vegan wedding cake ireland",
      "wedding cake tasting [county]",
      "wedding cake delivery [county]",
    ],
    structureTitle: "A website structure that turns browsing into bookings",
    structureIntro: "A cake maker's site should answer style, price and logistics in two minutes:",
    structure: [
      "A homepage targeting wedding cakes + primary county",
      "A portfolio organised by style, each with a written description",
      "A pricing page with honest ranges per tier/size",
      "County/delivery pages for your areas",
      "Dietary pages: gluten free, vegan, nut free — underserved searches",
      "A booking page explaining tastings, timelines and delivery",
    ],
    local: [
      "County pages covering delivery and setup areas",
      "Venue mentions — cakes delivered to named venues build local relevance",
      "Google Business Profile with seasonal photos and reviews",
    ],
    contentIdeas: [
      "Pricing guides: what wedding cakes cost by size and detail",
      "Style guides: buttercream vs fondant, fresh vs sugar flowers",
      "Tasting and ordering timelines: when to book, when to order",
      "Real wedding features with venue, style and palette",
    ],
    mistakes: [
      "A gallery with zero text — Google can't see sugar flowers, only pixels",
      "No pricing hints, surrendering the highest-intent searches",
      "Dietary offerings buried, while couples search for them directly",
      "Waiting for enquiries instead of building pages that catch searches year-round",
    ],
    faqs: [
      {
        question: "Is there enough search volume for wedding cakes to bother?",
        answer:
          "Individually the terms are modest — together they're a steady trickle of high-intent couples, and competition is far lower than for photographers or venues. For a solo cake maker, a handful of extra bookings a year changes the business.",
      },
      {
        question: "Should I put prices on my website?",
        answer:
          "Ranges, yes. “From €X” or “most couples spend €X–€Y” captures price searches and filters unaligned enquiries before they reach your inbox. Silence loses more good couples than a number ever scares off.",
      },
    ],
  },

  "wedding-transport-seo": {
    slug: "wedding-transport-seo",
    name: "Wedding Transport",
    metaTitle: "SEO for Wedding Transport & Wedding Car Hire in Ireland | WedHQ",
    metaDescription:
      "SEO for wedding car and transport businesses in Ireland: rank for county and vehicle searches, map results and get your fleet in front of booking couples.",
    h1: "SEO for wedding transport businesses in Ireland",
    intro:
      "Wedding transport searches are among the most practical in the industry: “wedding car hire dublin”, “vintage wedding car kerry”, “guest bus hire galway”. Couples search by vehicle type and county, then book the first credible option — which needs to be you.",
    problems: [
      "Your fleet lives on one page with no counties, no pricing signals and no vehicle-specific pages",
      "“Wedding car hire near me” map results show competitors with active Google Business Profiles",
      "Couples searching for your specific vehicles — Beauford, VW campervan, Routemaster — find other companies",
      "Guest transport searches (buses, coaches) are entirely unserved on your site",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Transport searches are vehicle, county and logistics driven:",
    keywords: [
      "wedding car hire [county / city]",
      "vintage / classic wedding car ireland",
      "vw campervan wedding hire",
      "wedding bus / guest transport hire [county]",
      "wedding car with chauffeur price ireland",
      "wedding car for photos [venue area]",
    ],
    structureTitle: "A website structure built around your fleet",
    structureIntro: "Each vehicle deserves its own page — it's what couples search for:",
    structure: [
      "A homepage targeting wedding car hire + primary counties",
      "A page per vehicle or fleet category, with photos and capacity details",
      "County coverage pages for hire areas",
      "A pricing/packages page: hours, mileage, decor ribbons, champagne",
      "Guest transport page for buses and coaches",
      "An availability page with a date-first enquiry form",
    ],
    local: [
      "Google Business Profile — wedding car searches are heavily map-driven",
      "County pages naming venues and photo locations you know",
      "Reviews mentioning punctuality and the chauffeur experience",
    ],
    contentIdeas: [
      "Vehicle guides: choosing between classic, vintage and modern wedding cars",
      "Timeline explainers: how transport planning works across ceremony, photos, venue",
      "Real wedding runs written up with route and venue",
      "Guest logistics guides for venue-remote weddings",
    ],
    mistakes: [
      "One fleet page for every vehicle, matching none of the searches",
      "No map pack presence in a near-me category",
      "Ignoring guest transport — the bigger-ticket, less romantic half of the market",
      "Enquiry forms that don't ask for the date, letting weekends slip while you reply",
    ],
    faqs: [
      {
        question: "Do couples really book wedding cars from websites?",
        answer:
          "They shortlist from websites and book after a phone call. The website's job is to be the credible, detailed option when they compare three companies — and to capture the date before someone else's page does.",
      },
      {
        question: "We cover the whole of Ireland. How do we structure for that?",
        answer:
          "With hub pages: your home county plus pages for the regions you serve most, each with real runs, venues and routes you've driven. National claims on every page help no searches; specific regional pages help many.",
      },
    ],
  },

  "wedding-stationery-seo": {
    slug: "wedding-stationery-seo",
    name: "Stationery",
    metaTitle: "SEO for Wedding Stationery Businesses in Ireland | Get Found | WedHQ",
    metaDescription:
      "SEO for wedding stationery designers in Ireland: rank for invitation styles, wording searches and county queries that Etsy and big brands currently take.",
    h1: "SEO for wedding stationery businesses in Ireland",
    intro:
      "Stationery buyers search by style and by question: “wax seal invitations ireland”, “wedding invitation wording ireland”, “digital vs printed wedding invitations”. Those searches are currently owned by Etsy, Pinterest and UK brands — and an Irish designer with proper pages can take them back.",
    problems: [
      "Etsy and international marketplaces outrank your own website for style searches you could own",
      "You create bespoke work, but your site describes “invitations and stationery” in one sentence",
      "Ireland-specific searches — wording, posting, RSVP timing — are answered by UK and US sites",
      "Your portfolio is gorgeous images with no text, so Google ranks Pinterest instead of you",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro: "Stationery searches are style, format and question led:",
    keywords: [
      "wedding invitations ireland",
      "wax seal / vellum / acrylic wedding invitations",
      "wedding invitation wording ireland",
      "digital vs printed wedding invitations",
      "day invitations / evening invitations",
      "wedding stationery [county]",
    ],
    structureTitle: "A website structure that competes with marketplaces",
    structureIntro: "Compete on specificity — the thing Etsy listings can't fake:",
    structure: [
      "A homepage targeting wedding stationery/invitations + Ireland",
      "Collection pages by style and material",
      "A wording guide page for Irish weddings — a traffic magnet",
      "A process page: consultations, proofs, timelines",
      "A pricing or collections page with ranges",
      "A county/city page if you serve local clients or offer collection",
    ],
    local: [
      "Ireland-specific wording and postal guides — content UK sites can't replicate credibly",
      "County page if you offer local consultations or stockists",
      "Google Business Profile if you have studio or collection premises",
    ],
    contentIdeas: [
      "The definitive Irish wedding invitation wording guide (formal, informal, remarriages, European families)",
      "Timeline guides: when to order and send save-the-dates and invitations",
      "Style explainers: vellum, wax seals, acrylic — what each involves",
      "Real wedding features showing full stationery suites in context",
    ],
    mistakes: [
      "Letting marketplaces own style searches you could rank for with real pages",
      "No wording content — the single most-searched stationery question in Ireland",
      "Image-only portfolio pages",
      "No distinction between digital, semi-custom and bespoke — couples can't tell what they're buying",
    ],
    faqs: [
      {
        question: "Etsy dominates wedding stationery. Can a small studio compete?",
        answer:
          "On style keywords like “wax seal invitations Ireland” — yes, because location and craft specificity are exactly what marketplace listings lack. Your edge is depth: real Irish wording, real timelines, real consultation.",
      },
      {
        question: "My work is very visual. Do I really need lots of text?",
        answer:
          "Short, well-written context — a paragraph per collection, details on materials and process — is enough for Google and adds to the luxury feel. Text isn't the enemy of beauty; invisibility is.",
      },
    ],
  },

  "wedding-decor-hire-seo": {
    slug: "wedding-decor-hire-seo",
    name: "Décor & Event Hire",
    metaTitle: "SEO for Wedding Décor & Event Hire Companies in Ireland | WedHQ",
    metaDescription:
      "SEO for wedding décor and event hire businesses in Ireland: rank for flower walls, chair covers, tableware and county searches venues and couples are making.",
    h1: "SEO for wedding décor & event hire companies in Ireland",
    intro:
      "Décor hire searches are item-led: “flower wall hire dublin”, “chiavari chair hire galway”, “wedding arch hire cork”. Each item is its own search market — and companies that build item pages by county quietly collect enquiries from venues, planners and couples alike.",
    problems: [
      "You hire out dozens of items but your website has one “Our Services” page, matching no searches",
      "Venues and planners searching for specific items for their couples never find you",
      "Your service area covers several counties, but nothing on your site says where you deliver and install",
      "“Wedding décor hire [county]” searches go to competitors who wrote the item pages you haven't",
    ],
    keywordsTitle: "Searches worth ranking for",
    keywordsIntro:
      "Hire searches are item, quantity and location specific — high intent, low competition:",
    keywords: [
      "flower wall hire [county]",
      "chiavari / chair cover hire [county]",
      "wedding arch / backdrop hire ireland",
      "crockery / cutlery / glassware hire ireland",
      "wedding tableware & centrepiece hire",
      "marquee décor hire [county]",
    ],
    structureTitle: "A website structure that sells every item",
    structureIntro: "Think of each hire category as its own landing page:",
    structure: [
      "A homepage targeting wedding décor hire + primary counties",
      "A page per hire category: flower walls, arches, chairs, tableware, lighting",
      "County pages for delivery and installation areas",
      "A gallery of styled installations, each with venue and county",
      "A pricing/quote page explaining how quotes work",
      "A trade page for venues, planners and stylists",
    ],
    local: [
      "County coverage pages naming venues you regularly dress",
      "Google Business Profile with installation photos — décor searches are visual and local",
      "Links and mentions from venues and planners you work with",
    ],
    contentIdeas: [
      "Styled shoot write-ups with venue and supplier credits",
      "Item guides: choosing arches, backdrops and chair styles",
      "Marquee décor guides for marquee weddings",
      "Seasonal installation ideas and trends",
    ],
    mistakes: [
      "One services page for an entire catalogue of searchable items",
      "No delivery-area information, missing county searches entirely",
      "Treating venues and planners as invisible audiences when they search too",
      "Galleries with no venue, county or item labels in text",
    ],
    faqs: [
      {
        question: "Most of our bookings come from venues and planners. Does SEO still matter?",
        answer:
          "Venues and planners search Google too — usually for exactly the items you hire. Item pages by county make you the company they find first, and couples planning their own décor find you directly.",
      },
      {
        question: "We hire dozens of items. Do we need a page for each?",
        answer:
          "Per category, not per item: flower walls, arches, chairs, tableware, lighting. Six to ten strong category pages will capture the vast majority of hire searches without an unmanageable website.",
      },
    ],
  },
};
