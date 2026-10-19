// Toggles for pausing content without deleting its code. Flip a flag to
// `true` and the associated page(s) come straight back — see the comment
// above each flag for exactly what it controls.

// The October 2026 songwriting camp (ages 11-14): its workshop detail page
// (/workshops/songwriting-oct-2026), its booking page (/booking-oct-camp),
// and the /holiday-camps QR-flyer landing page that promoted it alongside
// the September camp. Paused because the Oct camp is no longer running.
export const SHOW_OCT_2026_CAMP = false

// The 2026 Spring Holidays Jam Program: its workshop detail page
// (/workshops/2026-spring-holidays), its booking + booking-confirmed pages
// (/book-2026-spring-holidays, /booking-confirmed-2026-spring), and its
// "What's coming up" cards. (The /school-holiday-music-camp-perth SEO page is
// evergreen and no longer gated — it features src/data/upcomingProgram.ts.) Paused because the program has run; flip back to
// `true` when it's reprised (and update its dates/copy first).
export const SHOW_SPRING_2026_PROGRAM = false

// The In-School Song and Lyric Writing Workshop (Years 9-12 English classes):
// its page at /for-schools and the old /workshops/in-school-songwriting
// route. In draft because the program and its info pack PDF aren't built yet.
// While false, /for-schools redirects to /after-school-programs, the page is
// out of the sitemap and prerender list, and nothing links to it. Flip to
// `true` to bring the route back, then also: restore the `/for-schools` entry
// in public/sitemap.xml and scripts/prerender.mjs, and revert the two
// redirects in public/_redirects.
export const SHOW_FOR_SCHOOLS_PAGE = false
