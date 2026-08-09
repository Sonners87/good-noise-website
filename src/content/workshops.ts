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

  introParagraphs: string[]
  /** Rendered above `highlights`, as its own "What to Expect" list — general-vibe expectations rather than a day-by-day schedule. */
  whatToExpect?: WorkshopExpectItem[]
  /** Rendered above `highlights`, as its own "What to Bring" list, right after `whatToExpect`. */
  whatToBring?: string[]
  highlightsHeading: string
  highlights: WorkshopHighlight[]
  /** Short note inviting people outside the workshop's target age range to get in touch. Rendered under the hero info card. */
  ageRangeNote?: string

  // Closing section — a workshop has EITHER a booking-style closing
  // (limitedSpotsNote/refundShortNote) OR a direct-contact closing
  // (directContact), not both.
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
}

const allWorkshops: Record<string, Workshop> = {
  "2026-spring-holidays": {
    slug: "2026-spring-holidays",
    title: "2026 Spring Holidays Jam Program",
    shortTitle: "2026 Spring Holidays Jam Program",
    eyebrow: "CREATE | PLAY | EXPERIMENT",
    teaser:
      "Our next workshop runs this Spring school holidays in North Perth, giving teen musos aged 14–17 the chance to write, compose and perform a song together over two days.",
    dates: "30 Sep – 1 Oct 2026 (9am – 3pm each day)",
    location: "North Perth",
    price: "$195",
    infoRows: [
      { label: "When", value: "2026 Spring School Holidays (30 Sep – 1 Oct 2026)" },
      { label: "Where", value: "5 Woodville Lane, North Perth WA 6006" },
      { label: "Who", value: "Ages 14-17" },
      { label: "How much", value: "$195" },
    ],
    ctaLabel: "Book your place",
    ctaHref: "/book",
    introParagraphs: [
      "There's a time to strum alone in your bedroom. Then there's a time to share that riff, that vocal melody, that drum fill with others.",
      "Music's better shared. A 2025 University of Sydney report found 43% of young Australians feel lonely — Good Noise Project exists to make that number a little smaller.",
      "Good Noise Project presents a two-day songwriting workshop in Perth, set inside a room full of instruments begging to be picked up. You'll join several other young musos in a safe space and write your very own song together! There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band.",
      "There's no need to be awesome at your instrument. You might've only just picked it up for the first time. You might even be a gun at your musical tool but want to give another one a go. All that matters is you bring good vibes, a sense of creativity, and maybe a little bit of courage to step out and do something awesome.",
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
    highlights: [
      {
        title: "Day 1",
        body: "Details coming soon.",
      },
      {
        title: "Day 2",
        body: "Details coming soon.",
      },
    ],
    limitedSpotsNote:
      "Spots are limited to a small group to ensure everyone feels comfortable, included and has their voice heard (if they want it to be!).",
    refundShortNote: "Refund for cancellations 2+ weeks before.",
    ageRangeNote:
      "Outside ages 14–17? Get in touch directly at dave@goodnoiseproject.com.au and we'll sort something out.",
    facilitatorHeading: "About your facilitator",
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
  },

  "songwriting-oct-2026": {
    slug: "songwriting-oct-2026",
    title: "Good Noise Project: October 2026 Songwriting Camp",
    shortTitle: "Good Noise Songwriting Camp",
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
      "A term-long, in-class songwriting program for Years 9–12 English classes, delivered entirely by Good Noise.",
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
      "Sessions are facilitated entirely by Good Noise — teachers can observe, join in, or use the time to catch up on other work. No preparation required on your end.",
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
