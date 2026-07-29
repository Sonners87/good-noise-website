// Central source of truth for every workshop. The homepage teaser card and
// each workshop's own detail page both read from here — add a new object to
// `workshops` for a new workshop rather than hardcoding copy into a page.

export type WorkshopInfoRow = { label: string; value: string }
export type WorkshopHighlight = { title?: string; body: string }
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
  highlightsHeading: string
  highlights: WorkshopHighlight[]

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

  // Trailing fine-print block — each renders only if present.
  prerequisites?: string
  scholarshipNote?: string
  refundPolicy?: string
}

export const workshops: Record<string, Workshop> = {
  "songwriting-sep-2026": {
    slug: "songwriting-sep-2026",
    title: "Good Noise Project: September 2026 Songwriting Workshop",
    shortTitle: "Good Noise Songwriting Workshop",
    teaser:
      "Good Noise, our debut workshop, runs this September school holidays in North Perth — a two-day songwriting experience for Year 9–12 musos.",
    dates: "30 Sep – 1 Oct 2026",
    location: "North Perth",
    price: "$195",
    infoRows: [
      { label: "When", value: "September school holidays (30 Sep – 1 Oct 2026)" },
      { label: "Where", value: "5 Woodville Lane, North Perth WA 6006" },
      { label: "Who", value: "Ages 15-18" },
      { label: "How much", value: "$195" },
    ],
    ctaLabel: "Book your place",
    ctaHref: "/booking",
    introParagraphs: [
      "There's a time to strum alone in your bedroom. Then there's a time to share that riff, that vocal melody, that drum fill with others.",
      "Music's better shared. A 2025 University of Sydney report found 43% of young Australians feel lonely — Good Noise Project exists to make that number a little smaller.",
      "Good Noise Project presents a two-day songwriting workshop in Perth, set inside a room full of instruments begging to be picked up. You'll join several other young musos in a safe space, write your very own song together and perform it in front of your friends and family! There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band.",
      "There's no need to be awesome at your instrument. You might've only just picked it up for the first time. You might even be a gun at your musical tool but want to give another one a go. All that matters is you bring good vibes, a sense of creativity, and maybe a little bit of courage to step out and do something awesome.",
    ],
    highlightsHeading: "What happens over two days:",
    highlights: [
      {
        body: "The first day is all about getting to know each other, your instrument and the song you and your bandmates are gonna bring into the world. There's no sitting and listening to theory — you'll pick up and play an instrument or two (or three), find where's comfortable for you in the group, and lend your ideas to the song (its composition, its structure, its lyrics, its flow) — and you can take your time doing all of it (there's no prizes for the loudest muso, the most vibrant songwriter, the quickest to jump into the limelight). The only reward is feeling good.",
      },
      {
        body: "By day two, you'll be working on your parts, sharpening a few lyrics together, and then you'll be playing your song in front of your loved ones in the exact same room you've spent two days cultivating your songwriting prowess.",
      },
    ],
    limitedSpotsNote:
      "Spots are limited to a small group to ensure everyone feels comfortable, included and has their voice heard (if they want it to be!).",
    refundShortNote: "Refund for cancellations 2+ weeks before.*",
    facilitatorHeading: "About your facilitator",
    facilitatorBio:
      "Running the show is Dave Sonntag — a multi-instrumentalist who's spent years on stages and in studios, and is dedicated to helping young people find their footing through music.",
    facilitatorLinkLabel: "More about Dave",
    facilitatorLinkHref: "/about",
    prerequisites:
      "While we prefer each participant has prior music experience, exceptions can be made for those with a big interest in starting to play. We don't focus on music theory, but a willingness to learn about songwriting, composition and playing together is a must.",
    scholarshipNote:
      "We have a no-questions-asked scholarship policy to ensure our workshops are accessible to everyone who wants to participate. If the cost of workshop presents a significant financial barrier, please reach out to dave@goodnoiseproject.com.au for a partial or full scholarship.",
    refundPolicy:
      "*We will issue a refund minus 20% for cancellations received two weeks in advance of the camp start date. There will be no refunds of cancellation notices received within two weeks, as it is difficult for us to fill the spots on such close notice, and we operate within a narrow budget. We will waive this policy in the event of an emergency or hardship — please email dave@goodnoiseproject.com.au should you need to request this.",
  },

  "in-school-songwriting": {
    slug: "in-school-songwriting",
    title: "Good Noise Project: In-School Song and Lyric Writing Workshop",
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

export const upcomingWorkshopSlug = "songwriting-sep-2026"
