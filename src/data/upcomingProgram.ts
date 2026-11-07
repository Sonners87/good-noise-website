// Single source of truth for the "What's Coming Up" program card on
// /school-holiday-music-camp-perth AND the Event JSON-LD on that same page —
// both read from this one object, so the schema can never drift from what a
// visitor actually sees. Drop in the next program here when this one wraps.

export type UpcomingProgram = {
  title: string
  /** null until confirmed — the card shows "TBA". */
  price: number | null
  priceLabel: string
  scholarshipNote: string
  rows: { label: string; value: string }[]
  ages: string
  ctaLabel: string
  ctaHref: string
  refundNote?: string
  /** Event JSON-LD. null while dates/venue are TBA — the page then emits no
      Event markup at all, rather than markup with made-up dates. Dates are
      ISO 8601 with explicit +08:00 (WA does not observe daylight saving). */
  event: {
    venueName: string
    venueAddress: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
    startDateISO: string
    endDateISO: string
    validFromISO: string
    eventDescription: string
    soldOut: boolean
  } | null
  /** Event JSON-LD offers.url — the funnel hand-off page, same as ctaHref
      (the program's /workshops/<slug> conversion page), not the raw
      Stripe booking form. Keeps the SEO page, the card CTA and the schema
      all pointing at one destination. */
  bookingUrl: string
}

export const upcomingProgram: UpcomingProgram = {
  title: "Summer Holidays 2026–27 Music Programs",
  price: null,
  priceLabel: "two programs · North Perth & Cockburn",
  scholarshipNote: "Cost a barrier? Get in touch for a chat — dave@goodnoiseproject.com.au",
  rows: [
    { label: "North Perth", value: "Mon 21 – Tue 22 Dec 2026" },
    { label: "Cockburn", value: "Mon 11 – Wed 13 Jan 2027" },
    { label: "Time", value: "9:30am – 2:30pm" },
    { label: "Who", value: "Ages 13–17" },
  ],
  ages: "13-17",
  ctaLabel: "Choose your program",
  ctaHref: "/workshops/summer-holidays-2026-27",
  event: null,
  bookingUrl: "https://goodnoiseproject.com.au/workshops/summer-holidays-2026-27",
}
