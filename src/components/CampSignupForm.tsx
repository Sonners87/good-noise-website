import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { pillBaseStyles, pillSizeStyles } from "./PillButton"
import { submitNetlifyFormFields } from "../lib/submitNetlifyForm"
import RadioPillGroup from "./form/RadioPillGroup"
import ConsentCheckbox from "./form/ConsentCheckbox"
import ConditionalReveal from "./form/ConditionalReveal"

const inputClass =
  "border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
const labelClass = "font-body font-semibold text-xs tracking-wide text-ink/70"
const sectionHeadingClass =
  "font-body font-bold text-base md:text-lg uppercase tracking-wide text-ink"
const noteClass = "text-sm leading-relaxed text-ink/70"
const linkClass = "underline decoration-2 underline-offset-4 hover:text-terracotta"
// The card is cream (light), so buttons need to be their own dark variant
// rather than reusing PillButton's terracotta "primary" — that would blend
// straight into the background.
const submitButtonClass =
  "bg-ink text-white border-ink hover:bg-white hover:text-ink hover:border-ink"

const yesNoOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
]

const travelOptions = [
  { value: "independent", label: "They'll travel independently" },
  {
    value: "parent",
    label: "They'll be dropped off and collected by the parent/guardian below",
  },
  { value: "other", label: "They'll be collected by someone else" },
]

const todayISODate = new Date().toISOString().slice(0, 10)

type CampSignupFormProps = {
  campLabel: string
  stripeUrl: string
}

