// Standalone landing page for the spring school holiday camps — built to
// receive cold traffic from a QR code on printed flyers, so it assumes zero
// prior context and isn't linked from the site's primary navigation. Several
// sections deliberately reuse homepage components/copy word-for-word per the
// brief, rather than duplicating that content by hand.
import { useEffect, type ReactNode } from "react"
import Eyebrow from "../components/Eyebrow"
import PhotoImage from "../components/PhotoImage"
import Facilitator from "../components/Facilitator"
import WhyWeExist from "../components/WhyWeExist"
import Footer from "../components/Footer"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "../components/PillButton"
import logo from "../assets/logo/good-noise-logo.svg"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"

// Both "Book Now" and "Explore" CTAs are intentionally unlinked — the two
// dedicated camp pages aren't finalised yet. Rendered as inert buttons
// (not links) so they're fully styled and ready to wire up once the real
// destination URLs are provided.
function UnlinkedButton({
  variant,
  className = "",
  children,
}: {
  variant: keyof typeof pillVariantStyles
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`${pillBaseStyles} ${pillSizeStyles.md} ${pillVariantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default function HolidayCamps() {
  useEffect(() => {
    document.title = "Songwriting Camps This Spring — Good Noise Project"
  }, [])

  return (
    <>
      {/* Header + hero */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 pt-14 md:px-10 md:pt-20">
          <img src={logo} alt="Good Noise" className="mx-auto block h-14 w-auto md:h-20" />
          <p className="font-body font-bold mx-auto mt-6 max-w-2xl text-center text-lg text-white md:text-xl">
            Two-day songwriting camps in North Perth, for two different age
            groups.
          </p>
        </div>

        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 text-center md:px-10 md:pb-32 md:pt-24">
          <Eyebrow tone="onBlue">According to researchers —</Eyebrow>

          <h1 className="font-display mx-auto max-w-4xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Making music together breaks down social barriers between
            strangers faster than almost any other shared activity.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            This September school holidays, Good Noise Project brings kids
            together to make music — and make friends faster than almost
            anything else can.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-start justify-center gap-x-10 gap-y-8">
            <div className="flex flex-col items-center gap-3">
              <span className="font-body font-semibold text-xs tracking-wide text-white/70">
                Ages 11–14
              </span>
              <UnlinkedButton variant="onBlue">Book Now</UnlinkedButton>
              <span className="font-body font-semibold text-xs text-white/70">
                Full refunds available
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="font-body font-semibold text-xs tracking-wide text-white/70">
                Ages 15–18
              </span>
              <UnlinkedButton variant="primary">Book Now</UnlinkedButton>
              <span className="font-body font-semibold text-xs text-white/70">
                Full refunds available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two camps */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="border-2 border-ink bg-white p-8 md:p-10">
              <span className="font-body font-semibold text-xs tracking-wide text-ink/50">
                Ages 11–14
              </span>
              <h2 className="font-display mt-3 text-3xl leading-[1.02] text-ink sm:text-4xl">
                Somewhere to Belong, For Life
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink/80 md:text-lg">
                A room full of instruments, and other kids who love music
                just as much as they do. This could be the start of
                something they carry with them for years.
              </p>
              <UnlinkedButton variant="primary" className="mt-8">
                Explore Ages 11–14 Camp &rarr;
              </UnlinkedButton>
            </div>

            <div className="border-2 border-ink bg-white p-8 md:p-10">
              <span className="font-body font-semibold text-xs tracking-wide text-ink/50">
                Ages 15–18
              </span>
              <h2 className="font-display mt-3 text-3xl leading-[1.02] text-ink sm:text-4xl">
                Find Your People. Maybe Even Your First Band.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink/80 md:text-lg">
                Two days. One song, written and performed with musos
                they've never met. No pressure to be great — just to play,
                and maybe do something they've never done before.
              </p>
              <UnlinkedButton variant="primary" className="mt-8">
                Explore Ages 15–18 Camp &rarr;
              </UnlinkedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Reused word-for-word from the homepage, including its image */}
      <WhyWeExist />

      {/* In Dave's words */}
      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-10 md:py-32">
          <PhotoImage
            src={facilitatorPhoto}
            alt="Dave Sonntag smiling, sitting on a rooftop ledge in Perth"
            aspect="aspect-[4/5]"
            objectPosition="center 20%"
          />

          <div>
            <Eyebrow tone="onBlue">In Dave's Words</Eyebrow>
            <blockquote className="font-display text-2xl leading-[1.15] text-cream sm:text-3xl md:text-4xl">
              "I had people to relate to and share my time with. I belonged
              somewhere. It wasn't footy after school — it was making music.
              And I could do it without anyone telling me how. It was
              complete freedom. It still is."
            </blockquote>
            <p className="font-body font-semibold mt-6 text-sm tracking-wide text-cream/60">
              — Dave Sonntag, founder of Good Noise Project
            </p>
          </div>
        </div>
      </section>

      {/* Reused word-for-word from the homepage, including its image */}
      <Facilitator />

      {/* Direct contact, same treatment as the in-school workshop's direct-contact closing */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Got a question before you book? Reach out directly.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 font-body text-base text-white md:text-lg">
            <a
              href="mailto:dave@goodnoiseproject.com.au"
              className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
            >
              dave@goodnoiseproject.com.au
            </a>
            <a
              href="tel:0413626240"
              className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
            >
              0413 626 240
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
