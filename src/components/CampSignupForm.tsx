import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles } from "./PillButton"
import { submitNetlifyForm, submitNetlifyFormFields } from "../lib/submitNetlifyForm"

const inputClass =
  "border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
const labelClass = "font-body font-semibold text-xs tracking-wide text-white/85"
const sectionHeadingClass =
  "font-body font-bold text-sm uppercase tracking-wide text-white"
// The card is on the terracotta accent color, so buttons need to be their
// own dark variant rather than reusing PillButton's terracotta "primary" —
// that would blend straight into the background.
const submitButtonClass =
  "bg-ink text-white border-ink hover:bg-white hover:text-ink hover:border-ink"

type CampSignupFormProps = {
  campLabel: string
  stripeUrl: string
}

// Collects participant/parent details, screens for additional support
// needs, and either sends buyers on to Stripe to pay or (if screening flags
// something) holds the booking for a manual follow-up first. The Netlify
// submission and the Stripe redirect are two separate steps, so a failed
// submission never sends someone to pay without us having their details on
// file.
export default function CampSignupForm({ campLabel, stripeUrl }: CampSignupFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [supportNeeds, setSupportNeeds] = useState<"yes" | "no" | "">("")
  const [flagged, setFlagged] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await submitNetlifyForm(form)

      if (formData.get("supportNeeds") === "yes") {
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
      <div className="rounded-xl border-2 border-ink bg-terracotta p-6 md:p-8">
        <p className="font-body font-bold text-lg text-white">
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
      className="grid grid-cols-1 gap-6 rounded-xl border-2 border-ink bg-terracotta p-6 md:p-8"
    >
      <input type="hidden" name="form-name" value="camp-signup" />
      <input type="hidden" name="camp" value={campLabel} />

      <div className="grid grid-cols-1 gap-5">
        <span className={sectionHeadingClass}>Participant info</span>

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
          <span className={labelClass}>Preferred instrument</span>
          <input
            required
            type="text"
            name="instrument"
            className={inputClass}
            placeholder="e.g. guitar, vocals, drums"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Tell us a bit about yourself</span>
          <textarea
            name="aboutYou"
            rows={3}
            className={inputClass}
            placeholder="What music are you into? Have you played in bands before?"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 border-t-2 border-white/25 pt-6">
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
      </div>

      <div className="grid grid-cols-1 gap-4 border-t-2 border-white/25 pt-6">
        <span className={labelClass}>
          Does your child have any additional support needs (sensory,
          medical, behavioural, or otherwise) we should be aware of?
        </span>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-ink bg-cream px-4 py-3 font-body font-semibold text-ink has-[:checked]:bg-ink has-[:checked]:text-white">
            <input
              required
              type="radio"
              name="supportNeeds"
              value="no"
              className="sr-only"
              onChange={() => setSupportNeeds("no")}
            />
            No
          </label>
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-ink bg-cream px-4 py-3 font-body font-semibold text-ink has-[:checked]:bg-ink has-[:checked]:text-white">
            <input
              required
              type="radio"
              name="supportNeeds"
              value="yes"
              className="sr-only"
              onChange={() => setSupportNeeds("yes")}
            />
            Yes
          </label>
        </div>

        {supportNeeds === "yes" && (
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Tell us a bit more</span>
            <textarea
              required
              name="supportNeedsDetails"
              rows={3}
              className={inputClass}
              placeholder="What should we know, and how can we best support them?"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-ink">
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
    </form>
  )
}
