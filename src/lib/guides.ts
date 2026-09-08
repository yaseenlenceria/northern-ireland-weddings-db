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
    title: "What a wedding costs in Ireland and the UK in 2026",
    excerpt:
      "A practical 2026 budget breakdown for Ireland and the UK, with realistic ranges for venue, food, photography, flowers, music, styling and the hidden extras.",
    readMinutes: 12,
    sections: [
      {
        heading: "The realistic headline number",
        body: [
          "For a full hotel, country-house or barn-style wedding in 2026, many Irish couples should plan around EUR30,000 to EUR40,000 before honeymoon. In the UK, a typical full wedding often sits around GBP18,000 to GBP30,000, with London, the South East and premium country venues pushing higher.",
          "Those numbers are not targets. A weekday restaurant wedding for 40 people can cost far less, while a Saturday wedding for 160 guests with exclusive use, a band, premium photography, styling and accommodation can move well beyond them. The useful question is not 'what is average?' but 'which parts of our day scale with every extra guest?'",
        ],
      },
      {
        heading: "Start with guests before choosing suppliers",
        body: [
          "Almost every large wedding cost follows the guest count. Food is per person, drinks packages are per person, evening food is per person, stationery is per household, favours are per guest and the room you need is decided by whether you are seating 80, 120 or 200.",
          "Before you fall in love with a venue, write three guest lists: essential, likely and everyone. Then multiply the likely list by your expected food and drink cost. For Ireland, EUR90 to EUR150 per guest is a sensible planning range for many hotel and country-house packages. For the UK, GBP70 to GBP140 per guest is a useful early range, with high-end venues above that.",
          "If that one line already uses more than half the budget, the fix is guest count, date, venue type or package level. Cutting favours will not solve a venue and catering budget that is already too large.",
        ],
      },
      {
        heading: "Core budget ranges by category",
        body: [
          "Venue and catering: Ireland EUR12,000 to EUR25,000 for many 100 to 150 guest hotel or country-house weddings; UK GBP8,000 to GBP22,000 depending on region, exclusivity and menu. Exclusive-use hire can add several thousand before food is counted.",
          "Photography: Ireland EUR2,000 to EUR4,000; UK GBP1,500 to GBP3,500. Two photographers, albums, travel and fast delivery increase the quote. Videography often adds a similar second line: Ireland EUR1,800 to EUR4,000, UK GBP1,200 to GBP3,000.",
          "Music and entertainment: ceremony music can be EUR400 to EUR1,000 or GBP300 to GBP900. A strong evening band plus DJ can sit around EUR2,000 to EUR4,000 in Ireland or GBP1,200 to GBP3,500 in the UK. A DJ-only evening is usually lower.",
          "Flowers, decor and styling: simple personal flowers may start under EUR800 or GBP700, while ceremony arches, staircase florals, table installations and room styling can reach EUR3,000 to EUR8,000 or GBP2,000 to GBP7,000.",
          "Cake, stationery, transport, celebrant or registrar fees, beauty, attire and rings often look small one by one but can easily add EUR5,000 to EUR12,000 or GBP4,000 to GBP10,000 together.",
        ],
      },
      {
        heading: "Where couples overspend without noticing",
        body: [
          "The common budget leak is not one dramatic purchase. It is upgrade stacking: premium canapes, a second entree choice, late bar, extra hour of photography, larger bridal party, additional transport, menu tasting extras, ceremony decor that cannot be reused and last-minute stationery reprints.",
          "Ask every supplier for a quote with three columns: included, optional and not included. Anything that is optional should stay outside the working budget until the core wedding is affordable.",
        ],
      },
      {
        heading: "A simple 100 guest planning model",
        body: [
          "For a 100 guest wedding, a balanced mid-range plan might reserve 50 to 60 per cent for venue, food and drink; 8 to 12 per cent for photography; 5 to 10 per cent for video; 6 to 10 per cent for music; 5 to 10 per cent for flowers and styling; and the rest for attire, beauty, cake, stationery, transport, ceremony costs and contingency.",
          "If the venue package is already 65 per cent of the budget, choose a lower-cost date or a smaller guest list before trimming the suppliers you care about. If photos matter most, protect that line and simplify decor. If food and party atmosphere matter most, put money into menu, bar and music before extras.",
        ],
      },
      {
        heading: "Build in a contingency you do not spend",
        body: [
          "Keep 8 to 10 per cent unassigned until the final six weeks. Late guest changes, supplier meals, taxis, umbrellas, extra printing, dress alterations, child meals and bar extensions tend to appear after couples think the budget is finished.",
          "The healthiest wedding budget is not the cheapest one. It is the one where every confirmed supplier is affordable, every deposit is written down, and there is still room for one or two late practical costs without using credit.",
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
