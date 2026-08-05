import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles } from "./PillButton"
import { submitNetlifyForm } from "../lib/submitNetlifyForm"

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

// Collects participant/parent details before sending buyers on to Stripe to
// pay — the Netlify submission and the Stripe redirect are two separate
// steps, so a failed submission never sends someone to pay without us having
// their details on file.
export default function CampSignupForm({ campLabel, stripeUrl }: CampSignupFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    setSubmitting(true)
    try {
      await submitNetlifyForm(e.currentTarget)
      window.location.href = stripeUrl
    } catch {
      setError(true)
      setSubmitting(false)
    }
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
            <input required type="text" name="firstName" className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Last name</span>
            <input required type="text" name="lastName" className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Birthday</span>
          <input required type="date" name="birthday" className={inputClass} />
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
            <input required type="text" name="parentFirstName" className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Parent last name</span>
            <input required type="text" name="parentLastName" className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email</span>
          <input required type="email" name="email" className={inputClass} />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Phone</span>
          <input required type="tel" name="phone" className={inputClass} />
        </label>
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
        {submitting ? "Redirecting to payment…" : "Book & pay"}
      </button>
    </form>
  )
}
