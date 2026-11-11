// Program-page template config. One entry per summer 2026–27 program; the
// shared page (pages/ProgramPage.tsx), its booking page (ProgramBook.tsx) and
// confirmation page (ProgramConfirmed.tsx) are all driven from here. To add a
// program (e.g. Cockburn), add a second entry and register it in `programs`.
// Routes are generic (/workshops/summer-holidays-2026-27/:program[/book|/confirmed]).
//
// Netlify's stripe-webhook function can't import this file — its per-program
// confirmation email lives in netlify/functions/stripe-webhook.js, keyed by
// Stripe Payment Link ID. Keep the two in sync.

export const HUB_PATH = "/workshops/summer-holidays-2026-27"

/** Swap for the real Payment Link. While it contains "PLACEHOLDER" the booking
    page refuses to send anyone to Stripe (see ProgramBook.tsx). */
export const NORTH_PERTH_STRIPE_URL = "https://book.stripe.com/bJedR9f0G0uk2qOfcn3F607"
export const COCKBURN_STRIPE_URL = "https://buy.stripe.com/cNi3cv3hYela9Tg1lx3F606"

export type ProgramPanel = {
  day: string
  title: string
  intro: string
  bullets: string[]
  /** Optional image slot shown at the top of the panel (media key). */
  imageKey?: string
}

export type ProgramFaq = { q: string; a: string }

export type MediaImage = {
  /** Drop a file with exactly this name into src/assets/programs/ and it appears. */
  file: string
  alt: string
}

export type MediaVideo = {
  /** Local MP4 in src/assets/programs/ — OR set embedUrl instead. */
  file?: string
  /** Poster image in src/assets/programs/. */
  posterFile?: string
  /** e.g. a YouTube/Vimeo embed URL. Takes precedence over `file`. */
  embedUrl?: string
  title: string
}

export type ProgramConfig = {
  slug: string
  /** Page accent colour: "orange" (default brand spark) or "blue" (remaps every acid/orange element). */
  theme: "orange" | "blue"
  /** Short place name, e.g. "North Perth". */
  place: string
  /** Full program name, used in consent wording and confirmation copy. */
  name: string
  campLabel: string
  /** Netlify form name (hidden form in index.html). */
  formName: string
  path: string
  bookPath: string
  confirmedPath: string

  headline: { before: string; highlight: string; after: string }
  subline: string
  eyebrow: string

  days: number
  daysWord: string
  dates: string
  time: string
  venueName: string
  venueLine: string
  /** Street/postcode optional — omit until confirmed rather than guessing. */
  venueAddress: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  ageText: string
  maxGroup: number
  priceDollars: number
  /** e.g. "for both days" / "for all three days". */
  priceNote: string
  stripeUrl: string
  startISO: string
  endISO: string

  costNote: string
  /** First intro paragraph, shown as a large statement band (same treatment
      as the hub's intro). `highlight` gets the highlight block. */
  introLead: { before: string; highlight: string; after: string }
  introParagraphs: string[]
  scheduleHeading: string
  panels: ProgramPanel[]
  scheduleClosing: string[]
  /** Optional short callout after the schedule. */
  whyRecording?: { heading: string; lines: string[] }
  /** Group photo (frame and shadow baked in) shown on the confirmation page. */
  confirmedImage?: MediaImage
  whatToBring: string[]
  keptSmall: { heading: string; note: string }
  facilitatorHeading: string
  faqs: ProgramFaq[]
  crossLink: { text: string; href: string }

  /** Cancellation/refund tiers. Left undefined until the policy for this
      program is confirmed — the page then shows a preview-only placeholder. */
  refundPolicy?: { label: string; value: string }[]

  meta: { title: string; description: string }
  subscribeSource: string

  media: {
    images: Record<string, MediaImage>
    /** Optional. Omit to leave the video section out entirely. */
    video?: MediaVideo
  }
}

const sharedRefundPolicy = [
  { label: "More than two weeks' notice", value: "Full refund" },
  { label: "1–2 weeks' notice", value: "50% refund" },
  { label: "Less than one week's notice", value: "No refund" },
]

