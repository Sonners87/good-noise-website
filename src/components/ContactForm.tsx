import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"
import { submitNetlifyForm } from "../lib/submitNetlifyForm"

export default function ContactForm() {
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
      <div className="mt-10 max-w-lg rounded-xl border-2 border-ink bg-cream px-6 py-8">
        <p className="font-body font-bold text-lg text-ink">
          Thanks — we'll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="contact"
      data-netlify="true"
      className="mt-10 grid max-w-lg grid-cols-1 gap-5"
    >
      <input type="hidden" name="form-name" value="contact" />

      <label className="flex flex-col gap-2">
        <span className="font-body font-semibold text-xs tracking-wide text-white/80">
          Name
        </span>
        <input
          required
          type="text"
          name="name"
          className="rounded-xl border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-body font-semibold text-xs tracking-wide text-white/80">
          Email
        </span>
        <input
          required
          type="email"
          name="email"
          className="rounded-xl border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-body font-semibold text-xs tracking-wide text-white/80">
          Message
        </span>
        <textarea
          required
          name="message"
          rows={4}
          className="rounded-xl border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
          placeholder="Tell us a bit about who you're enquiring for..."
        />
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
        Send enquiry
      </button>
    </form>
  )
}
