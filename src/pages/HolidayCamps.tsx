// Standalone landing page for the spring school holiday camps — built to
// receive cold traffic from a QR code on printed flyers, so it assumes zero
// prior context and isn't linked from the site's primary navigation. Several
// sections deliberately reuse homepage components/copy word-for-word per the
// brief, rather than duplicating that content by hand.
import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import Eyebrow from "../components/Eyebrow"
import PhotoImage from "../components/PhotoImage"
import Facilitator from "../components/Facilitator"
import WhyWeExist from "../components/WhyWeExist"
import FounderQuote from "../components/FounderQuote"
import Footer from "../components/Footer"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "../components/PillButton"
import logo from "../assets/logo/good-noise-logo.png"
import heroSunsetFriends from "../assets/images/hero-sunset-friends.webp"
import heroBandPractice from "../assets/images/hero-band-practice.webp"
import workshopBandTrio from "../assets/images/workshop-band-trio.webp"

// "sage" is a page-specific button treatment for the Ages 11–14 camp — not
// part of the shared PillButton variant set, since it's only needed here to
// carry this page's two-camp color coding through to the CTAs.
const variantStyles = {
  ...pillVariantStyles,
  sage: "bg-sage text-ink border-sage hover:bg-white hover:text-ink hover:border-ink",
}

