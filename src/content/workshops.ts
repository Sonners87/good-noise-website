// Central source of truth for every workshop. The homepage teaser card and
// each workshop's own detail page both read from here — add a new object to
// `workshops` for a new workshop rather than hardcoding copy into a page.

import { SHOW_OCT_2026_CAMP } from "./featureFlags"

export type WorkshopInfoRow = { label: string; value: string }
export type WorkshopHighlight = { title?: string; body: string }
export type WorkshopExpectItem = { bold: string; rest: string }
export type WorkshopDirectContact = { prompt: string; email: string; phone: string }

export type Workshop = {
  slug: string
  title: string
  shortTitle: string
  teaser: string
  /** Detail-page hero eyebrow. Defaults to "Workshop" if omitted. */
  eyebrow?: string
  /** Jam-program hero H1, rendered as `before` + a highlighted `highlight`,
      then a line break, then `after`. Distinct per program: it's the single
      strongest signal that two runs of one format are different offerings. */
  heroHeadline?: { before: string; highlight: string; after: string }
  /** Lead sentence under the jam-program hero headline, up to (but not
      including) the "a little outside that?" aside the page appends. */
  heroLead?: string
  /** Eyebrow above the jam-program hero's details card. */
  infoCardEyebrow?: string
  /** <meta name="description"> for the detail page. Write a distinct one per
      workshop — two runs of the same program share most of their on-page
      copy, so the snippet is one of the few signals telling search engines
      (and anyone reading a result) that they're different offerings. */
  metaDescription?: string

  // Homepage "what's coming up" teaser card — only needed for whichever
  // workshop is currently featured there (see `upcomingWorkshopSlug`).
  dates?: string
  price?: string
  location?: string

  // Detail-page hero info card. Every workshop defines its own rows, since
  // different formats need different fields (price vs. session length,
  // fixed dates vs. ongoing availability, etc.) rather than forcing every
  // workshop into one fixed set of columns.
  infoRows: WorkshopInfoRow[]
  ctaLabel: string
  ctaHref: string

  /** Heading rendered above `introParagraphs`. Omit for no heading. */
  introHeading?: string
  introParagraphs: string[]
  /** Rendered above `highlights`, as its own "What to Expect" list — general-vibe expectations rather than a day-by-day schedule. */
  whatToExpect?: WorkshopExpectItem[]
  /** Rendered above `highlights`, as its own "What to Bring" list, right after `whatToExpect`. */
  whatToBring?: string[]
  highlightsHeading: string
  /** Day-by-day highlight cards. Leave empty to skip this section entirely (e.g. while an itinerary isn't finalised yet). */
  highlights: WorkshopHighlight[]
  /** Short note inviting people outside the workshop's target age range to get in touch. Rendered under the hero info card. */
  ageRangeNote?: string

  // Closing section — a workshop has EITHER a booking-style closing
  // (limitedSpotsNote/refundShortNote) OR a direct-contact closing
  // (directContact), not both.
  /** Heading rendered above `limitedSpotsNote`. Omit for no heading. */
  limitedSpotsHeading?: string
  limitedSpotsNote?: string
  refundShortNote?: string
  directContact?: WorkshopDirectContact

  facilitatorHeading: string
  facilitatorBio: string
  facilitatorLinkLabel: string
  facilitatorLinkHref: string

  // Trailing fine-print block — each renders only if present. refundPolicy
  // is a tiered label/value list (rendered as a compact WorkshopInfoCard),
  // matching the format used on each camp's booking page.
  prerequisites?: string
  scholarshipNote?: string
  refundPolicy?: WorkshopInfoRow[]
  /** Short note on refunding the price difference for early bookers, shown alongside the other fine print. */
  priceMatchNote?: string

  // Prominent scholarship callout — rendered directly under the hero details
  // card, ahead of the fine print. A summary in the decision path, not a
  // replacement for `scholarshipNote`'s fuller policy text below.
  scholarshipCallout?: { heading: string; body: string }

  // Set once every place is taken. Its presence is what flips the detail
  // page out of booking mode: every Book CTA is replaced by the waitlist
  // subscribe block, so nothing on the page can start a checkout while this
  // is here. Remove the block (rather than adding a second flag) to put the
  // workshop back on sale.
  soldOut?: {
    /** Short status line — used as the hero badge and the waitlist eyebrow. */
    badge: string
    heading: string
    body: string
    /** Tags this placement in the shared Netlify/Brevo subscribe stream. */
    subscribeSource: string
  }

  // Set while a program is announced but not yet scheduled — dates, venue
  // and price still TBA. Mirror image of `soldOut`: its presence flips the
  // detail page out of booking mode the same way, replacing every Book CTA
  // with the register-interest form, so nothing on the page can start a
  // checkout before there's something to check out of. Remove the block once
  // the details are locked in and the workshop goes on sale.
  registerInterest?: {
    /** Short status line — used as the hero badge and the form's eyebrow. */
    badge: string
    heading: string
    body: string
    /** Tags this placement in the shared Netlify/Brevo subscribe stream. */
    subscribeSource: string
  }
}

