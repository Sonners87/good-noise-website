import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import FacilitatorContact from "../components/FacilitatorContact"
import { setLandingPageMeta } from "../lib/pageMeta"
import headphonesPhoto from "../assets/images/why-we-exist-headphones.webp"
import jamPhoto from "../assets/images/after-school-eight-week.webp"
import davePhoto from "../assets/images/after-school-meet-dave.webp"

const PAGE_TITLE = "About the Project | Good Noise Project"
const PAGE_DESCRIPTION =
  "Good Noise Project was created to tackle youth isolation by putting young musicians together and using music to help them connect, play and get things wrong."

const sectionInner = "mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24"
const h2Class = "font-display text-3xl leading-[1.02] sm:text-4xl md:text-5xl"
const bodyClass = "text-base leading-relaxed md:text-lg"

const pillars = [
  { title: "No Judgement", body: "We embrace mistakes. That's where the good stuff comes from." },
  { title: "No Hierarchy", body: "Nobody's here to perform, prove themselves, or hit a benchmark." },
  { title: "No Pressure", body: "Share when you're ready, not a moment before." },
]

const holdTo = [
  "Playing beats listening, every time.",
  "Safety doesn't happen by accident. We build it into every workshop.",
  "The best growth happens through freedom and play.",
]

const roomPoints = [
  { bold: "Small groups.", rest: " Kept small enough that every voice gets heard." },
  { bold: "No solo pressure.", rest: " Nobody is singled out to perform alone or assessed individually. It's a group effort from start to finish." },
  { bold: "Written together.", rest: " The group writes an original song, then plays it as a band." },
  { bold: "A working musician in the room.", rest: " Programs are run by Dave, and a small team where required, as facilitators and mentors." },
]

const safetyPoints = [
  "A Child Safety Policy that follows the National Principles for Child Safe Organisations",
  "Current Working with Children Check for everyone working with participants",
  "SafeTALK (suicide alertness) trained",
  "Photos, video and recordings only with consent, and young people get their own say",
  "Songs belong to the young people who wrote them",
]

