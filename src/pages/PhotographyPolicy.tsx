import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { linkifyContact } from "../lib/linkifyEmail"
import { setPageMeta } from "../lib/pageMeta"

const calloutClass = "border-2 border-terracotta bg-terracotta/10 p-6"
const calloutTextClass = "text-base leading-relaxed text-ink/90 md:text-lg"

export default function PhotographyPolicy() {
  useEffect(() => {
    setPageMeta(
      "Photography, Filming and Recording Policy — Good Noise Project",
      "What Good Noise Project photographs and records at workshops, how consent works, how images are stored, and how to withdraw permission at any time.",
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
            Photography, Filming and Recording Policy
          </h1>
          <p className="mt-4 font-body text-sm text-ink/60">
            Last updated: 2 September 2026 · Next review: 2 September 2027
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-ink/80 md:text-lg">
            <div className="space-y-3">
              <p>
                Good Noise Project takes photos and video at our workshops.
                This page explains exactly what we capture, what we do with
                it, how we look after it, and how you can change your mind
                at any time.
              </p>
              <p>
                {linkifyContact(
                  "If you'd rather ask a person than read a policy, email Dave at dave@goodnoiseproject.com.au or call 0413 626 240.",
                )}
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Why we do it</h2>
              <div className="mt-4 space-y-3">
                <p>
                  We use photos and video to show families and schools what
                  actually happens in a Good Noise Project room — on our website, on
                  our social media, and in presentations to schools, councils
                  and funders when we're seeking support for future
                  programs.
                </p>
                <p>
                  That's the whole list. We use this material for promoting
                  Good Noise Project and nothing else.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">What we capture</h2>
              <div className="mt-4 space-y-3">
                <p>During a workshop we may take:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Photos of participants playing, writing and working together</li>
                  <li>
                    Photos where nobody is identifiable — hands on
                    instruments, a lyric sheet, a wide shot of the room,
                    people from behind
                  </li>
                  <li>Short video of the group working, and of the song being performed at the end</li>
                  <li>Audio recordings of the song the group writes</li>
                </ul>
                <p>
                  Some of this is also for the participants themselves.
                  Every group receives a recording of the song they write,
                  whether or not their family has agreed to us using any of
                  it.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Consent: how it works
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  <strong className="font-semibold text-ink">
                    Nothing is used without permission.
                  </strong>
                </p>
                <p>
                  Photo and video consent is part of the parent/guardian
                  consent you give as part of our booking terms and
                  conditions — it isn't a separate tick-box. Agreeing to it
                  is one of the steps needed to complete a booking, alongside
                  the rest of the registration form.
                </p>

                <div className={calloutClass}>
                  <p className={calloutTextClass}>
                    <strong className="text-ink">
                      Want a different arrangement?
                    </strong>{" "}
                    {linkifyContact(
                      "If you'd rather your child wasn't included in any marketing material, contact Dave before you book at dave@goodnoiseproject.com.au and we'll sort it out — it won't affect your child's place.",
                    )}
                  </p>
                </div>

                <div className={calloutClass}>
                  <p className={calloutTextClass}>
                    <strong className="text-ink">Your child gets their own say.</strong> We
                    ask the young person directly on the day. If a parent
                    has agreed and the young person doesn't want to be
                    photographed,{" "}
                    <strong className="text-ink">
                      the young person's answer is the one we follow.
                    </strong>{" "}
                    Australian privacy guidance treats most young people
                    aged 15 and over as able to make this decision for
                    themselves, and we think it's the right thing to do
                    regardless of age.
                  </p>
                </div>

                <p>
                  <strong className="font-semibold text-ink">Consent expires.</strong> We
                  treat every permission as lapsing three years after the
                  workshop. We don't rely on anyone agreeing to something
                  permanent. If we want to keep using material beyond that,
                  we ask again.
                </p>
                <p>
                  <strong className="font-semibold text-ink">On the day.</strong> Before we
                  start, we tell participants there'll be a camera around
                  and that anyone can step out of a shot at any moment — no
                  reason needed, no questions asked. Whoever is taking
                  photos is briefed on any arrangement made directly with a
                  family.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Who takes the photos
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  Photos and video are taken by Dave Sonntag, or
                  occasionally by someone he's engaged for the day. Anyone
                  taking photos on our behalf:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>is briefed on this policy before the workshop starts</li>
                  <li>is briefed on any opt-out arrangement agreed directly with a family</li>
                  <li>
                    holds a current Working With Children Check if they'll
                    be present with participants
                  </li>
                  <li>hands over all material at the end and keeps no copies</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">How we store it</h2>
              <div className="mt-4 space-y-3">
                <p>Photos, video and audio from our workshops are:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    transferred as soon as possible to a single dedicated
                    device, into a password-protected folder used only for
                    Good Noise Project material
                  </li>
                  <li>
                    kept separate from personal devices, personal photo
                    libraries and personal cloud backups
                  </li>
                  <li>deleted from cameras, phones and memory cards once transferred</li>
                  <li>accessible only to Dave Sonntag</li>
                </ul>
                <p>
                  Files are named and filed by workshop so we can find and
                  remove an individual's material quickly if we're asked to.
                </p>
                <p>
                  We keep material only while consent for it is current. At
                  the three-year mark it's either deleted or we seek fresh
                  permission.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">What we never do</h2>
              <div className="mt-4 space-y-3">
                <ul className="list-disc space-y-2 pl-6">
                  <li>Sell images, video or audio, or licence them to anyone else</li>
                  <li>Use them to advertise another organisation or product</li>
                  <li>Publish a participant's surname, school, suburb or contact details</li>
                  <li>
                    Publish location data — geotagging is off and we don't
                    identify where a participant lives or studies
                  </li>
                  <li>
                    Publish anything featuring a participant whose family or
                    who themselves declined
                  </li>
                  <li>Use anything for a purpose the person didn't agree to</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Changing your mind</h2>
              <div className="mt-4 space-y-3">
                <div className={calloutClass}>
                  <p className={calloutTextClass}>
                    <strong className="text-ink">
                      You can withdraw or change your permission at any
                      time, for any reason, and you don't have to explain.
                    </strong>{" "}
                    {linkifyContact("Email dave@goodnoiseproject.com.au or call 0413 626 240.")}
                  </p>
                </div>
                <p>
                  We'll stop using the material and remove it from anything
                  we control — our website, our social media, our
                  presentation decks — within seven days, and confirm to you
                  when it's done.
                </p>
                <p>
                  One honest limitation: we can't recall material that's
                  already been printed and distributed, or that someone else
                  has already downloaded or reshared. We'll remove it from
                  everything within our control and stop all future use.
                </p>
                <p>Participants can ask us directly, without going through a parent.</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Photos taken by other people
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  Other participants and their families may take their own
                  photos at our workshops. We ask everyone not to photograph
                  or post images of other people's children, and we say so
                  at the start of every program. We can't guarantee it, and
                  it's worth being aware of.
                </p>
                <p>
                  If something involving your child is posted by another
                  family and you'd like help with it, tell us and we'll do
                  what we can.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Concerns or complaints
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  {linkifyContact(
                    "If you're unhappy with how we've handled photos, video or audio of your child, contact Dave Sonntag at dave@goodnoiseproject.com.au or 0413 626 240. We'll respond within five business days and work with you until it's sorted.",
                  )}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">Our commitments</h2>
              <div className="mt-4 space-y-3">
                <p>
                  Good Noise Project voluntarily follows the National
                  Principles for Child Safe Organisations. Dave Sonntag
                  holds a current Working With Children Check (WWC 561262)
                  and is SafeTALK trained.
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
