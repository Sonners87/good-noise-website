import Eyebrow from "./Eyebrow"

// Dave's founder quote — black background, centred white text. Originally
// built for the old Booking/Music Makers page (now HolidayCamps.tsx),
// pulled out here so it can be reused as-is across other pages.
export default function FounderQuote() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-10 md:py-28">
        <Eyebrow tone="onBlue">In Dave's Words</Eyebrow>
        <blockquote className="font-display mt-4 text-2xl leading-[1.2] text-cream sm:text-3xl md:text-4xl">
          "I had people to relate to and share my time with. I belonged
          somewhere. It wasn't footy after school — it was making music.
          And I could do it without anyone telling me how. It was complete
          freedom. It still is."
        </blockquote>
        <p className="font-body font-semibold mt-6 text-sm tracking-wide text-cream/60">
          — Dave Sonntag, founder of Good Noise Project
        </p>
      </div>
    </section>
  )
}