export default function AboutTheProject() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, { canonicalPath: "/about-the-project" })
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-cream">
        <Header />
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
          <span className="gn-eyebrow text-[var(--gn-acid)]">About</span>
          <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
            About the Project
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/90 md:text-xl">
            Good Noise Project puts young musicians in a room together and lets music do the connecting.
          </p>
        </div>
      </section>

      {/* Why we exist */}
      <section className="bg-cream text-ink">
        <div className={`${sectionInner} grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14`}>
          <PhotoImage
            src={headphonesPhoto}
            alt="A teenage girl holding headphones next to an acoustic guitar"
            aspect="aspect-[4/5]"
            objectPosition="center 30%"
          />
          <div>
            <h2 className={h2Class}>Why we exist</h2>
            <div className={`mt-6 max-w-xl space-y-5 text-ink/85 ${bodyClass}`}>
              <p>
                A 2025 University of Sydney report found 43% of young Australians feel lonely
                <sup>1</sup>. Isolation has become one of the biggest quiet problems facing young people, and a lot of
                them are carrying it alone.
              </p>
              <p>
                Good Noise Project was created to push back on that. Music alone can't fix loneliness. Playing music
                together is one of the most reliable ways people have ever connected, so we use it as the vehicle. We
                put young musos in a room, hand them instruments and give them a reason to turn to each other.
              </p>
              <p className="text-xs text-ink/55">
                1. sydney.edu.au/news-opinion/news/2025/08/04/more-than-40-percent-of-young-aussies-are-lonely-as-experts-call-for-national-loneliness-strategy.html
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The gap we fill */}
      <section className="bg-ink text-cream">
        <div className={sectionInner}>
          <h2 className={h2Class}>The gap we fill</h2>
          <p className={`mt-6 max-w-2xl text-cream/85 ${bodyClass}`}>
            Music schooling is great at what it does. It builds skill and it has its place. Good Noise Project fills the
            gap beside it.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border-2 border-cream/40 p-6 md:p-8">
              <h3 className="font-display text-xl md:text-2xl">Music schooling focuses on</h3>
              <ul className="mt-5 space-y-3 text-base md:text-lg">
                <li className="border-t border-cream/20 pt-3">Notation</li>
                <li className="border-t border-cream/20 pt-3">Technicality</li>
                <li className="border-t border-cream/20 pt-3">Other people's songs</li>
              </ul>
            </div>
            <div className="border-[3px] border-cream bg-cream p-6 text-ink shadow-[6px_6px_0_0_var(--gn-pink)] md:p-8">
              <h3 className="font-display text-xl md:text-2xl">We focus on</h3>
              <ul className="mt-5 space-y-3 text-base md:text-lg">
                <li className="border-t border-ink/20 pt-3">Play</li>
                <li className="border-t border-ink/20 pt-3">Getting things wrong</li>
                <li className="border-t border-ink/20 pt-3">Feel, and trusting what sounds and feels good</li>
                <li className="border-t border-ink/20 pt-3">Vibe over theory</li>
              </ul>
            </div>
          </div>
          <p className={`mt-10 max-w-2xl text-cream/85 ${bodyClass}`}>
            Everything we run is built around learning by doing. The group writes an original song together, and the song
            is theirs.
          </p>
        </div>
      </section>

      {/* What happens in the room */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className={h2Class}>What happens in the room</h2>
              <ul className="mt-8 space-y-4">
                {roomPoints.map((point) => (
                  <li key={point.bold} className={`border-t-2 border-ink pt-4 text-ink/85 ${bodyClass}`}>
                    <strong className="font-semibold text-ink">{point.bold}</strong>
                    {point.rest}
                  </li>
                ))}
              </ul>
            </div>
            <PhotoImage
              src={jamPhoto}
              alt="Two young musicians sitting on a rug in a jam room, smiling as they write lyrics on sheets of paper"
              aspect="aspect-[4/3]"
              objectPosition="center 40%"
            />
          </div>

          <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="gn-card-flat">
                <h3 className="font-display text-xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we hold to + safety */}
      <section className="bg-ink text-cream">
        <div className={`${sectionInner} grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14`}>
          <div>
            <h2 className={h2Class}>What we hold to</h2>
            <ul className="mt-8 space-y-4">
              {holdTo.map((item) => (
                <li key={item} className={`border-t border-cream/30 pt-4 ${bodyClass}`}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/70">
              There's something genuinely therapeutic in making music together, and we're not a therapy service.
              Anything that needs more support goes to the people around the young person.
            </p>
          </div>
          <div>
            <h2 className={h2Class}>How we keep it safe</h2>
            <ul className="mt-8 space-y-4">
              {safetyPoints.map((item) => (
                <li key={item} className={`border-t border-cream/30 pt-4 ${bodyClass}`}>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-8 flex flex-col gap-2 text-sm font-semibold">
              {[
                { label: "Child Safety Policy", href: "/child-safety-policy" },
                { label: "Photography, Filming and Recording Policy", href: "/photography-policy" },
                { label: "Safety and paperwork for after-school programs", href: "/after-school-programs/safety" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="underline decoration-2 underline-offset-4 hover:text-[var(--gn-acid)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Programs and Dave */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <h2 className={h2Class}>Programs</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link to="/workshops" className="gn-card-flat block transition hover:bg-ink hover:text-cream">
              <h3 className="font-display text-xl">School holiday programs</h3>
              <p className="mt-3 text-sm leading-relaxed">Short, intensive programs for young musicians in Perth.</p>
              <span className="mt-4 inline-block text-sm font-semibold">See workshops &rarr;</span>
            </Link>
            <Link to="/after-school-programs" className="gn-card-flat block transition hover:bg-ink hover:text-cream">
              <h3 className="font-display text-xl">After-school programs</h3>
              <p className="mt-3 text-sm leading-relaxed">
                Weekly songwriting, jamming and recording programs for councils, schools and youth organisations.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold">See after-school programs &rarr;</span>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 items-center gap-10 border-t-2 border-ink pt-12 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className={h2Class}>Who's behind it</h2>
              <p className={`mt-6 max-w-lg text-ink/85 ${bodyClass}`}>
                Good Noise Project is run by Dave Sonntag: a drummer of thirty years, a self-taught singer-songwriter and
                a dedicated mentor to young people.
              </p>
              <FacilitatorContact className="mt-5" />
              <Link to="/about" className="gn-btn-secondary mt-7 text-[13px]">
                Meet Dave &rarr;
              </Link>
            </div>
            <PhotoImage
              src={davePhoto}
              alt="Dave Sonntag smiling as he plays an acoustic guitar in a jam room, surrounded by young musicians"
              aspect="aspect-[4/3]"
              objectPosition="center 30%"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--gn-pink)] text-ink">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-16 text-center md:px-10 md:pb-32 md:pt-24">
          <h2 className={`${h2Class} mx-auto max-w-3xl`}>Want to be part of it?</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PillButton href="/contact" variant="onLight">
              Get in touch
            </PillButton>
            <PillButton href="/stay-in-touch" variant="outline">
              Join the community
            </PillButton>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
