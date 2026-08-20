import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { linkifyContact } from "../lib/linkifyEmail"
import { setPageMeta } from "../lib/pageMeta"

const linkClass =
  "font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
const calloutClass = "border-2 border-terracotta bg-terracotta/10 p-6"
const calloutTextClass = "text-base leading-relaxed text-ink/90 md:text-lg"

const collectedItems: { label: string; description: string; why: string }[] = [
  {
    label: "About the participant",
    description:
      "name, date of birth, address, preferred instrument, and how they're getting to and from the venue.",
    why: "to run the program, confirm eligibility, and know who's responsible for each young person at the start and end of each day.",
  },
  {
    label: "Emergency contacts",
    description: "names and phone numbers.",
    why: "so we can reach someone quickly if we need to.",
  },
  {
    label: "Health information",
    description: "allergies, medical conditions, medication carried, and any support needs.",
    why: "solely to keep your child safe and to make the two days work for them. This is sensitive information, we ask for your express consent to collect it, and it's seen only by Dave.",
  },
  {
    label: "Parent or guardian details",
    description: "name, email, phone, address.",
    why: "to communicate about the booking and to contact you during the program.",
  },
  {
    label: "Your consent choices",
    description:
      "what you and your child agreed to regarding photos, video, audio and the song recording.",
    why: "so we can honour them, and so we have a record of what was agreed.",
  },
]

const retentionRows: { label: string; value: ReactNode }[] = [
  { label: "Health and medical information", value: "Deleted 30 days after the workshop ends" },
  { label: "Booking and contact details", value: "2 years, then deleted" },
  { label: "Consent records", value: "3 years, matching the life of the consent" },
  {
    label: "Photos, video and audio",
    value: (
      <>
        While consent is current — see our{" "}
        <Link to="/photography-policy" className={linkClass}>
          Photography Policy
        </Link>
      </>
    ),
  },
]

export default function Privacy() {
  useEffect(() => {
    setPageMeta(
      "Privacy Collection Notice — Good Noise Project",
      "What personal information Good Noise Project collects when you book a workshop, why we collect it, who sees it, and how to access, correct or delete it.",
    )
  }, [])

  return (
    <>
      <div className="bg-brand">
        <Header />
      </div>

      <section className="bg-cream">
        <div className="mx-auto max-w-[840px] px-5 py-16 md:px-10 md:py-24">
          <h1 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
            Privacy Collection Notice
          </h1>
          <p className="mt-4 font-body text-sm text-ink/60">
            Last updated: 20 August 2026 · Next review: 20 August 2027
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-ink/80 md:text-lg">
            <div className="space-y-3">
              <p>
                Good Noise Project (ABN 15 933 602 313) is run by Dave
                Sonntag in Perth, Western Australia. This notice explains
                what personal information we collect when you book a
                workshop, why we collect it, and what we do with it.
              </p>
              <p>{linkifyContact("Questions: dave@goodnoiseproject.com.au or 0413 626 240.")}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Where we stand legally
              </h2>
              <div className="mt-4">
                <div className={calloutClass}>
                  <p className={calloutTextClass}>
                    <strong className="text-ink">
                      As a small business we're not bound by the Privacy Act
                      1988. We follow the Australian Privacy Principles
                      anyway,
                    </strong>{" "}
                    because we work with young people and we think you're
                    entitled to the same standard you'd get from a larger
                    organisation.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                What we collect and why
              </h2>
              <div className="mt-4 space-y-5">
                {collectedItems.map((item) => (
                  <div key={item.label}>
                    <p>
                      <strong className="font-semibold text-ink">{item.label}</strong> —{" "}
                      {item.description}
                    </p>
                    <p className="mt-1 text-sm text-ink/70">
                      <em>Why:</em> {item.why}
                    </p>
                  </div>
                ))}
                <p>
                  <strong className="font-semibold text-ink">Payment</strong> — handled
                  entirely by Stripe. We never see or store your card
                  details.
                </p>
                <p>
                  We only collect what we need to run the program safely. We
                  don't collect anything for advertising or profiling.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Who else sees it</h2>
              <div className="mt-4 space-y-3">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-ink">Stripe</strong> processes
                    payments. We don't hold card details.
                  </li>
                  <li>
                    <strong className="font-semibold text-ink">Netlify</strong> hosts our
                    website and stores form submissions.
                  </li>
                  <li>
                    <strong className="font-semibold text-ink">Our email provider</strong>{" "}
                    carries our correspondence with you.
                  </li>
                </ul>
                <p>
                  That's it. We don't sell your information, share it with
                  marketing companies, or pass it to anyone else — except
                  where we're required by law to do so, or where there's a
                  serious and immediate risk to someone's safety.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                How we look after it
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  Booking information is held in our website's form system,
                  protected by a password only Dave has access to. Anything
                  downloaded is kept on a password-protected device in a
                  folder used only for Good Noise Project.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                How long we keep it
              </h2>
              <div className="mt-4 space-y-4">
                <div className="border-2 border-ink bg-cream">
                  {retentionRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 ${
                        i === retentionRows.length - 1 ? "" : "border-b border-ink/15"
                      }`}
                    >
                      <span className="font-body text-sm font-semibold text-ink/70">
                        {row.label}
                      </span>
                      <span className="font-body text-sm font-semibold text-ink sm:text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p>
                  If you join our mailing list, that's a separate thing you
                  opt into, and you can unsubscribe from any email we send.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Seeing, changing or deleting your information
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  {linkifyContact(
                    "You can ask us at any time to show you what we hold about you or your child, correct anything that's wrong, or delete it. Email dave@goodnoiseproject.com.au. We'll respond within 30 days, and there's no charge.",
                  )}
                </p>
                <p>
                  Deleting your information may mean we can't complete a
                  booking — we'll tell you if that's the case before we act.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Complaints</h2>
              <div className="mt-4 space-y-3">
                <p>
                  {linkifyContact(
                    "If you think we've mishandled your information, contact Dave Sonntag at dave@goodnoiseproject.com.au or 0413 626 240. We'll acknowledge within five business days and aim to resolve it within 30.",
                  )}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Website</h2>
              <div className="mt-4 space-y-3">
                <p>
                  Our website uses only what's needed to make it work and to
                  understand basic traffic patterns. We don't run
                  advertising trackers and we don't build profiles of
                  visitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