// Both "Book Now" and "Explore" CTAs route to each camp's workshop detail
// page (booking itself happens from there). Not using the shared
// PillButton since it doesn't have the page-local "sage" variant.
function CampButton({
  href,
  variant,
  sizeClassName = pillSizeStyles.md,
  className = "",
  children,
}: {
  href: string
  variant: keyof typeof variantStyles
  sizeClassName?: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      to={href}
      className={`${pillBaseStyles} ${sizeClassName} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
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
        <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10 md:pt-8">
          <Link to="/" className="mx-auto block w-fit">
            <img src={logo} alt="Good Noise" className="h-14 w-auto md:h-16" />
          </Link>
          <p className="font-body font-bold mx-auto mt-3 max-w-[19rem] text-center text-sm text-white md:text-base">
            Two-day songwriting camps in North Perth, for two different age
            groups.
          </p>
        </div>

        <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-6">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
            {/* Left column: copy + CTAs. Order utilities put the CTA row
                right after the headline on mobile (above the fold), but
                after the subheadline on desktop, where there's more room.
                Centered as a block on mobile; left-aligned on desktop next
                to the image. */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <Eyebrow tone="onBlue" className="order-1 w-fit">
                September 2026: Youth songwriting camps
              </Eyebrow>

              <h1 className="font-display order-2 mt-3 text-5xl leading-[1.05] text-white md:text-6xl">
                Two Days. One Original Song.
              </h1>

              <h2 className="font-display order-2 mt-4 text-xl leading-snug text-white/90 md:text-2xl">
                Making music together breaks down social barriers faster than
                almost any other shared activity
                <sup className="text-sm font-normal md:text-base">1</sup>.
              </h2>

              <div className="order-3 mt-6 grid grid-cols-2 gap-4 md:order-4 md:flex md:flex-wrap md:items-start md:gap-x-10 md:gap-y-6 md:mt-5">
                <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                  <span className="font-display text-xl font-bold text-sage md:text-2xl">
                    Ages 11–14
                  </span>
                  <CampButton
                    href="/workshops/songwriting-oct-2026"
                    variant="sage"
                    sizeClassName="px-7 py-3.5 text-base md:px-9 md:py-4 md:text-lg"
                  >
                    Book Now
                  </CampButton>
                  <span className="font-body font-semibold text-xs text-white/70">
                    Full refunds available
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                  <span className="font-display text-xl font-bold text-terracotta md:text-2xl">
                    Ages 15–18
                  </span>
                  <CampButton
                    href="/workshops/songwriting-sep-2026"
                    variant="primary"
                    sizeClassName="px-7 py-3.5 text-base md:px-9 md:py-4 md:text-lg"
                  >
                    Book Now
                  </CampButton>
                  <span className="font-body font-semibold text-xs text-white/70">
                    Full refunds available
                  </span>
                </div>
              </div>

              <p className="order-4 mt-8 text-base leading-relaxed text-white/85 md:order-3 md:mt-5 md:text-lg">
                This September school holidays, Good Noise Project brings
                kids together to make music — and make friends faster than
                almost anything else can.
              </p>
            </div>

            {/* Right column: placeholder image — offset down so its top
                lines up with the headline, not the kicker above it. */}
            <PhotoImage
              src={heroSunsetFriends}
              alt="A group of young musicians laughing together outdoors at sunset, one holding an acoustic guitar"
              aspect="aspect-[4/3]"
              objectPosition="center 45%"
              className="border-2 border-white/15 md:mt-14"
            />
          </div>

          {/* Citation for the headline's claim — deliberately centered and
              pushed below the typical fold (still within this section's
              green background), rather than competing with the CTAs above. */}
          <p className="mx-auto mt-16 max-w-2xl text-center text-xs text-white/50 md:mt-24">
            1. Pearce, E., Launay, J., &amp; Dunbar, R.I.M. (2015). "The
            ice-breaker effect: singing mediates fast social bonding." Royal
            Society Open Science, 2(10), 150221. University of Oxford,
            Department of Experimental Psychology.
          </p>
        </div>
      </section>

      {/* Two camps */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col overflow-hidden border-2 border-sage shadow-[6px_6px_0_0_var(--gn-ink)]">
              <div className="relative">
                <PhotoImage
                  src={heroBandPractice}
                  alt="Two young musicians at band practice, one playing electric guitar and singing into a microphone"
                  aspect="aspect-[16/9]"
                  objectPosition="center 55%"
                />
                <div
                  className="absolute inset-0 bg-sage/60 mix-blend-color"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-1 flex-col bg-sage/20 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body font-bold inline-block w-fit bg-sage px-4 py-1.5 text-sm uppercase tracking-wide text-ink">
                    Ages 11–14
                  </span>
                  <span className="font-body font-bold inline-block w-fit bg-sage px-4 py-1.5 text-sm uppercase tracking-wide text-ink">
                    Two-Day Songwriting Camp
                  </span>
                </div>
                <h2 className="font-display mt-4 text-3xl leading-[1.02] text-ink sm:text-4xl">
                  Music They'll Carry Home With Them.
                </h2>
                <p className="mt-5 flex-1 text-base leading-relaxed text-ink/80 md:text-lg">
                  A room full of instruments, and other kids who love music
                  just as much as they do. This could be the start of
                  something they carry with them for years.
                </p>
                <CampButton
                  href="/workshops/songwriting-oct-2026"
                  variant="sage"
                  className="mt-8 self-start"
                >
                  Explore Ages 11–14 Camp &rarr;
                </CampButton>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden border-2 border-terracotta shadow-[6px_6px_0_0_var(--gn-ink)]">
              <div className="relative">
                <PhotoImage
                  src={workshopBandTrio}
                  alt="Three young musicians performing together, two playing guitar and one singing into a microphone"
                  aspect="aspect-[16/9]"
                />
                <div
                  className="absolute inset-0 bg-terracotta/50 mix-blend-color"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-1 flex-col bg-terracotta/10 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body font-bold inline-block w-fit bg-terracotta px-4 py-1.5 text-sm uppercase tracking-wide text-white">
                    Ages 15–18
                  </span>
                  <span className="font-body font-bold inline-block w-fit bg-terracotta px-4 py-1.5 text-sm uppercase tracking-wide text-white">
                    Two-Day Songwriting Camp
                  </span>
                </div>
                <h2 className="font-display mt-4 text-3xl leading-[1.02] text-ink sm:text-4xl">
                  Find Your People. Maybe Even Your First Band.
                </h2>
                <p className="mt-5 flex-1 text-base leading-relaxed text-ink/80 md:text-lg">
                  Two days. One song, written and performed with musos
                  they've never met. No pressure to be great — just to play,
                  and maybe do something they've never done before.
                </p>
                <CampButton
                  href="/workshops/songwriting-sep-2026"
                  variant="primary"
                  className="mt-8 self-start"
                >
                  Explore Ages 15–18 Camp &rarr;
                </CampButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reused word-for-word from the homepage, including its image */}
      <WhyWeExist />

      {/* In Dave's words */}
      <FounderQuote />

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