const sharedFaqs: ProgramFaq[] = [
  {
    q: "Do I have to sing?",
    a: "No. Plenty of people won't. There's a whole band's worth of things to be doing, and you'll find the role that suits you.",
  },
  {
    q: "I'm 13 — will everyone else be older and better than me?",
    a: "The group runs 13 to 17, with a real mix of experience. That's on purpose, not by accident. Some people will have been playing for a decade, some for a year, and it genuinely doesn't create a hierarchy — everyone's writing something new together, so nobody's ahead.",
  },
  {
    q: "Do I need to be good?",
    a: "No. We'd prefer you've played something before, but exceptions are made for anyone with a real interest in starting. We don't do theory. Bring a willingness to muck around with songwriting and playing together and you'll be fine.",
  },
  {
    q: "What if I don't know anyone?",
    a: "Most people won't. The whole first morning is built around getting comfortable with each other, and with a max of 12 of you nobody disappears into the back of the room.",
  },
  {
    q: "Do I need my own instrument?",
    a: "No — a range of instruments is available on the day. Bring your own if you've got one and want to use it.",
  },
  {
    q: "What happens after I book?",
    a: "You'll get a confirmation email straight away with all the workshop details, and I'll follow up a week before with everything specific you need to know.",
  },
  {
    q: "What if the cost is a problem?",
    a: "Email dave@goodnoiseproject.com.au and we can have a chat.",
  },
  {
    q: "Got a question that's not here?",
    a: "Just email dave@goodnoiseproject.com.au. Happy to answer anything — from a parent or from you directly.",
  },
]

export const northPerth: ProgramConfig = {
  slug: "north-perth",
  theme: "orange",
  place: "North Perth",
  name: "North Perth Summer Holidays Jam Program",
  formName: "december-2026-signup-north-perth",
  campLabel: "North Perth, December 2026 (21–22 Dec)",
  path: `${HUB_PATH}/north-perth`,
  bookPath: `${HUB_PATH}/north-perth/book`,
  confirmedPath: `${HUB_PATH}/north-perth/confirmed`,

  eyebrow: "CREATE | PLAY | EXPERIMENT",
  headline: { before: "Your ", highlight: "bandmates", after: "are waiting" },
  subline:
    "Two days writing an original song with a room full of young musos. North Perth, 21–22 December.",

  days: 2,
  daysWord: "two days",
  dates: "Mon 21 – Tue 22 Dec 2026",
  time: "9:30am – 2:30pm each day",
  venueName: "Player 1 Music School",
  venueLine: "Player 1 Music School\n5 Woodville Lane, North Perth WA 6006",
  venueAddress: {
    streetAddress: "5 Woodville Lane",
    addressLocality: "North Perth",
    addressRegion: "WA",
    postalCode: "6006",
    addressCountry: "AU",
  },
  ageText: "Ages 13–17",
  maxGroup: 12,
  priceDollars: 180,
  priceNote: "for both days",
  stripeUrl: NORTH_PERTH_STRIPE_URL,
  startISO: "2026-12-21T09:30:00+08:00",
  endISO: "2026-12-22T14:30:00+08:00",

  costNote: "Cost a barrier? Feel free to get in touch for a chat — dave@goodnoiseproject.com.au",

  introLead: {
    before: "Good Noise Project presents a ",
    highlight: "two-day jam program",
    after:
      " in North Perth these summer school holidays, set inside a room full of instruments begging to be picked up.",
  },
  introParagraphs: [
    "You'll join several other young musos in a safe space and jam out an original song together — lyrics, melody, harmonies, chords, the lot — and you'll walk away with a rough recording of what you made. There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band. You'll also leave with real songwriting tools to keep writing your own music, whether you want to write whole songs or play one part in a band.",
    "There's no need to be a pro at your instrument. You might've only just picked it up for the first time. You might already be a gun on it and want to give something else a go — or try one you've never touched. Whether you're quiet or loud, confident or used to playing alone in your bedroom, everyone's on equal footing here. All that matters is you bring good vibes, a sense of creativity, and maybe a little bit of courage to step out and do something different.",
  ],

  scheduleHeading: "How the Two Days Work",
  panels: [
    {
      day: "DAY 1",
      title: "Getting comfortable, finding the song",
      intro:
        "We'll kick off with activities to get everyone comfortable with each other, then move between free jam sessions and the bits that build a song:",
      bullets: [
        "Finding a theme together",
        "Jamming out the feel of the song",
        "Playing around with chords and melodies that sound right to you",
        "Locking in a chorus",
      ],
      imageKey: "schedule-day-1",
    },
    {
      day: "DAY 2",
      title: "Sharpening it up, then capturing it",
      intro: "Day 2 is about taking what you've got and making it sound like yours:",
      bullets: [
        "Writing and tightening the lyrics",
        "Adding parts",
        "Trying new instruments and solos",
        "Run-throughs",
        "A short recording block to capture the song",
      ],
      imageKey: "schedule-day-2",
    },
  ],
  scheduleClosing: [
    "By the end of the last run-through, the group will feel like a band.",
    "You'll leave knowing one of the most important parts of music: how to play with other people, and how good it feels to do it. Even with barely any experience, there's plenty you'll bring to the group. And if you've got years behind you, there's a lot to pick up from everyone else. Jamming with people at all different levels is the whole point — connection with other musos beats anything you'd learn in a music lesson.",
    "And you'll take home songwriting tools you can keep using — to write whole songs of your own, or to bring one part to a band.",
  ],

  whatToBring: [
    "Your instrument (range of instruments available)",
    "Water bottle",
    "Packed lunch & snacks each day",
    "Earplugs (if sensitive to noise)",
  ],
  keptSmall: {
    heading: "Kept Small On Purpose",
    note: "Spots are limited to a small group to ensure everyone feels comfortable, included and has their voice heard (if they want it to be!).",
  },
  confirmedImage: {
    file: "north-perth-confirmed.webp",
    alt: "A group of teen musos and two facilitators crowded together in the jam room with saxophones, bass and a microphone",
  },
  facilitatorHeading: "Who's Running It",
  faqs: sharedFaqs,
  crossLink: {
    text: "Can't make December? There's a three-day program in Cockburn in January",
    href: `${HUB_PATH}/cockburn`,
  },

  refundPolicy: sharedRefundPolicy,

  meta: {
    title: "Teen Music Program North Perth – Summer Holidays Dec 2026 | Good Noise Project",
    description:
      "Two days writing an original song and jamming as a band. Player 1 Music School, North Perth, 21–22 Dec 2026. Ages 13–17, max 12, $180.",
  },
  subscribeSource: "program-summer-2026-27-north-perth",

  media: {
    images: {
      intro: {
        file: "north-perth-intro.webp",
        alt: "Teenage musicians jamming together in a room full of instruments at Player 1 Music School, North Perth",
      },
      "intro-side": {
        file: "north-perth-intro-side.webp",
        alt: "A group of teen musos and two facilitators crowded together in the jam room with saxophones, bass, a microphone and a wall of guitars behind them",
      },
      "schedule-day-1": {
        file: "north-perth-day-1.webp",
        alt: "Three teens sitting on the floor by a window, mapping out a song's verse, chorus and bridge on a big sheet of paper",
      },
      "schedule-day-2": {
        file: "north-perth-day-2.webp",
        alt: "Dave playing an acoustic guitar on the floor, surrounded by teens with guitars and bass working on their parts",
      },
      "what-to-bring": {
        file: "north-perth-what-to-bring.webp",
        alt: "A smiling teenager with round glasses playing a pale blue bass guitar in front of a red velvet curtain",
      },
    },
  },
}

