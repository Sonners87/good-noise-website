import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PhotoImage from "../components/PhotoImage"
import WhyWeExist from "../components/WhyWeExist"
import SpringHolidayJamPopup from "../components/SpringHolidayJamPopup"
import laughingGirlPhoto from "../assets/images/laughing-girl.webp"
import facilitatorPhoto from "../assets/images/facilitator-dave-red-jumper.webp"

const trustPoints = [
  {
    bold: "Dave Sonntag holds a current Working With Children Check and SafeTALK certification.",
    rest: "",
  },
  {
    bold: "No solo pressure",
    rest: " — nobody is singled out to perform alone or assessed individually. It's a group effort from start to finish.",
  },
  {
    bold: "Small group sizes",
    rest: " — kept deliberately small so every voice actually gets heard.",
  },
  {
    bold: "Facilitated the whole way through by Dave",
    rest: " — a working musician, not a classroom teacher running a lesson plan.",
  },
]

// Volume 2 register throughout — paper dominant, no rotation, no ticker, no
// pink highlight-behind-headline. Header still sits on its usual ink strip
// (it's shared sitewide and styled for a dark background); the page's own
// content starts paper-dominant immediately below it.
export default function ForParents() {
  useEffect(() => {
    document.title = "For Parents — Good Noise Project"
  }, [])

  return (
    <>
      <div className="bg-ink">
        <Header />
      </div>

      {/* Opening — eyebrow + intro line only, no headline (Volume 2: no
          highlight-behind-headline, lower visual volume than Volume 1's
          hero pattern). No offset shadow on the photo here — the page's
          one shadow is reserved for the "Who's running it" card below. */}
      <section className="bg-[var(--gn-pink)]">
        <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-14 md:px-10 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12 md:items-start">
            <div className="md:pt-10 lg:pt-14">
              <span className="gn-eyebrow text-ink">For parents</span>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
                Good Noise Project runs small, facilitated music workshops
                for young people in Perth, including our{" "}
                <Link
                  to="/school-holiday-music-camp-perth"
                  className="font-semibold text-ink underline decoration-2 underline-offset-4 hover:text-[var(--gn-ink)]"
                >
                  holiday music program for teens
                </Link>
                . If your young musician's coming to a workshop — or you're
                deciding whether to send them — here's what actually
                happens in the room, who's running it, and how to reach us.
              </p>
            </div>

            <PhotoImage
              src={laughingGirlPhoto}
              alt="A young musician laughing"
              aspect="aspect-[4/5]"
              className="border-2 border-ink"
              objectPosition="center 30%"
            />
          </div>
        </div>
      </section>

      {/* Why We Exist — the exact section reused from the homepage
          (same image, same copy, same ink background). */}
      <WhyWeExist />

      {/* Who's running it — the one featured card on this page. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
            <div className="gn-card" style={{ background: "#DDF1FC" }}>
              <h2 className="font-display text-[clamp(26px,4vw,38px)] leading-[0.98] text-ink">
                Who's Running It, and How We Keep It Safe
              </h2>

              <ul className="mt-6 space-y-3">
                {trustPoints.map((point) => (
                  <li
                    key={point.bold}
                    className="border-t border-ink/15 pt-3 text-base leading-relaxed text-ink/85"
                  >
                    <strong className="font-semibold text-ink">{point.bold}</strong>
                    {point.rest}
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t-2 border-ink pt-6">
                <p className="text-base leading-relaxed text-ink/80">
                  Good Noise Project is run by Dave Sonntag, a drummer of
                  thirty years, a self-taught singer-songwriter, and a
                  dedicated mentor to young people.
                </p>
                <Link
                  to="/about"
                  className="mt-3 inline-block font-semibold text-ink underline decoration-2 underline-offset-4 hover:text-[var(--gn-ink)]"
                >
                  Read Dave's story &rarr;
                </Link>
              </div>
            </div>

            <PhotoImage
              src={facilitatorPhoto}
              alt="Dave Sonntag smiling, sitting on a rooftop ledge in Perth"
              aspect="aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Questions, bookings, or anything else — plain label/value rows,
          not a second card (one .gn-card per page). */}
      <section className="bg-sage">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(26px,4vw,38px)] leading-[0.98] text-ink">
              Questions, Bookings or Anything Else
            </h2>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
                <span className="font-body font-semibold text-xs uppercase tracking-wide text-ink/60">
                  Phone
                </span>
                <a
                  href="tel:+61413626240"
                  className="font-body font-semibold text-ink hover:text-[var(--gn-ink)]"
                >
                  +61 413 626 240
                </a>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
                <span className="font-body font-semibold text-xs uppercase tracking-wide text-ink/60">
                  Email
                </span>
                <a
                  href="mailto:dave@goodnoiseproject.com.au"
                  className="font-body font-semibold text-ink hover:text-[var(--gn-ink)]"
                >
                  dave@goodnoiseproject.com.au
                </a>
              </div>
            </div>

            <p className="mt-8 text-base leading-relaxed text-ink/80">
              Have a question we haven't covered here? Get in touch
              directly.
            </p>
            <Link to="/contact" className="gn-btn-v2 mt-5 text-[13px]">
              Get in touch &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <SpringHolidayJamPopup />
    </>
  )
}
