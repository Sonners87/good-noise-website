import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Placeholder, { SHOW_PLACEHOLDERS } from "../components/afterschool/Placeholder"

const linkClass =
  "font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"

export default function ChildSafetyPolicy() {
  useEffect(() => {
    document.title = "Child Safety Policy — Good Noise Project"
  }, [])

  return (
    <>
      <div className="bg-brand">
        <Header />
      </div>

      <section className="bg-cream">
        <div className="mx-auto max-w-[840px] px-5 py-16 md:px-10 md:py-24">
          <h1 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
            Child Safety Policy
          </h1>
          <p className="mt-4 font-body text-sm text-ink/60">
            Last updated: 19 October 2026 · Next review: 19 October 2027
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-ink/80 md:text-lg">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">1. Introduction</h2>
              <div className="mt-4 space-y-3">
                <p>
                  1.1 Good Noise Project ("we", "us") is committed to
                  protecting the rights, safety and wellbeing of all children
                  and young people who participate in our programs and
                  workshops.
                </p>
                <p>
                  1.2 Good Noise Project is a Perth-based youth music program run
                  by Dave Sonntag, and a small team where required,
                  delivering songwriting and music workshops to young people
                  in Western Australia.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">2. Purpose</h2>
              <div className="mt-4 space-y-3">
                <p>
                  2.1 This policy sets out our commitment to the safety and
                  wellbeing of children and young people who take part in
                  Good Noise Project programs, and explains how we work to keep them
                  safe.
                </p>
                <p>2.2 This policy seeks to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    demonstrate our ongoing commitment to the safety and
                    wellbeing of children and young people involved in our
                    programs;
                  </li>
                  <li>
                    create an environment where children, young people and
                    their families feel confident raising any concern with
                    us;
                  </li>
                  <li>
                    maintain physical and online environments that are safe
                    for children and young people; and
                  </li>
                  <li>
                    ensure that any suspected abuse, allegation, safety
                    concern or disclosure is taken seriously and responded to
                    appropriately.
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                3. Our Commitment
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  3.1 For the purpose of this policy, a child or young person
                  is any person under the age of 18 years.
                </p>
                <p>
                  3.2 This policy applies to all Good Noise Project programs and
                  workshops, and to everyone who works with participants in
                  them, including Dave Sonntag and any other facilitators or
                  volunteers.
                </p>
                <p>
                  3.3 All children and young people who participate in Good
                  Noise programs have a right to feel safe, respected and
                  included, regardless of their background, ability or
                  identity.
                </p>
                <p>
                  3.4 We have zero tolerance for abuse of children or young
                  people. Any allegation or safety concern will be treated
                  extremely seriously and, where required, reported to the
                  appropriate authorities.
                </p>
                <p className="font-bold text-ink">
                  If you believe a child or young person is in immediate
                  danger, call 000.
                </p>
                <p>
                  3.5 We do not tolerate bullying, discrimination, or any
                  other conduct that puts the health, safety or wellbeing of
                  a child or young person at risk.
                </p>
                <p>
                  3.6 Good Noise Project follows the National Principles for
                  Child Safe Organisations.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                4. Facilitator Suitability
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  4.1 Good Noise Project programs are run by Dave Sonntag, and a
                  small team where required. Dave holds a current Working
                  with Children Check (WWCC), renewed in line with WA
                  requirements.
                </p>
                <p>
                  4.2 Any other facilitator or volunteer working with
                  participants must:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    hold a current WA Working with Children Check before
                    working with participants;
                  </li>
                  <li>
                    be briefed on this policy and our Photography, Filming
                    and Recording Policy before their first session{SHOW_PLACEHOLDERS ? ";" : "."}
                  </li>
                  {SHOW_PLACEHOLDERS && (
                    <li>
                      <Placeholder inline>any other screening, e.g. a referee check</Placeholder>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                5. Reporting Responsibilities
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  5.1 If Dave becomes aware of, or has reasonable grounds to
                  suspect, abuse or a risk to a child or young person's
                  safety, this will be reported in line with Western
                  Australia's <em>Children and Community Services Act 2004</em>{" "}
                  and to the appropriate WA authorities, which may include WA
                  Police and/or the Department of Communities (Child
                  Protection and Family Support).
                </p>
                <p>
                  5.2 Where a program is delivered at a school or another
                  organisation's premises, any concern will also be raised
                  with the nominated wellbeing contact or youth officer,
                  alongside our mandatory reporting obligations, where
                  appropriate.
                </p>
                <p>
                  5.3 Where there is an immediate threat to a child or young
                  person's safety, police will be contacted first, ahead of
                  any other reporting step.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                6. Programs Run With a School, Council or Organisation
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  6.1 Before a program starts, we agree a nominated wellbeing
                  contact or youth officer with the host.
                </p>
                <p>
                  6.2 Concerns and disclosures go to that contact, alongside
                  our mandatory reporting obligations under section 5.
                </p>
                <p>
                  6.3 When we run a program without host staff in the room,
                  we use sign-in and sign-out, agreed pick-up arrangements
                  and an emergency plan for the venue.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                7. Risk Management
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  7.1 Good Noise Project takes reasonable steps to identify and
                  reduce risks to children and young people participating in
                  our programs, across both our physical and online
                  environments.
                </p>
                <p className="font-bold text-ink">Physical environment</p>
                <p>
                  7.2 Workshops are run in a supervised, appropriate venue
                  for the size and age of the group, with clear visibility
                  throughout the space. Mentoring and small-group work
                  happens in open, visible spaces, with no one-on-one time
                  out of sight.
                </p>
                <p className="font-bold text-ink">Online environment</p>
                <p>
                  7.3 Where any online or digital communication is needed
                  with a participant, this is directed through a parent or
                  guardian wherever possible. Good Noise Project does not
                  communicate privately with a child or young person outside
                  of appropriate, parent/guardian-included channels.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                8. Privacy and Confidentiality
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  8.1 Personal information collected about children and
                  young people (including through our intake process) is
                  used only to plan and safely run Good Noise Project programs, and
                  is kept confidential.
                </p>
                <p>
                  8.2 This information is not shared beyond what's necessary
                  to deliver a program safely, or as required by law.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                9. Raising a Concern
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  9.1 If you have a concern about the safety or wellbeing of
                  a child or young person in connection with Good Noise Project,
                  please{" "}
                  <Link to="/contact" className={linkClass}>
                    contact us
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                10. Policy Review
              </h2>
              <div className="mt-4 space-y-3">
                <p>
                  10.1 This policy is reviewed periodically to make sure it
                  stays current and continues to reflect good practice.
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