const cockburnFaqs: ProgramFaq[] = (() => {
  const i = sharedFaqs.findIndex((f) => f.q === "What if the cost is a problem?")
  return [
    ...sharedFaqs.slice(0, i),
    {
      q: "Do I need recording experience?",
      a: "No — we'll walk you through everything.",
    },
    {
      q: "Do I get a copy of the recording?",
      a: "Yes — every participant gets a copy of the group's recording. It's a rough-and-ready home recording, not a studio release, but it's yours and you'll have made it together.",
    },
    ...sharedFaqs.slice(i),
  ]
})()

export const cockburn: ProgramConfig = {
  slug: "cockburn",
  theme: "blue",
  place: "Cockburn",
  name: "Cockburn Summer Holidays Jam Program",
  formName: "january-2027-signup-cockburn",
  campLabel: "Cockburn, January 2027 (11–13 Jan)",
  path: `${HUB_PATH}/cockburn`,
  bookPath: `${HUB_PATH}/cockburn/book`,
  confirmedPath: `${HUB_PATH}/cockburn/confirmed`,

  eyebrow: "CREATE | PLAY | EXPERIMENT",
  headline: { before: "Your ", highlight: "bandmates", after: "are waiting" },
  subline:
    "Three days writing an original song with a room full of young musos, then recording it track by track. Cockburn, 11–13 January.",

  days: 3,
  daysWord: "three days",
  dates: "Mon 11 – Wed 13 Jan 2027",
  time: "9:30am – 2:30pm each day",
  venueName: "Cockburn Youth Centre",
  venueLine: "Cockburn Youth Centre\n25 Wentworth Parade, Success WA 6164",
  venueAddress: {
    streetAddress: "25 Wentworth Parade",
    addressLocality: "Success",
    addressRegion: "WA",
    postalCode: "6164",
    addressCountry: "AU",
  },
  ageText: "Ages 13–17",
  maxGroup: 12,
  priceDollars: 260,
  priceNote: "for all three days",
  stripeUrl: COCKBURN_STRIPE_URL,
  startISO: "2027-01-11T09:30:00+08:00",
  endISO: "2027-01-13T14:30:00+08:00",

  costNote: northPerth.costNote,

  introLead: {
    before: "Good Noise Project presents a ",
    highlight: "three-day jam program",
    after:
      " in Cockburn these summer school holidays, set inside a room full of instruments begging to be picked up.",
  },
  introParagraphs: [
    "You'll join several other young musos in a safe space and jam out an original song together — lyrics, melody, harmonies, chords, the lot. Then on day three, it's recording day. You'll learn the basics of recording a song track by track, lay down your part, and walk away with a recording of a song you wrote with your new band — plus the know-how to start recording your own music at home. There's no judgement, no benchmarks, no performance marks — except that you have fun and make awesome connections with other music-lovers. Who knows, maybe you'll find yourself the members of your first band. You'll also leave with real songwriting tools to keep writing your own music, whether you want to write whole songs or play one part in a band.",
    northPerth.introParagraphs[1],
  ],

  scheduleHeading: "How the Three Days Work",
  panels: [
    {
      day: "DAY 1",
      title: "Find the song",
      intro:
        "We'll kick off with activities to get everyone comfortable with each other, then move between free jam sessions and the bits that build a song:",
      bullets: [
        "Getting comfortable together",
        "Finding a theme together",
        "Jamming out the feel of the song",
        "Playing around with chords and melodies that sound right to you",
        "Locking in a chorus",
      ],
      imageKey: "schedule-day-1",
    },
    {
      day: "DAY 2",
      title: "Make it yours",
      intro: "Day 2 is about taking what you've got and making it sound like yours:",
      bullets: [
        "Writing and tightening the lyrics",
        "Arranging the song",
        "Adding parts, solos and instrument swaps",
        "Finishing with a song that's ready to record",
      ],
      imageKey: "schedule-day-2",
    },
    {
      day: "DAY 3",
      title: "Capture it",
      intro: "Day 3 is recording day. Learn the fundamentals of home recording:",
      bullets: [
        "How a song gets built, track by track",
        "Everyone lays down their part",
        "Adding extra layers together — hooks, harmonies, claps, percussion",
        "Leaving with your band's recording",
      ],
      imageKey: "schedule-day-3",
    },
  ],
  scheduleClosing: [
    "By the end of the last run-through, the group will feel like a band.",
    northPerth.scheduleClosing[1],
    northPerth.scheduleClosing[2],
  ],
  whyRecording: {
    heading: "Why Recording Day Matters",
    lines: [
      "Hearing yourself back changes how you play.",
      "You'll see how a track gets built layer by layer, and learn that recording isn't just for studios.",
      "You'll leave with something real to share — and the confidence to keep recording at home.",
    ],
  },

  whatToBring: northPerth.whatToBring,
  keptSmall: northPerth.keptSmall,
  confirmedImage: {
    file: "cockburn-confirmed.webp",
    alt: "A group of teen musos and two facilitators crowded together in the jam room with saxophones, bass and a microphone",
  },
  facilitatorHeading: "Who's Running It",
  faqs: cockburnFaqs,
  crossLink: {
    text: "Want something sooner? There's a two-day program in North Perth in December",
    href: `${HUB_PATH}/north-perth`,
  },

  refundPolicy: sharedRefundPolicy,

  meta: {
    title:
      "Teen Jam Program Cockburn – Summer Holidays Jan 2027 | Good Noise Project",
    description:
      "Three days writing an original song as a band, then recording it track by track. Cockburn Youth Centre, 11–13 Jan 2027. Ages 13–17, max 12, $260.",
  },
  subscribeSource: "program-summer-2026-27-cockburn",

  // Reuses the North Perth photos in the same positions. The spare slot below
  // the intro copy is left empty, as on North Perth. Day 3 has its own photo.
  media: {
    images: {
      intro: {
        file: "cockburn-intro.webp",
        alt: "Teenage musicians jamming together at Cockburn Youth Centre",
      },
      "intro-side": northPerth.media.images["intro-side"],
      "schedule-day-1": northPerth.media.images["schedule-day-1"],
      "schedule-day-2": northPerth.media.images["schedule-day-2"],
      "schedule-day-3": {
        file: "cockburn-day-3.webp",
        alt: "Dave smiling in the middle of the jam room as teens play guitars and saxophones and sing into microphones around him",
      },
      "what-to-bring": northPerth.media.images["what-to-bring"],
    },
  },
}

export const programs: Record<string, ProgramConfig> = {
  [northPerth.slug]: northPerth,
  [cockburn.slug]: cockburn,
}
