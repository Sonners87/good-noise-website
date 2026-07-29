import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"

const inputClass =
  "border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
const labelClass = "font-body font-semibold text-xs tracking-wide text-white/80"

export default function MusicianIntakeForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
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
    <form onSubmit={handleSubmit} className="mt-10 grid max-w-lg grid-cols-1 gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Participant's name</span>
        <input required type="text" name="participantName" className={inputClass} placeholder="Their full name" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Age / school year</span>
        <input required type="text" name="ageAndYear" className={inputClass} placeholder="e.g. 16 / Year 11" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Parent/guardian name and contact details</span>
        <input
          required
          type="text"
          name="guardianContact"
          className={inputClass}
          placeholder="Name, phone and/or email"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          Preferred instrument(s) — including any they'd like to try for the
          first time
        </span>
        <input
          required
          type="text"
          name="instruments"
          className={inputClass}
          placeholder="e.g. guitar and vocals, keen to try drums"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Years played (if any)</span>
        <input type="text" name="yearsPlayed" className={inputClass} placeholder="e.g. 2 years, or none yet" />
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

      <button
        type="submit"
        className={`mt-2 w-fit ${pillBaseStyles} ${pillSizeStyles.md} ${pillVariantStyles.onBlue}`}
      >
        Submit
      </button>
    </form>
  )
}
