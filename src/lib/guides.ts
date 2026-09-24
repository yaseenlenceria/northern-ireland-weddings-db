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
    readMinutes: 9,
    sections: [
      {
        heading: "12 to 18 months out",
        body: [
          "Venue, then photographer, then the band. Popular Irish venues take Saturday bookings well over a year ahead, and the best-known photographers hold one wedding per day — once your date goes, it goes.",
          "Book your celebrant or solemniser at the same time. In Ireland you also need to give the required notice of intention to marry (three months minimum by post to the registrar, but start earlier for summer dates), and in the UK you must give notice at a register office once your venue is fixed.",
          "If your date sits between May and September, treat every popular category as scarce. If you are planning November to March or a midweek date, almost everything is easier to secure and often priced more gently.",
        ],
      },
      {
        heading: "6 to 12 months out",
        body: [
          "Videographer, florist, cake, transport and stationery belong in this window. Florists fill summer Saturdays early because each wedding takes a full day of prep that cannot be shared with another booking.",
          "This is also the sensible time for hair and makeup trials: you want room to change your mind once, not two weeks before the day. Book the trial for a month or two after the main booking so the look is still fresh in your artist's schedule.",
          "Groomswear, bridesmaid dresses and attire hire can usually wait until inside twelve months, but order timelines for made-to-measure suits and dye-to-match dresses run eight to sixteen weeks, so have the shop chosen by nine months out.",
        ],
      },
      {
        heading: "Inside 6 months",
        body: [
          "Decor and lighting details, favours, day-of coordination and anything driven by the final guest count. Send invitations around the three-month mark for a local wedding, four months for one that involves travel.",
          "Confirm timings with every supplier six weeks out and share one running order with all of them. Most day-of problems — late arrivals, missing power access, double-booked rooms — come from suppliers working from different timelines.",
        ],
      },
      {
        heading: "If you are already late",
        body: [
          "Booking inside six months is workable if you flex on the date. Ask venues for midweek or Sunday availability, ask suppliers who list 'last-minute' or 'short-notice' experience, and consider a Thursday or Friday: in Ireland and the UK many bands, florists and photographers price those dates 10 to 20 per cent below peak Saturdays.",
          "Prioritise in this order: venue, ceremony legalities, food, photography, then music. Everything decorative can be simplified or bought second-hand; the legal ceremony and the food cannot.",
        ],
      },
      {
        heading: "Deposits, contracts and cancellations",
        body: [
          "Expect to pay a booking deposit of 20 to 40 per cent to hold a date, with the balance due in stages or in full two to six weeks before the wedding. Get every agreement in writing, including the exact hours a supplier will be present and what happens if they are sick.",
          "Ask two questions before paying any deposit: what is refundable if we cancel, and what is payable if you cancel on us? A supplier without a written answer to the second question is a risk, not a bargain.",
          "Keep one simple spreadsheet with every deposit paid, balance due date and final confirmed number. Couples who track this rarely get surprised; couples who rely on email threads often are.",
        ],
      },
      {
        heading: "The final six weeks",
        body: [
          "Final numbers go to the venue and caterers around two to three weeks out — hotels in Ireland typically require a final count ten days ahead, and it is that number, not a later estimate, that you pay for.",
          "Confirm access times with the venue for every supplier, share phone numbers in one message so nobody has to chase, and nominate one person who is not in the bridal party to answer supplier questions on the day.",
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
    readMinutes: 10,
    sections: [
      {
        heading: "Ask about minimums before you fall in love",
        body: [
          "Many venues quote a per-person price but also carry a minimum spend or minimum numbers on peak dates. A beautiful room for 200 is the wrong room for 90 guests once the minimum is applied — you will either invite people you did not want or pay for empty chairs.",
          "Ask for three numbers in writing: the minimum guest count for a Saturday in July, the minimum spend, and what changes on a Friday or a November date. Venues vary widely, and the gap between peak and off-peak terms is often worth several thousand euro.",
        ],
      },
      {
        heading: "See the wet-weather plan in person",
        body: [
          "Ireland being Ireland, the rain plan is the plan. Ask to stand in the room where the drinks reception moves to, and ask where photographs happen if the gardens are unusable.",
          "If you are planning an outdoor ceremony, ask how many times in a typical season the ceremony actually stays outside, what the call-time is for making the indoor decision, and who sets up the room twice. A venue that answers this without flinching runs outdoor ceremonies properly.",
        ],
      },
      {
        heading: "Clarify what exclusive use includes",
        body: [
          "Exclusive use can mean the whole estate or just the function wing. Confirm whether other events run the same day, when access starts for suppliers, and what time the bar and music must finish.",
          "If guests are travelling, ask how far the nearest accommodation is and whether the venue negotiates rates. A venue thirty minutes from the nearest hotel adds a transport line to your budget that a village venue does not.",
        ],
      },
      {
        heading: "Check the legalities for your ceremony type",
        body: [
          "For a civil ceremony in Ireland, the venue must be an approved or subsequently approved location and your solemniser must approve the room. In the UK, the venue must be licensed for marriages. If you are dreaming of a woodland or beach ceremony, the usual route is a legal registration on a separate day plus a humanist or celebrant-led ceremony on the day itself — ask the venue how they handle this.",
          "Religious ceremonies bring their own logistics: church availability is separate from the reception venue, and the gap between ceremony and drinks reception decides your transport plan.",
        ],
      },
      {
        heading: "The full cost checklist",
        body: [
          "Beyond the per-person package, ask what is chargeable: room hire for the ceremony, cake cutting and corkage fees, overnight minimums, supplier meal costs, extra hour extensions on the bar, Overtime for staff, insurance requirements, and whether chair covers, table linen and centrepieces are included or hired separately.",
          "Ask which items in the wedding-breakfast menu carry supplements — sirloin versus chicken, dietary alternatives, children's portions — and whether tea and coffee service after the meal is included. These are the quiet EUR500 to EUR1,500 extras in most venue quotes.",
        ],
      },
      {
        heading: "Questions that reveal how the venue actually runs",
        body: [
          "How many weddings do you host on a peak Saturday, and how many coordinators are on duty? Who is my specific contact in the final month, and will they be in the building on the day? When do we get access for decor setup, and when must everything be collected by?",
          "Ask to see the room set for a wedding, not empty. An empty function room tells you nothing about what your 120 guests will actually experience.",
        ],
      },
      {
        heading: "Red flags worth walking away from",
        body: [
          "Refusal to put minimum numbers or finish times in writing, pressure to pay a large deposit on the day of the viewing, no sample contract to take away, and vague answers about who is in charge on the day itself.",
          "You will work with this venue for twelve to eighteen months. If communication feels difficult during the sales process, it does not improve after the deposit clears.",
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
    readMinutes: 8,
    sections: [
      {
        heading: "Three slots, three suppliers",
        body: [
          "Ceremony music, drinks reception, and the evening band plus DJ. Many bands provide a DJ for after their set, which is usually cheaper than booking separately — ask for the band-plus-DJ price before you price a standalone DJ.",
          "Ceremony and drinks-reception music can often be one act: a singer-guitarist, harpist, string duo or pianist who plays the ceremony, moves to the drinks area and keeps playing through canapes. Bundling those two slots typically saves EUR200 to EUR500 over booking two acts.",
        ],
      },
      {
        heading: "Ceremony music and the rules",
        body: [
          "In a Catholic church, your musician usually needs approval from the parish — many churches have a resident organist and cantor you are expected to use, with outside acts allowed only alongside them. Check this before you book; some parishes are flexible, others are not.",
          "For civil ceremonies, all music must be secular or at least non-religious in content, and your celebrant has the final say on song words. Humanist ceremonies are the most flexible: hymns at a humanist ceremony are unusual, but meaningful pop songs are welcome.",
          "You need four music decisions for any ceremony: entrance, psalm or reflection, signing, and exit. The exit track should be genuinely uplifting — it is the moment everyone remembers.",
        ],
      },
      {
        heading: "The evening: band, DJ or both",
        body: [
          "A good wedding band plays two sets of 45 to 60 minutes, usually 9pm to 11:30pm under most Irish venue licences, with DJ music before, between and after. A DJ-only evening costs a fraction of a band and removes the changeover, which is why smaller weddings increasingly choose it.",
          "If you book both separately, agree the changeover plan: who owns the PA, how long the switch takes, and what plays during it. A fifteen-minute silent gap at 10pm is one of the most common — and most avoidable — wedding music complaints.",
          "Give the band a shortlist of eight to ten songs and let them read the room from there. They do this every weekend; a fixed setlist played in order removes exactly the skill you are paying for.",
        ],
      },
      {
        heading: "Check the venue's sound limits",
        body: [
          "Some venues have decibel limiters or hard finish times. Confirm this before you book a ten-piece band, and share the venue contact with your band so they can check load-in and power.",
          "A limiter at 95dB turns a full band into an acoustic set whether you like it or not. If live volume matters to you, ask the venue directly: is there a limiter, what is the threshold, and which rooms are exempt. This one question prevents the single most common music disappointment.",
        ],
      },
      {
        heading: "Timings that make the night flow",
        body: [
          "First dance works best the moment the band's first set opens — guests are gathered, photos of the floor are easy, and the party starts with momentum. Avoid first-dancing at 9:40pm to an empty dancefloor while the buffet is out.",
          "Plan the evening food service for the changeover between band sets, never during them. And agree a hard last-song time with the venue before the night: bands and DJs finish better on a planned final track than on a lights-up.",
        ],
      },
      {
        heading: "Questions to ask before you book",
        body: [
          "How long have you played weddings (not just gigs), what is your lineup on the night — the same musicians I heard on your videos — and what happens if a band member is sick? Who brings the PA and lights, what are your power needs, and how long is load-in?",
          "Ask for a recent full live video, not a promotional cut. Three minutes of highlights from five weddings hides more than it shows; one unedited song from last month tells you everything.",
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
    readMinutes: 8,
    sections: [
      {
        heading: "Documentary",
        body: [
          "Minimal direction, few posed groups, and a gallery that reads like the day happened. Best if you dislike being photographed.",
          "The trade-off: documentary photographers will still take essential group shots if you ask, but a gallery light on direction means the day needs to be photogenic in itself — good light, interesting rooms, guests who mingle. Dark winter venues and dim marquees are where a purely documentary approach can disappoint.",
        ],
      },
      {
        heading: "Fine art and editorial",
        body: [
          "More direction, more attention to light and styling, and fewer frames overall. Build extra time into the running order for couple portraits — 20 to 30 golden-hour minutes produces the frames people frame.",
          "Editorial styling works with you, not instead of you: clean Getting Ready spaces, tidy rooms and a styled table all show up in the gallery. If you choose this style, assign one person to keep the prep room photogenic.",
        ],
      },
      {
        heading: "Traditional and classic coverage",
        body: [
          "Full group-shot lists, family formals, relaxed but directed couple portraits, and complete event coverage — entrance, speeches, first dance, cake. This is the style that guarantees every combination of family appears in the album.",
          "Most couples end up happiest with a classic photographer who shoots the day documentary-style around a firm group list. Say that sentence to photographers at enquiry stage and watch who reacts well.",
        ],
      },
      {
        heading: "Ask to see one full wedding",
        body: [
          "Portfolios show the best twenty frames from a hundred weddings. A full gallery shows what your parents' group shot will look like — and how the photographer handles rain, dark rooms and running late.",
          "Ask three specific things: one complete recent gallery from a venue like yours, how many edited images a typical couple receives (500 to 800 for a full day is standard) and in what timeframe (8 to 12 weeks is normal; a sneak peek within a week is a fair ask).",
        ],
      },
      {
        heading: "Hours, second shooters and albums",
        body: [
          "Coverage from prep to first dance is usually 8 to 10 hours; every extra hour beyond the agreed span is billed. If budget forces a choice, take an earlier start over a later finish — morning prep, details and anticipation photograph better than a tired 11pm dancefloor.",
          "A second shooter adds parallel coverage — groom prep while bride preps, guests during couple portraits — typically EUR250 to GBP400 for the day. Worth it above roughly 120 guests or for tightly timed days.",
          "Albums are almost always cheaper before the wedding than after: bundling a 30-page album into the package typically beats buying it a year later by 20 to 40 per cent. If you want one at all, price it up front.",
        ],
      },
      {
        heading: "The rain and darkness plan",
        body: [
          "Ask every photographer how they shoot a wet day: which locations they use for cover near your venue, whether they bring off-camera flash, and how they handle a dark hotel ballroom. Ireland weddings need this answer to be boring and confident.",
          "In winter, a 2pm ceremony means sunset portraits happen during the meal — a photographer who plans a quick 15-minute twilight window before darkness, or who suggests a first-look, is showing you they have done this before.",
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
    readMinutes: 7,
    sections: [
      {
        heading: "Spring and early summer",
        body: [
          "Tulips, ranunculus, narcissi and blossom branches. Strong value, and Irish-grown stems are widely available.",
          "March and April can still be cold for delicate blooms — anemones and ranunculus are at their best and cheapest, while peonies do not properly start until late May and command a premium before then. If peonies matter to you, a June date gets them at their peak without the imported-stem markup of an April wedding.",
        ],
      },
      {
        heading: "High summer to autumn",
        body: [
          "Garden roses, dahlias, cosmos and grasses. Dahlias in particular give a lot of volume for the price in September.",
          "July and August are peak demand: every florist is fully booked on Saturdays and prices reflect it. September is the quiet sweet spot — the summer range is still growing, dahlia and chrysanthemum volume is high, and florists have more capacity per date.",
          "October brings autumn foliage, branches and berries at excellent value: one statement arch with beech, smoke bush and rosehips costs far less than the same shape filled with out-of-season garden roses.",
        ],
      },
      {
        heading: "Winter",
        body: [
          "Foliage, hellebores, anemones and dried elements. Lean on candles and installation rather than stem count.",
          "A December wedding buys richness cheaply: pine, eucalyptus, eryngium and dried grasses are inexpensive, and venues already decorated for Christmas mean your flower budget can focus on personal flowers and one or two statement pieces instead of dressing the whole room.",
        ],
      },
      {
        heading: "How to split a flower budget",
        body: [
          "A workable split for a mid-range wedding: 35 to 45 per cent on the ceremony feature (arch, pillars or entrance arrangement) and the room's focal point; 25 to 30 per cent on bridal party flowers; the rest on table styling, which is where costs quietly multiply — centrepieces multiplied by fifteen tables is the biggest number on most florist quotes.",
          "Reusing is free money: plan the ceremony arch to move behind the top table, and bridesmaid bouquets to drop into water vases as table flowers. Tell your florist at the design stage; they will build stems and mechanics to survive the move.",
        ],
      },
      {
        heading: "Questions that change the quote",
        body: [
          "Ask for a quote showing stem-level detail on one sample arrangement, whether foam-free mechanics cost more, what the delivery, setup and collection fees actually are, and whether they can restyle ceremony pieces for the reception within the quoted hours.",
          "Seasonal flexibility saves real money: 'flowers in this palette, not these exact varieties' lets your florist buy at market strength. Couples who lock onto one imported bloom pay for the import on every stem in the room.",
        ],
      },
      {
        heading: "After the day",
        body: [
          "If you want to keep the bouquet, book a preserver before the wedding — resin blocks and pressed frames need the flowers within days. Drying upside down in a dark, dry room works free for roses, hydrangeas and grasses and takes three to four weeks.",
          "Ask the venue what happens to arrangements after collection: many couples gift centrepieces to guests, and some venues pass ceremony pieces to their next-day events or to a local care home. Decide before the day so someone owns the job.",
        ],
      },
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