// Collects participant/parent details, child-safety and media/song consent,
// screens for additional support needs, and either sends buyers on to
// Stripe to pay or (if screening flags something) holds the booking for a
// manual follow-up first. The Netlify submission and the Stripe redirect
// are two separate steps, so a failed submission never sends someone to pay
// without us having their details on file.
//
// The parent/guardian consent fields (and the health-info consent
// checkbox) gate the Stripe redirect the same way the old consent
// checkboxes did — via native HTML `required`, not custom JS logic. The
// support-needs screen is the only thing that diverts the flow instead of
// blocking it.
export default function CampSignupForm({ campLabel, stripeUrl }: CampSignupFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [participantAddress, setParticipantAddress] = useState("")
  const [sameAddress, setSameAddress] = useState(true)
  const [parentAddressManual, setParentAddressManual] = useState("")

  const [travelMethod, setTravelMethod] = useState("")

  const [allergies, setAllergies] = useState("")
  const [medication, setMedication] = useState("")
  const [supportNeeds, setSupportNeeds] = useState<"yes" | "no" | "">("")
  const healthDisclosed = allergies === "yes" || medication === "yes" || supportNeeds === "yes"

  const [healthInfoConsent, setHealthInfoConsent] = useState(false)

  const [flagged, setFlagged] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const fields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      fields[key] = String(value)
    }

    try {
      await submitNetlifyFormFields(fields)

      if (supportNeeds === "yes") {
        // Separate Netlify form/submission (rather than a flag on the main
        // one) so a distinct email notification can be configured for it in
        // the Netlify dashboard — the parent gets flagged for follow-up
        // without triggering an email on every ordinary booking.
        await submitNetlifyFormFields({
          "form-name": "support-needs-flag",
          camp: campLabel,
          participantName:
            `${formData.get("firstName") ?? ""} ${formData.get("lastName") ?? ""}`.trim(),
          parentName:
            `${formData.get("parentFirstName") ?? ""} ${formData.get("parentLastName") ?? ""}`.trim(),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          details: String(formData.get("supportNeedsDetails") ?? ""),
        })
        setFlagged(true)
        setSubmitting(false)
      } else {
        window.location.href = stripeUrl
      }
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  if (flagged) {
    return (
      <div className="border-2 border-ink bg-cream p-6 md:p-8">
        <p className="font-body font-bold text-lg text-ink">
          Thanks — I'll be in touch within 24 hours to make sure this is a
          great fit before booking is finalised.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="camp-signup"
      data-netlify="true"
      className="grid grid-cols-1 gap-6 border-2 border-ink bg-cream p-6 md:p-8"
    >
      <input type="hidden" name="form-name" value="camp-signup" />
      <input type="hidden" name="camp" value={campLabel} />

      {/* 1. MUSICIAN INFO */}
      <div className="grid grid-cols-1 gap-5">
        <span className={sectionHeadingClass}>Musician info</span>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>First name</span>
            <input
              required
              type="text"
              name="firstName"
              autoComplete="given-name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Last name</span>
            <input
              required
              type="text"
              name="lastName"
              autoComplete="family-name"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Birthday</span>
          <input
            required
            type="date"
            name="birthday"
            autoComplete="bday"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Address</span>
          <input
            required
            type="text"
            name="participantAddress"
            autoComplete="street-address"
            className={inputClass}
            value={participantAddress}
            onChange={(e) => setParticipantAddress(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Preferred instrument</span>
          <input
            required
            type="text"
            name="instrument"
            className={inputClass}
            placeholder="e.g. vocals, guitar, saxophone"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Years playing that instrument</span>
          <input
            required
            type="number"
            name="yearsPlaying"
            min={0}
            step={1}
            inputMode="numeric"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Emergency contact name</span>
            <input
              required
              type="text"
              name="emergencyContactName"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Emergency contact number</span>
            <input
              required
              type="tel"
              name="emergencyContactPhone"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Second emergency contact name</span>
            <input
              required
              type="text"
              name="emergencyContactName2"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Second emergency contact number</span>
            <input
              required
              type="tel"
              name="emergencyContactPhone2"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <span className={labelClass}>Getting to and from the venue</span>
          <RadioPillGroup
            name="travelMethod"
            options={travelOptions}
            value={travelMethod}
            onChange={setTravelMethod}
          />
          <ConditionalReveal show={travelMethod === "other"}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Collector's name</span>
                <input
                  required
                  type="text"
                  name="travelCollectorName"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Collector's phone</span>
                <input
                  required
                  type="tel"
                  name="travelCollectorPhone"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputClass}
                />
              </label>
            </div>
          </ConditionalReveal>
        </div>
      </div>

      {/* 2. HEALTH & SUPPORT */}
      <div className="grid grid-cols-1 gap-6 border-t-2 border-ink/15 pt-6">
        <span className={sectionHeadingClass}>Health &amp; support</span>

        <div className="grid grid-cols-1 gap-3">
          <span className={labelClass}>
            Does your child have any allergies or medical conditions we should
            know about?
          </span>
          <RadioPillGroup
            name="allergies"
            options={yesNoOptions}
            value={allergies}
            onChange={setAllergies}
            columnsClassName="sm:grid-cols-2"
          />
          <ConditionalReveal show={allergies === "yes"}>
            <textarea
              required
              name="allergiesDetails"
              rows={3}
              className={inputClass}
            />
          </ConditionalReveal>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <span className={labelClass}>
            Will they be carrying any medication (inhaler, EpiPen, other)?
          </span>
          <RadioPillGroup
            name="medication"
            options={yesNoOptions}
            value={medication}
            onChange={setMedication}
            columnsClassName="sm:grid-cols-2"
          />
          <ConditionalReveal show={medication === "yes"}>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>
                What it is, where it's kept, and when it's used
              </span>
              <textarea
                required
                name="medicationDetails"
                rows={3}
                className={inputClass}
              />
            </label>
          </ConditionalReveal>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <span className={labelClass}>
            Any support needs — sensory, learning, behavioural, or anything
            else that would help us make the two days work for them?
          </span>
          <RadioPillGroup
            name="supportNeeds"
            options={yesNoOptions}
            value={supportNeeds}
            onChange={(value) => setSupportNeeds(value as "yes" | "no")}
            columnsClassName="sm:grid-cols-2"
          />
          <ConditionalReveal show={supportNeeds === "yes"}>
            <textarea
              required
              name="supportNeedsDetails"
              rows={3}
              className={inputClass}
              placeholder="What should we know, and how can we best support them?"
            />
          </ConditionalReveal>
        </div>

        <p className={noteClass}>
          This is sensitive information. We collect it only to keep your
          child safe during the program, we don't share it with anyone
          outside Good Noise Project, and we delete it 30 days after the
          workshop ends.
        </p>

        <ConsentCheckbox
          name="healthInfoConsent"
          checked={healthInfoConsent}
          onChange={setHealthInfoConsent}
          required={healthDisclosed}
          title="I consent to Good Noise Project collecting this health information for the purpose of my child's safety during the program."
        />
      </div>

      {/* 3. PARENT INFO */}
      <div className="grid grid-cols-1 gap-5 border-t-2 border-ink/15 pt-6">
        <span className={sectionHeadingClass}>Parent info</span>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Parent first name</span>
            <input
              required
              type="text"
              name="parentFirstName"
              autoComplete="given-name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Parent last name</span>
            <input
              required
              type="text"
              name="parentLastName"
              autoComplete="family-name"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email</span>
          <input
            required
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Phone</span>
          <input
            required
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-3">
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 accent-ink"
              checked={sameAddress}
              onChange={(e) => setSameAddress(e.target.checked)}
            />
            <span className={labelClass}>Same as musician address</span>
          </label>

          {sameAddress ? (
            <input type="hidden" name="parentAddress" value={participantAddress} />
          ) : (
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Address</span>
              <input
                required
                type="text"
                name="parentAddress"
                autoComplete="street-address"
                className={inputClass}
                value={parentAddressManual}
                onChange={(e) => setParentAddressManual(e.target.value)}
              />
            </label>
          )}
        </div>
      </div>

      {/* 4. PARENT/GUARDIAN CONSENT — TERMS AND CONDITIONS */}
      <div className="grid grid-cols-1 gap-5 border-t-2 border-ink/15 pt-6">
        <span className={sectionHeadingClass}>
          Parent/Guardian Consent - Terms and Conditions
        </span>

        <div className="grid grid-cols-1 gap-3">
          <p className={noteClass}>
            I declare that I have read the information regarding Good Noise
            Project's 2026 Spring Holidays Jam Program and have accurately
            completed the registration form, including medical information.
          </p>

          <p className="font-body font-bold text-sm uppercase tracking-wide text-ink">
            Participation
          </p>
          <p className={noteClass}>
            I am aware that my child / children can freely elect to
            participate in Good Noise Project's 2026 Spring Holidays Jam
            Program activities and that any risk is voluntary.
          </p>

          <p className="font-body font-bold text-sm uppercase tracking-wide text-ink">
            Health authorisation
          </p>
          <p className={noteClass}>
            In the event of accident or illness, I authorise Good Noise
            Project to arrange medical treatment and emergency evacuation
            services, as the event organisers deem necessary, for my child's
            safety and well-being.
          </p>
          <p className={noteClass}>
            I authorise Good Noise Project to consent, where it is
            impractical to communicate with me, for my child to receive an
            x-ray, surgical or hospital treatment as may be deemed necessary
            by a licensed physician and/or surgeon. In the case of an
            emergency if Good Noise Project is required to engage in such
            treatment, I understand that I am responsible for any medical
            costs that may be required.
          </p>

          <p className="font-body font-bold text-sm uppercase tracking-wide text-ink">
            Property
          </p>
          <p className={noteClass}>
            I understand that Good Noise Project take no responsibility for
            my child's property.
          </p>

          <p className="font-body font-bold text-sm uppercase tracking-wide text-ink">
            Photo consent
          </p>
          <p className={noteClass}>
            I understand there is often a photographer or videographer
            present at Good Noise Project programs and events and that these
            photos and videos may be used for Good Noise Project marketing
            and media purposes only (for example on the Good Noise Project
            website goodnoiseproject.com.au).
          </p>
          <p className={noteClass}>
            I hereby consent to the use of any photographs or videos of my
            child / children taken on behalf of Good Noise Project for
            marketing and media purposes.
          </p>
        </div>

        <p className={noteClass}>
          See our{" "}
          <Link
            to="/workshops/2026-spring-holidays#cancellations"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Cancellation and Refund Policy
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className={linkClass}>
            Privacy Collection Notice
          </Link>
          .
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Parent/Guardian first name</span>
            <input
              required
              type="text"
              name="consentParentFirstName"
              autoComplete="given-name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Parent/Guardian last name</span>
            <input
              required
              type="text"
              name="consentParentLastName"
              autoComplete="family-name"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            Please type your full name to authorise consent
          </span>
          <input
            required
            type="text"
            name="consentSignature"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Date</span>
          <input
            required
            type="date"
            name="consentDate"
            defaultValue={todayISODate}
            className={inputClass}
          />
        </label>
      </div>

      {/* 5. TRUST STRIP */}
      <div className="border-t-2 border-ink/15 pt-6 text-sm leading-relaxed text-ink/70">
        <p>
          Facilitated by Dave Sonntag · Working With Children Check (WWC
          #561262) · SafeTALK trained
        </p>
        <p>Public liability insured · Small group</p>
        <p>
          Good Noise Project voluntarily follows the National Principles for
          Child Safe Organisations.
        </p>
      </div>

      {error && (
        <p className="border-2 border-ink bg-white/90 px-3 py-2 text-sm font-semibold text-ink">
          Something went wrong sending that — please try again, or email us
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full ${pillBaseStyles} ${pillSizeStyles.md} ${submitButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {submitting
          ? supportNeeds === "yes"
            ? "Submitting…"
            : "Redirecting to payment…"
          : supportNeeds === "yes"
            ? "Submit"
            : "Book & pay"}
      </button>

      {supportNeeds !== "yes" && (
        <p className="-mt-2 text-center text-sm text-ink">
          You'll be redirected to Stripe to complete payment.
        </p>
      )}
    </form>
  )
}
