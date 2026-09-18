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

// "card" is the stacked name + email pair used inside a paper card on a
// coloured strip (the register-interest block on a workshop page) — same
// fields as "landing", but labelled in ink rather than white.
type SubscribeFormVariant = "landing" | "compact" | "footer" | "card"

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
  card: "You're on the list — we'll be in touch as soon as it's locked in.",
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

  // The two single-field variants sit on one row; "landing" and "card" both
  // stack a name field above the email one.
  const isInline = variant === "compact" || variant === "footer"
  const isCard = variant === "card"

  return (
    <form
      onSubmit={handleSubmit}
      name="subscribe"
      data-netlify="true"
      className={`${
        isInline
          ? "flex flex-col gap-3 sm:flex-row"
          : isCard
            ? "grid grid-cols-1 gap-4"
            : "grid max-w-lg grid-cols-1 gap-5"
      } ${className}`}
    >
      <input type="hidden" name="form-name" value="subscribe" />
      <input type="hidden" name="source" value={source} />

      {!isInline && (
        <label className="flex flex-col gap-2">
          <span
            className={`font-body font-semibold text-xs tracking-wide ${isCard ? "text-ink/70" : "text-white/80"}`}
          >
            {isCard ? "Name" : "Name (optional)"}
          </span>
          <input
            required={isCard}
            type="text"
            name="name"
            autoComplete="given-name"
            className="border-2 border-ink bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink"
            placeholder="Your name"
          />
        </label>
      )}

      <label className={isInline ? "flex-1" : "flex flex-col gap-2"}>
        {!isInline && (
          <span
            className={`font-body font-semibold text-xs tracking-wide ${isCard ? "text-ink/70" : "text-white/80"}`}
          >
            Email
          </span>
        )}
        <input
          required
          type="email"
          name="email"
          aria-label="Email"
          className={`w-full border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink ${
            variant === "footer"
              ? "border-cream/30 bg-ink text-cream placeholder:text-cream/40"
              : "border-ink bg-cream text-ink placeholder:text-ink/40"
          }`}
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        className={`${isInline ? "shrink-0" : isCard ? "mt-1 w-full" : "mt-2 w-fit"} ${pillBaseStyles} ${
          isInline || isCard ? pillSizeStyles.sm : pillSizeStyles.md
        } ${variant === "landing" ? pillVariantStyles.onBlue : pillVariantStyles.primary}`}
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