const allWorkshops: Record<string, Workshop> = {
  "2026-spring-holidays": {
    slug: "2026-spring-holidays",
    title: "2026 Spring Holidays Jam Program",
    shortTitle: "2026 Spring Holidays Jam Program",
    eyebrow: "CREATE | PLAY | EXPERIMENT",
    heroHeadline: { before: "Your ", highlight: "Bandmates", after: "Are Waiting!" },
    heroLead:
      "Two days in North Perth jamming out an original song with a bunch of other young musos. Ages 13–17",
    infoCardEyebrow: "Our First Ever Program",
    metaDescription:
      "Two days of the spring school holidays in North Perth, 30 Sep \u2013 1 Oct 2026: teen musos aged 13\u201317 write and jam out an original song together. No theory, no assessment, no solos.",
    teaser:
      "Our next workshop runs this Spring school holidays in North Perth, giving teen musos aged 13–17 the chance to write, compose and perform a song together over two days.",
    dates: "30 Sep – 1 Oct 2026 (9am – 3pm each day)",
    location: "North Perth",
    price: "$80",
    infoRows: [
      { label: "When", value: "Wed, 30 Sep – Thu, 1 Oct 2026" },
      { label: "Time", value: "9am – 3pm each day" },
      {
        label: "Where",
        value: "Player 1 Music School\n5 Woodville Lane, North Perth WA 6006",
      },
      { label: "Who", value: "Ages 13-17" },
      { label: "Group size", value: "8–12 musos" },
      { label: "How much", value: "$80" },
    ],
    ctaLabel: "Book your place",
    ctaHref: "/book-2026-spring-holidays",
    introParagraphs: [
      "Good Noise Project presents a two-day jam program in Perth, set inside a room full of instruments begging to be picked up.",
      "You'll join several other young musos in a safe space and jam out an original song together — lyrics, melody, harmonies, chords, the lot. There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band.",
      "There's no need to be a pro at your instrument. You might've only just picked it up for the first time. You might already be a gun on it and want to give something else a go — or try one you've never touched. Whether you're quiet or loud, confident or used to playing alone in your bedroom, everyone's on equal footing here. All that matters is you bring good vibes, a sense of creativity, and maybe a little bit of courage to step out and do something different.",
    ],
    whatToExpect: [
      {
        bold: "Day 1 is all exploration",
        rest: " — trying instruments, finding a role in the group, shaping ideas together. No theory lessons, no sitting and listening.",
      },
      {
        bold: "Day 2 builds toward one thing",
        rest: ": bringing the song they've written to life, together, as a group.",
      },
      {
        bold: "No solo pressure",
        rest: " — nobody's singled out to perform alone or judged individually. It's a group effort from start to finish.",
      },
      {
        bold: "Small group size",
        rest: " — kept deliberately small so every voice actually gets heard, not lost in a crowd.",
      },
      {
        bold: "Facilitated the whole way through",
        rest: " by Dave — a working musician, not a classroom teacher running a lesson plan.",
      },
    ],
    whatToBring: [
      "Your instrument (range of instruments available)",
      "Water bottle",
      "Packed lunch & snacks each day",
      "Earplugs (if sensitive to noise)",
    ],
    highlightsHeading: "What happens over two days:",
    highlights: [],
    limitedSpotsHeading: "Kept Small On Purpose",
    limitedSpotsNote:
      "Spots are limited to a small group to ensure everyone feels comfortable, included and has their voice heard (if they want it to be!).",
    refundShortNote: "Refund for cancellations 2+ weeks before.",
    ageRangeNote:
      "Outside ages 13–17? Get in touch directly at dave@goodnoiseproject.com.au.",
    facilitatorHeading: "Who's Running It",
    facilitatorBio:
      "Running the show is Dave Sonntag — a multi-instrumentalist who's spent years on stages and in studios, and is dedicated to helping young people find their footing through music.",
    facilitatorLinkLabel: "More about Dave",
    facilitatorLinkHref: "/about",
    prerequisites:
      "While we prefer each participant has prior music experience, exceptions can be made for those with a big interest in starting to play. We don't focus on music theory, but a willingness to learn about songwriting, composition and playing together is a must.",
    scholarshipNote:
      "We have a no-questions-asked scholarship policy to ensure our workshops are accessible to everyone who wants to participate. If the cost of workshop presents a significant financial barrier, please reach out to dave@goodnoiseproject.com.au for a partial or full scholarship.",
    refundPolicy: [
      { label: "More than two weeks' notice", value: "Full refund" },
      { label: "1–2 weeks' notice", value: "50% refund" },
      { label: "Less than one week's notice", value: "No refund" },
    ],
    priceMatchNote:
      "Booked earlier at a higher price? We'll refund you the difference automatically — you don't need to ask.",
    scholarshipCallout: {
      heading: "Cost shouldn't decide this.",
      body: "If $80 is a stretch, email dave@goodnoiseproject.com.au and we'll sort a partial or full place. No questions asked, no awkwardness.",
    },
    soldOut: {
      badge: "This program is full",
      heading: "This One's Full \u2014 Join the Waitlist",
      body: "Every spot for 30 Sep \u2013 1 Oct is taken. Pop your email in and we'll come straight to you if a place opens up from a cancellation \u2014 and you'll be first to hear when the next Good Noise program is announced, before it goes public.",
      subscribeSource: "workshop-2026-spring-holidays-waitlist",
    },
  },

  // The same two-day jam format as the spring program above, run again over
  // the Christmas school holidays. Body copy below the hero is deliberately
  // the spring program's, with the season wording adjusted — reviewed and
  // chosen over a differentiated rewrite. That leaves the two pages near
  // duplicates for search: expect one to be filtered out of results until
  // the copy diverges. The hero (headline, lead) and the meta description
  // are the parts that do differ.
  //
  // Evergreen slug (no year): this URL is reused for each summer run so links
  // and search history accumulate on one page instead of resetting annually.
  // Update the year in `title`/`shortTitle`/`metaDescription` each time.
  //
  // Dates, venue and price aren't locked in yet, so this entry carries a
  // `registerInterest` block instead of a bookable ctaHref: the detail page
  // renders the register-interest form in place of every Book CTA until those
  // details exist. When they do, fill in the TBA rows, add the price row and
  // refund policy back, and delete that block.
  "christmas-holidays-jam-program": {
    slug: "christmas-holidays-jam-program",
    title: "2026 Christmas Holidays Jam Program",
    shortTitle: "2026 Christmas Holidays Jam Program",
    eyebrow: "CREATE | PLAY | EXPERIMENT",
    heroHeadline: { before: "Start A ", highlight: "Band", after: "This Summer" },
    heroLead:
      "Two days of the summer break spent writing one song from nothing with a room full of other young musos. Dates and venue to be announced. Ages 13–17",
    infoCardEyebrow: "What We Know So Far",
    metaDescription:
      "A two-day music program in Perth for ages 13–17 over the December–January school holidays. Write an original song with a small group and jam it out as a band. Dates TBA.",
    teaser:
      "Two days of the summer break in Perth, writing and playing an original song with a small group of other 13–17 year olds. Dates and venue to be announced — register your interest to hear them first.",
    infoRows: [
      { label: "When", value: "TBA" },
      { label: "Time", value: "TBA" },
      { label: "Where", value: "TBA" },
      { label: "Who", value: "Ages 13-17" },
      { label: "Group size", value: "8–12 musos" },
    ],
    ctaLabel: "Register your interest",
    ctaHref: "#register-interest",
    introParagraphs: [
      "Good Noise Project presents a two-day jam program in Perth these Christmas school holidays, set inside a room full of instruments begging to be picked up.",
      "You'll join several other young musos in a safe space and jam out an original song together — lyrics, melody, harmonies, chords, the lot. There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band.",
      "There's no need to be a pro at your instrument. You might've only just picked it up for the first time. You might already be a gun on it and want to give something else a go — or try one you've never touched. Whether you're quiet or loud, confident or used to playing alone in your bedroom, everyone's on equal footing here. All that matters is you bring good vibes, a sense of creativity, and maybe a little bit of courage to step out and do something different.",
    ],
    whatToBring: [
      "Your instrument (range of instruments available)",
      "Water bottle",
      "Packed lunch & snacks each day",
      "Earplugs (if sensitive to noise)",
    ],
    highlightsHeading: "What happens over two days:",
    highlights: [],
    limitedSpotsHeading: "Kept Small On Purpose",
    limitedSpotsNote:
      "Spots are limited to a small group to ensure everyone feels comfortable, included and has their voice heard (if they want it to be!).",
    ageRangeNote:
      "Outside ages 13–17? Get in touch directly at dave@goodnoiseproject.com.au.",
    facilitatorHeading: "Who's Running It",
    facilitatorBio:
      "Running the show is Dave Sonntag — a multi-instrumentalist who's spent years on stages and in studios, and is dedicated to helping young people find their footing through music.",
    facilitatorLinkLabel: "More about Dave",
    facilitatorLinkHref: "/about",
    prerequisites:
      "While we prefer each participant has prior music experience, exceptions can be made for those with a big interest in starting to play. We don't focus on music theory, but a willingness to learn about songwriting, composition and playing together is a must.",
    scholarshipNote:
      "We have a no-questions-asked scholarship policy to ensure our workshops are accessible to everyone who wants to participate. If the cost of the workshop presents a significant financial barrier, please reach out to dave@goodnoiseproject.com.au for a partial or full scholarship.",
    scholarshipCallout: {
      heading: "Cost shouldn't decide this.",
      body: "If the cost is a stretch, email dave@goodnoiseproject.com.au and we'll sort a partial or full place. No questions asked, no awkwardness.",
    },
    registerInterest: {
      badge: "Dates to be announced",
      heading: "Get The Dates First",
      body: "We're locking in dates and a venue for the summer break now. Leave your name and email and you'll have them the day they're confirmed — ahead of the public announcement, and before the rest of your holidays fill up.",
      // Year-stamped even though the slug isn't: next summer's run reuses
      // this page, and its registrations need to be a separate stream.
      subscribeSource: "workshop-2026-christmas-holidays-register-interest",
    },
  },

  "songwriting-oct-2026": {
    slug: "songwriting-oct-2026",
    title: "Good Noise Project: October 2026 Songwriting Camp",
    shortTitle: "Good Noise Project Songwriting Camp",
    eyebrow: "Camp",
    teaser:
      "Our next workshop runs this October school holidays in North Perth, giving Years 6–8 musos the chance to write, compose and perform a song together over two days.",
    dates: "6 – 7 Oct 2026 (9am – 3pm each day)",
    location: "North Perth",
    price: "$195",
    infoRows: [
      { label: "When", value: "October school holidays (6–7 Oct 2026)" },
      { label: "Where", value: "5 Woodville Lane, North Perth WA 6006" },
      { label: "Who", value: "Ages 11–14 (Years 6–8)" },
      { label: "How much", value: "$195" },
    ],
    ctaLabel: "Book your place",
    ctaHref: "/booking-oct-camp",
    introParagraphs: [
      "There's a time to hum a tune in your bedroom. Then there's a time to bring it to life with a room full of other kids who love music just as much as you do.",
      "A 2025 University of Sydney report found 43% of young Australians feel lonely — and making friends through a shared passion, especially before high school, is one of the best ways to build real, lasting connection.",
      "Good Noise Project presents a two-day songwriting camp in Perth, set inside a room full of instruments just waiting to be picked up. Your child will join a small group of other young musos, help write an original song together, and perform it to family and friends at the end of day two. There's no judgement and no pressure to be the best — just a genuinely fun, supported space to explore music, make friends, and create something they're proud of.",
      "There's no need for years of lessons. They might be picking up an instrument for the very first time, or they might already play and want to try something new. All they need to bring is curiosity, a willingness to give things a go, and an openness to make some noise with new friends.",
    ],
    highlightsHeading: "What happens over two days:",
    highlights: [
      {
        body: "Day one is all about getting comfortable — with the space, with each other, and with the instruments in the room. There's no sitting and listening to theory. Kids get hands-on straight away, trying instruments, meeting the group, and starting to shape the song they'll write together. Everyone contributes in their own way, and there's no rush.",
      },
      {
        body: "By day two, the group is refining their song — sharpening lyrics, practising parts — before performing it together for family and friends, right in the same room where they've spent two days building it.",
      },
    ],
    limitedSpotsNote:
      "Spots are limited to a small group, so every child feels comfortable, included, and genuinely part of the group.",
    refundShortNote: "Refund for cancellations 2+ weeks before.",
    facilitatorHeading: "About your facilitator",
    facilitatorBio:
      "Running the show is Dave Sonntag — a multi-instrumentalist who's spent years on stages and in studios, and is dedicated to helping young people find their footing through music.",
    facilitatorLinkLabel: "More about Dave",
    facilitatorLinkHref: "/about",
    prerequisites:
      "While we prefer each participant has some prior interest in music, no experience is necessary — enthusiasm matters far more than skill. We don't focus on music theory; just a willingness to give things a go and play alongside others.",
    scholarshipNote:
      "We have a no-questions-asked scholarship policy to ensure our workshops are accessible to everyone who wants to participate. If the cost of the camp presents a significant financial barrier, please reach out to dave@goodnoiseproject.com.au for a partial or full scholarship.",
    refundPolicy: [
      { label: "More than two weeks' notice", value: "Full refund" },
      { label: "1–2 weeks' notice", value: "50% refund" },
      { label: "Less than one week's notice", value: "No refund" },
    ],
  },

  "in-school-songwriting": {
    slug: "in-school-songwriting",
    title: "In-School Song and Lyric Writing Workshop",
    shortTitle: "In-School Song and Lyric Writing Workshop",
    teaser:
      "A term-long, in-class songwriting program for Years 9–12 English classes, delivered entirely by Good Noise Project.",
    eyebrow: "For Schools",
    infoRows: [
      { label: "When", value: "One school term" },
      { label: "Where", value: "Delivered at your school" },
      { label: "Who", value: "Years 9–12 English classes" },
      { label: "Session length", value: "45–60 minutes" },
    ],
    ctaLabel: "Download the Info Pack",
    ctaHref: "/info-pack.pdf",
    introParagraphs: [
      "Songwriting is one of the oldest forms of human communication — and it uses almost every skill the English curriculum asks students to build. Metaphor. Imagery. Voice. Tone. Structure. Audience. The difference is, students don't think they're doing English. They think they're writing a song.",
      "Delivered over a full term, students move from analysing lyrics as texts, to writing from a specific personal image, to shaping a verse and chorus with real structural intent — the same thinking the syllabus asks for, built through a form students already care about.",
      "Sessions are facilitated entirely by Good Noise Project — teachers can observe, join in, or use the time to catch up on other work. No preparation required on your end.",
    ],
    highlightsHeading: "Why It Works",
    highlights: [
      {
        title: "Tailored to your class",
        body: "Every workshop is shaped around what your students need and what you're trying to achieve — whether that's a specific text type, a particular cohort, or outcomes you're already working toward this term.",
      },
      {
        title: "Minimal time, real outcomes",
        body: "No lesson planning, no extra marking, no preparation. The workshop slots into existing English time and hands back work you can use.",
      },
      {
        title: "Built for the syllabus, not around it",
        body: "Sessions are designed to address WA English curriculum outcomes in creating, analysing and reflecting on texts — across Years 9–12, including ATAR units.",
      },
    ],
    directContact: {
      prompt: "Want to talk it through, or bring this into your school? Get in touch directly.",
      email: "dave@goodnoiseproject.com.au",
      phone: "0413 626 240",
    },
    facilitatorHeading: "About your facilitator",
    facilitatorBio:
      "Running the show is Dave Sonntag — a multi-instrumentalist who's spent years on stages and in studios, and over a decade as a professional copywriter. He's also the author of the novel Broken Flags, published under the pseudonym James Sunday. Dave is dedicated to helping young people find their footing through music, and brings the same care to how the words on the page work.",
    facilitatorLinkLabel: "More about Dave",
    facilitatorLinkHref: "/about",
  },
}

// The October 2026 camp is paused (see SHOW_OCT_2026_CAMP) — filtered out of
// the exported map so its detail page (looked up by slug) 404s via the
// normal "unknown workshop" path, without deleting its content above.
export const workshops: Record<string, Workshop> = SHOW_OCT_2026_CAMP
  ? allWorkshops
  : Object.fromEntries(
      Object.entries(allWorkshops).filter(([slug]) => slug !== "songwriting-oct-2026"),
    )

// Used by the header's single "Our next workshop" CTA — the chronologically
// nearest camp.
export const upcomingWorkshopSlug = "2026-spring-holidays"

// Every program currently open for booking or registration, soonest first.
// Read by the homepage "What's Coming Up" section and the Workshops pillar
// page, so adding or retiring a program is one edit here rather than two.
export const upcomingWorkshopSlugs = [
  "2026-spring-holidays",
  "christmas-holidays-jam-program",
]

// Shared by every place that renders a workshop's "Who's it for" line (the
// pillar page cards and the homepage teaser) so they can't drift from the
// info card's own "Who" row.
export function workshopWhoFor(slug: string): string {
  return workshops[slug]?.infoRows.find((row) => row.label === "Who")?.value ?? ""
}
