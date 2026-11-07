// Booking page for a summer program: signup form, then Stripe. Driven by the
// program's config. Reached from the program page's "Book now" buttons.
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import CampSignupForm from "../components/CampSignupForm"
import SubscribeForm from "../components/SubscribeForm"
import PillButton from "../components/PillButton"
import Placeholder, { SHOW_PLACEHOLDERS } from "../components/afterschool/Placeholder"
import NotFound from "./NotFound"
import { programs } from "../content/programs"
import { trackMetaEvent } from "../lib/metaPixel"

export default function ProgramBook() {
  const { program: programSlug } = useParams<{ program: string }>()
  const p = programSlug ? programs[programSlug] : undefined

  // Until a real Stripe Payment Link is in the config, nobody can be sent to
  // pay. Preview builds still show the form (with a warning) so it can be
  // reviewed; production shows a holding message instead.
  const stripeReady = Boolean(p && !p.stripeUrl.includes("PLACEHOLDER"))
  const showForm = stripeReady || SHOW_PLACEHOLDERS

  useEffect(() => {
    if (!p) return
    document.title = `Book Your Place — ${p.place} | Good Noise Project`
    const robots = document.createElement("meta")
    robots.name = "robots"
    robots.content = "noindex"
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [p])

  useEffect(() => {
    if (p && showForm) trackMetaEvent("InitiateCheckout")
  }, [p, showForm])

  if (!p) return <NotFound />

  if (!showForm) {
    return (
      <>
        <PageHero>
          <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            Bookings Open Soon
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Pop your email in and we'll let you know the moment bookings for {p.place} open.
          </p>
          <div className="mt-10">
            <SubscribeForm source={p.subscribeSource} variant="landing" submitLabel="Join the mailing list" />
          </div>
          <div className="mt-10">
            <PillButton href={p.path} variant="onBlue">
              Back to the program details
            </PillButton>
          </div>
        </PageHero>
        <Footer />
      </>
    )
  }

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Book Your Place
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Fill this out with your young person — a few details about them, a few about you, then
          through to payment.
        </p>

        {!stripeReady && (
          <Placeholder className="mt-6 max-w-xl">
            Stripe Payment Link not set — replace the placeholder URL in src/content/programs.ts.
            Production shows a "bookings open soon" page until this is done.
          </Placeholder>
        )}

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <CampSignupForm
            campLabel={p.campLabel}
            stripeUrl={p.stripeUrl}
            programName={p.name}
            cancellationHref={`${p.path}#cancellations`}
            daysLabel={p.daysWord}
          />

          <div className="border-2 border-ink bg-cream p-6 md:p-8">
            <span className="font-body text-xs font-bold uppercase tracking-wide text-ink/60">
              Order Summary
            </span>
            <p className="font-display mt-6 text-2xl uppercase leading-[0.98] text-terracotta sm:text-3xl">
              {p.name}
            </p>
            <p className="font-display mt-2 text-xl uppercase leading-[0.98] text-ink sm:text-2xl">
              {p.dates}
            </p>
            <p className="mt-2 font-body text-base text-ink/60">{p.time}</p>
            <p className="mt-1 whitespace-pre-line font-body text-sm text-ink/60">{p.venueLine}</p>

            <div className="mt-6 border-t border-ink/15 pt-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-body font-bold uppercase tracking-wide text-ink">
                  Total Cost
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-display bg-terracotta px-4 py-2 text-xl text-white">
                    ${p.priceDollars}.00
                  </span>
                  <span className="font-body text-xs text-ink/60">for both days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      <Footer />
    </>
  )
}
