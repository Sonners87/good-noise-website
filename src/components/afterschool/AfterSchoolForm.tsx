import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "../PillButton"
import { submitNetlifyForm } from "../../lib/submitNetlifyForm"

type AfterSchoolFormProps = {
  /** Netlify form name. Must match the hidden static copy in index.html. */
  formName: "after-school-info-pack" | "after-school-enquiry"
  messageLabel: string
  messageRequired?: boolean
  messagePlaceholder: string
  submitLabel: string
  successMessage: string
}

const inputClass =
  "border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-ink"
const labelClass = "font-body text-xs font-semibold tracking-wide text-ink"

export default function AfterSchoolForm({
  formName,
  messageLabel,
  messageRequired = false,
  messagePlaceholder,
  submitLabel,
  successMessage,
}: AfterSchoolFormProps) {
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
      <div role="status" className="mt-10 max-w-xl border-2 border-ink bg-cream px-6 py-8">
        <p className="font-body text-lg font-bold text-ink">{successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} name={formName} data-netlify="true" className="mt-10 grid max-w-xl grid-cols-1 gap-5">
      <input type="hidden" name="form-name" value={formName} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Contact first name</span>
          <input required type="text" name="firstName" autoComplete="given-name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Contact last name</span>
          <input required type="text" name="lastName" autoComplete="family-name" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Organisation</span>
        <input required type="text" name="organisation" autoComplete="organization" className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Email</span>
        <input required type="email" name="email" autoComplete="email" className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Phone number</span>
        <input required type="tel" name="phone" autoComplete="tel" className={inputClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{messageLabel}</span>
        <textarea
          required={messageRequired}
          name="message"
          rows={5}
          className={inputClass}
          placeholder={messagePlaceholder}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-ink">
          Something went wrong sending that. Please try again, or email dave@goodnoiseproject.com.au directly.
        </p>
      )}

      <button
        type="submit"
        className={`mt-2 w-fit ${pillBaseStyles} ${pillSizeStyles.md} ${pillVariantStyles.onLight}`}
      >
        {submitLabel}
      </button>
    </form>
  )
}
