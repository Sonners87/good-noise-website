import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"
import { submitNetlifyForm } from "../lib/submitNetlifyForm"

const inputClass =
  "border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
const labelClass = "font-body font-semibold text-xs tracking-wide text-white/80"

export default function MusicianIntakeForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)
    try {
      await submitNetlifyForm(e.currentTarget)
      setSubmitted(true)
    } catch {
      setError(true)
    }
  }

  if (submitted) {
    return (
      <div className="mt-10 max-w-lg border-2 border-ink bg-cream px-6 py-8">
        <p className="font-body font-bold text-lg text-ink">
          Thanks — we'll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="musician-intake"
      data-netlify="true"
      className="mt-10 grid max-w-lg grid-cols-1 gap-5"
    >
      <input type="hidden" name="form-name" value="musician-intake" />
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Participant's name</span>
        <input required type="text" name="participantName" className={inputClass} placeholder="Their full name" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          In their own words: what are they hoping to get out of these two
          days?
        </span>
        <textarea name="hopes" rows={3} className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          In their own words: anything that might make the first day a bit
          nerve-wracking?
        </span>
        <textarea name="nerves" rows={3} className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          Anything else about them we should know — interests, personality,
          what lights them up
        </span>
        <textarea name="aboutThem" rows={3} className={inputClass} />
      </label>

      <p className="text-sm leading-relaxed text-white/75">
        This information is kept confidential and used only to help us run
        the workshop safely.
      </p>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          Any medical, sensory, or access needs we should be aware of
        </span>
        <textarea name="accessNeeds" rows={3} className={inputClass} />
      </label>

      {error && (
        <p className="text-sm font-semibold text-terracotta">
          Something went wrong sending that — please try again, or email us
          directly.
        </p>
      )}

      <button
        type="submit"
        className={`mt-2 w-fit ${pillBaseStyles} ${pillSizeStyles.md} ${pillVariantStyles.onBlue}`}
      >
        Submit
      </button>
    </form>
  )
}
