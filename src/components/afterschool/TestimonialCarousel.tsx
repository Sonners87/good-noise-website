import { useRef, useState } from "react"
import type { Testimonial } from "../../content/afterSchool"

// Scroll-snap carousel: every quote is in the DOM (prerender and no-JS
// friendly), swipes natively on phones, and has prev/next buttons and dots for
// everyone else. No autoplay.
export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)

  function go(to: number) {
    const el = track.current
    if (!el) return
    const next = (to + items.length) % items.length
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
  }

  function onScroll() {
    const el = track.current
    if (!el || el.clientWidth === 0) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const buttonClass =
    "flex h-11 w-11 items-center justify-center border-2 border-ink font-body text-lg font-bold transition hover:bg-ink hover:text-cream"

  return (
    <div role="region" aria-roledescription="carousel" aria-label="What people say about our programs">
      <ul
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <li
            key={t.name}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="w-full shrink-0 snap-center"
          >
            <figure className="max-w-3xl">
              <blockquote className="font-display text-2xl leading-snug md:text-3xl">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-base font-semibold">
                {t.name}, <span className="font-normal text-ink/70">{t.role}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex max-w-3xl items-center gap-4">
        <button type="button" aria-label="Previous testimonial" onClick={() => go(index - 1)} className={buttonClass}>
          &larr;
        </button>
        <button type="button" aria-label="Next testimonial" onClick={() => go(index + 1)} className={buttonClass}>
          &rarr;
        </button>
        <div className="ml-2 flex gap-2" aria-hidden="true">
          {items.map((t, i) => (
            <span key={t.name} className={`h-2.5 w-2.5 border-2 border-ink ${i === index ? "bg-ink" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
