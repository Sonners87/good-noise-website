import { useState, type FormEvent } from "react"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"
import { submitNetlifyForm } from "../lib/submitNetlifyForm"

// Single shared "subscribe" Netlify form, reused (with different visible
// copy/fields and styling) by the Stay in Touch landing page, the "Stay in
// the Loop" block, and the footer — so every placement lands in one Netlify
// Forms stream rather than three separate ones. `source` tags which
// placement a submission came from without splitting the data. Keep the
// static hidden duplicate of this form in index.html in sync with the
// fields below (Netlify Forms only detects forms present in raw HTML).
type SubscribeFormVariant = "landing" | "compact" | "footer"

type SubscribeFormProps = {
  source: string
  variant?: SubscribeFormVariant
  submitLabel?: string
  className?: string
}

const successCopy: Record<SubscribeFormVariant, string> = {
  landing: "Thanks for joining — we'll be in touch.",
  compact: "You're on the list!",
  footer: "You're on the list!",
}

export default function SubscribeForm({
  source,
  variant = "landing",
  submitLabel = "Join the Community",
  className = "",
}: SubscribeFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(false)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const name = String(formData.get("name") ?? "")

    try {
      await submitNetlifyForm(e.currentTarget)

      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      if (!response.ok) throw new Error(`Brevo subscribe failed: ${response.status}`)

      setSubmitted(true)
    } catch {
      setError(true)
    }
  }

  if (submitted) {
    return (
      <p
        className={`font-body font-semibold ${variant === "landing" ? "text-white" : variant === "footer" ? "text-cream" : "text-ink"} ${className}`}
      >
        {successCopy[variant]}
      </p>
    )
  }

  const isInline = variant !== "landing"

  return (
    <form
      onSubmit={handleSubmit}
      name="subscribe"
      data-netlify="true"
      className={`${isInline ? "flex flex-col gap-3 sm:flex-row" : "grid max-w-lg grid-cols-1 gap-5"} ${className}`}
    >
      <input type="hidden" name="form-name" value="subscribe" />
      <input type="hidden" name="source" value={source} />

      {variant === "landing" && (
        <label className="flex flex-col gap-2">
          <span className="font-body font-semibold text-xs tracking-wide text-white/80">
            Name (optional)
          </span>
          <input
            type="text"
            name="name"
            className="rounded-xl border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
            placeholder="Your name"
          />
        </label>
      )}

      <label className={isInline ? "flex-1" : "flex flex-col gap-2"}>
        {variant === "landing" && (
          <span className="font-body font-semibold text-xs tracking-wide text-white/80">
            Email
          </span>
        )}
        <input
          required
          type="email"
          name="email"
          aria-label="Email"
          className={`w-full rounded-xl border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink ${
            variant === "footer"
              ? "border-cream/30 bg-ink text-cream placeholder:text-cream/40"
              : "border-ink bg-cream text-ink placeholder:text-ink/40"
          }`}
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        className={`${isInline ? "shrink-0" : "mt-2 w-fit"} ${pillBaseStyles} ${isInline ? pillSizeStyles.sm : pillSizeStyles.md} ${
          variant === "landing" ? pillVariantStyles.onBlue : pillVariantStyles.primary
        }`}
      >
        {submitLabel}
      </button>

      {error && (
        <p className="text-sm font-semibold text-terracotta">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  )
}
