/** Editorial wedding guides. Static content, rendered as SEO article pages. */
export type Guide = {
  slug: string;
  topic: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  sections: { heading: string; body: string[] }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-much-does-an-irish-wedding-cost",
    topic: "Budget",
    title: "What an Irish wedding actually costs in 2026",
    excerpt:
      "A category-by-category breakdown of where the money goes, from venue and catering down to favours, with realistic ranges rather than averages.",
    readMinutes: 8,
    sections: [
      {
        heading: "Start with the guest number, not the total",
        body: [
          "Almost every large cost on an Irish wedding scales with headcount. Catering is quoted per person, drinks reception is per person, and the venue you can consider is decided by whether you need to seat 90 or 220.",
          "Before you set a budget figure, write the guest list. Then multiply your realistic per-head food cost by that number. That single line is usually between 45 and 65 per cent of the whole day.",
        ],
      },
      {
        heading: "The five costs that move the needle",
        body: [
          "Venue and catering, photography, music, flowers and styling, and attire. Everything else is meaningful but rarely changes the total by more than a few hundred euro.",
          "If the budget is tight, adjust the big five first. Moving from a Saturday in July to a Friday in April changes venue pricing more than cutting favours ever will.",
        ],
      },
      {
        heading: "Build in a contingency you never touch",
        body: [
          "Set aside 8 to 10 per cent and do not allocate it. Late additions to the guest list, an extra hour of the band, transport for a second location and last-minute stationery all appear in the final six weeks.",
        ],
      },
    ],
  },
  {
    slug: "when-to-book-each-wedding-supplier",
    topic: "Planning",
    title: "When to book each wedding supplier in Ireland",
    excerpt:
      "Venues and photographers go first, and some categories genuinely can wait. Here is a booking order that avoids paying premiums for urgency.",
    readMinutes: 6,
    sections: [
      {
        heading: "12 to 18 months out",
        body: [
          "Venue, then photographer, then the band. Popular Irish venues take Saturday bookings well over a year ahead, and the best-known photographers hold one wedding per day.",
          "Book your celebrant or solemniser at the same time. In Ireland you also need to give the required notice of intention to marry, so start that early.",
        ],
      },
      {
        heading: "6 to 12 months out",
        body: [
          "Videographer, florist, cake, transport and stationery. This is also the sensible window for hair and makeup trials, because you want time to change your mind.",
        ],
      },
      {
        heading: "Inside 6 months",
        body: [
          "Decor and lighting details, favours, day-of coordination and anything driven by the final guest count. Confirm timings with every supplier six weeks out and share one running order with all of them.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-wedding-venue-in-ireland",
    topic: "Venues",
    title: "How to choose an Irish wedding venue without regrets",
    excerpt:
      "Capacity, minimum numbers, wet-weather plans and what 'exclusive use' really means — the questions to ask on every viewing.",
    readMinutes: 7,
    sections: [
      {
        heading: "Ask about minimums before you fall in love",
        body: [
          "Many venues quote a per-person price but also carry a minimum spend or minimum numbers on peak dates. A beautiful room for 200 is the wrong room for 90 guests once the minimum is applied.",
        ],
      },
      {
        heading: "See the wet-weather plan in person",
        body: [
          "Ireland being Ireland, the rain plan is the plan. Ask to stand in the room where drinks reception moves to, and ask where photographs happen if the gardens are unusable.",
        ],
      },
      {
        heading: "Clarify what exclusive use includes",
        body: [
          "Exclusive use can mean the whole estate or just the function wing. Confirm whether other events run the same day, when access starts for suppliers, and what time the bar and music must finish.",
        ],
      },
    ],
  },
  {
    slug: "wedding-music-ireland-bands-djs-singers",
    topic: "Music",
    title: "Ceremony singers, bands and DJs: how Irish wedding music fits together",
    excerpt:
      "Most Irish weddings use three separate music suppliers. Here is how the day splits and how to avoid paying twice for the same hour.",
    readMinutes: 5,
    sections: [
      {
        heading: "Three slots, three suppliers",
        body: [
          "Ceremony music, drinks reception, and the evening band plus DJ. Many bands provide a DJ for after their set, which is usually cheaper than booking separately.",
        ],
      },
      {
        heading: "Check the venue's sound limits",
        body: [
          "Some venues have decibel limiters or hard finish times. Confirm this before you book a ten-piece band, and share the venue contact with your band so they can check load-in and power.",
        ],
      },
    ],
  },
  {
    slug: "wedding-photography-styles-explained",
    topic: "Photography",
    title: "Wedding photography styles explained",
    excerpt:
      "Documentary, fine art, editorial and traditional — what each actually produces on the day and in the album.",
    readMinutes: 5,
    sections: [
      {
        heading: "Documentary",
        body: [
          "Minimal direction, few posed groups, and a gallery that reads like the day happened. Best if you dislike being photographed.",
        ],
      },
      {
        heading: "Fine art and editorial",
        body: [
          "More direction, more attention to light and styling, and fewer frames overall. Build extra time into the running order for couple portraits.",
        ],
      },
      {
        heading: "Ask to see one full wedding",
        body: [
          "Portfolios show the best twenty frames from a hundred weddings. A full gallery shows what your parents' group shot will look like.",
        ],
      },
    ],
  },
  {
    slug: "wedding-flowers-seasons-ireland",
    topic: "Flowers",
    title: "Irish wedding flowers by season",
    excerpt:
      "What is genuinely in season here month by month, and how seasonality changes the quote more than the flower choice does.",
    readMinutes: 4,
    sections: [
      {
        heading: "Spring and early summer",
        body: [
          "Tulips, ranunculus, narcissi and blossom branches. Strong value, and Irish-grown stems are widely available.",
        ],
      },
      {
        heading: "High summer to autumn",
        body: [
          "Garden roses, dahlias, cosmos and grasses. Dahlias in particular give a lot of volume for the price in September.",
        ],
      },
      {
        heading: "Winter",
        body: [
          "Foliage, hellebores, anemones and dried elements. Lean on candles and installation rather than stem count.",
        ],
      },
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
