// Hub for the summer 2026–27 holiday programs. Its only job is to send the
// visitor to one of the two program pages. Replaces the old
// /workshops/christmas-holidays-jam-program (301 in public/_redirects).
import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PhotoImage from "../components/PhotoImage"
import SubscribeForm from "../components/SubscribeForm"
import { linkifyEmail } from "../lib/linkifyEmail"
import { setCanonical, setPageMeta } from "../lib/pageMeta"
import facilitatorPhoto from "../assets/images/dave-bio.webp"

const HUB_PATH = "/workshops/summer-holidays-2026-27"
const PAGE_TITLE = "Summer Holidays Music Program Perth 2026–27 | Good Noise Project"
const PAGE_DESCRIPTION =
  "Start a band these summer holidays. Two teen songwriting and jam programs in Perth — North Perth in December, Cockburn in January. Ages 13–17, max 12."

const programs = [
  {
    place: "North Perth",
    venue: "Player 1 Music School, North Perth",
    dates: "Mon 21 – Tue 22 Dec 2026",
    length: "2 days",
    line: "Two days of jamming and songwriting, with recording built in.",
    href: `${HUB_PATH}/north-perth`,
    blue: false,
  },
  {
    place: "Cockburn",
    venue: "Cockburn Youth Centre",
    dates: "Mon 11 – Wed 13 Jan 2027",
    length: "3 days",
    line: "Two days writing, day three recording it track by track.",
    href: `${HUB_PATH}/cockburn`,
    blue: true,
  },
]

const faqs = [
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
    a: "Most people won't. The first morning is built around getting comfortable with each other, and with a max of 12 of you nobody disappears into the back of the room.",
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

export default function SummerHolidaysHub() {
  useEffect(() => {
    setPageMeta(PAGE_TITLE, PAGE_DESCRIPTION)
    setCanonical(HUB_PATH)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--gn-acid)]">
        <Header tone="onAcid" />
        <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-14 text-center md:px-10 md:pt-14 md:pb-20">
          <span className="gn-eyebrow text-ink">CREATE | PLAY | EXPERIMENT</span>
          <h1 className="font-display mt-4 text-[13vw] leading-[0.98] text-ink md:text-[clamp(2.5rem,6vw,5.5rem)]">
            Start A <span className="gn-hl gn-hl-on-acid">Band</span>
            <br />
            This Summer
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            Write an original song with a room full of young musos these summer holidays. Two
            programs, north and south of the river. Ages 13–17.
          </p>
          <div className="mt-8 flex justify-center">
            <a href="#programs" className="gn-btn-primary gn-btn-on-acid text-sm">
              Choose your program &darr;
            </a>
          </div>
        </div>
      </section>

      {/* Program cards */}
      <section id="programs" className="scroll-mt-4 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {programs.map((p) => (
              <div key={p.place} className="gn-card-flat flex flex-col">
                <span className="gn-eyebrow text-terracotta">{p.length}</span>
                <h2 className="font-display mt-3 text-3xl uppercase leading-[0.98] text-ink sm:text-4xl">
                  {p.place}
                </h2>
                <p className="mt-2 font-body text-sm font-semibold text-ink/70">{p.venue}</p>
                <p className="mt-4 font-body text-lg font-bold text-ink">{p.dates}</p>
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink/80">{p.line}</p>
                {/* Button wears the program page's hero colour: orange for
                    North Perth, blue for Cockburn. */}
                <Link
                  to={p.href}
                  className={`gn-btn-primary gn-btn-acid-on-ink mt-6 w-full !py-4 text-center text-sm ${
                    p.blue ? "gn-theme-blue" : ""
                  }`}
                >
                  See program &rarr;
                </Link>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm font-semibold leading-relaxed text-ink/80 md:text-base">
            9:30am – 2:30pm · Ages 13–17 (outside these ages?{" "}
            <a
              href="mailto:dave@goodnoiseproject.com.au"
              className="text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
            >
              talk to us
            </a>
            ) · Max 12 musos
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink/70 md:text-base">
            {linkifyEmail("Cost a barrier? Feel free to get in touch for a chat — dave@goodnoiseproject.com.au")}
          </p>
        </div>
      </section>

      {/* Intro — statement band */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-24">
          <p className="font-display mx-auto max-w-4xl text-center text-2xl leading-[1.5] text-[var(--gn-paper)] sm:text-3xl md:text-4xl md:leading-[1.45]">
            There's <span className="gn-hl">no judgement</span>, no benchmarks and no need to be
            good — all levels are welcome and everyone's on equal footing, so you might just find{" "}
            <span className="gn-hl">your first band</span>. You'll leave with real songwriting
            tools to keep writing your own music, whether you want to write whole songs or play one
            part in a band.
          </p>
        </div>
      </section>

      {/* Who's running it */}
      <section className="bg-cream">
        <div className="mx-auto grid w-fit max-w-full grid-cols-1 items-center justify-items-center gap-8 px-5 pt-16 pb-20 md:grid-cols-[23.5rem_22rem] md:justify-items-start md:gap-14 md:px-10 md:pt-28 md:pb-32">
          <PhotoImage
            src={facilitatorPhoto}
            alt="Dave Sonntag smiling and gesturing as he talks to a group in a jam room, wearing a black Good Noise T-shirt"
            aspect="aspect-[4/5]"
            objectPosition="center 25%"
            className="mx-auto w-full max-w-sm md:max-w-none"
          />
          <div>
            <h2 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
              Who's Running It
            </h2>
            <div className="mt-5 max-w-md space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
              <p>
                Dave Sonntag — a drummer of thirty years, a self-taught singer-songwriter, and a
                dedicated mentor to young people.
              </p>
              <p>All facilitators hold a current WA Working With Children Check.</p>
              <Link
                to="/about"
                className="inline-block font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
              >
                More about Dave &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-14 md:px-10 md:pb-20">
          <h2 className="font-display mx-auto max-w-2xl text-center text-4xl leading-[0.98] text-ink sm:text-5xl">
            Questions You Might Have
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="gn-card-flat">
                <h3 className="font-body text-base font-bold text-ink md:text-lg">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                  {linkifyEmail(item.a)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not ready to book — small list capture */}
      <section className="bg-[var(--gn-acid)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <div className="gn-card-flat mx-auto max-w-xl text-center">
            <h2 className="font-display text-2xl uppercase leading-[0.98] text-ink sm:text-3xl">
              Not ready to book? Join the mailing list
            </h2>
            <SubscribeForm
              source="summer-holidays-2026-27-hub"
              variant="compact"
              submitLabel="Join the mailing list"
              className="mx-auto mt-5 w-full text-left"
            />
            <p className="mt-4 text-xs leading-relaxed text-ink/70">We never spam, and you can unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
