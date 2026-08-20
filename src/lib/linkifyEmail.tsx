import type { ReactNode } from "react"

const EMAIL_SPLIT = /([\w.+-]+@[\w-]+\.[\w.-]+)/g
const EMAIL_MATCH = /^[\w.+-]+@[\w-]+\.[\w.-]+$/

// Splits plain text on any email address and wraps it as a mailto link,
// so copy from content data can stay plain strings.
export function linkifyEmail(text: string): ReactNode[] {
  return text.split(EMAIL_SPLIT).map((part, i) =>
    EMAIL_MATCH.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="underline decoration-2 underline-offset-2 hover:text-terracotta"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

const CONTACT_SPLIT = /([\w.+-]+@[\w-]+\.[\w.-]+|\b0\d{3} \d{3} \d{3}\b)/g
const CONTACT_EMAIL_MATCH = /^[\w.+-]+@[\w-]+\.[\w.-]+$/
const CONTACT_PHONE_MATCH = /^0\d{3} \d{3} \d{3}$/

// Same idea as linkifyEmail, but also wraps Australian phone numbers
// formatted as "0413 626 240" in a tel: link — the policy pages repeat
// Dave's email and phone together throughout, and both need to be live.
export function linkifyContact(text: string): ReactNode[] {
  return text.split(CONTACT_SPLIT).map((part, i) => {
    if (CONTACT_EMAIL_MATCH.test(part)) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="underline decoration-2 underline-offset-2 hover:text-terracotta"
        >
          {part}
        </a>
      )
    }
    if (CONTACT_PHONE_MATCH.test(part)) {
      return (
        <a
          key={i}
          href={`tel:+61${part.slice(1).replace(/ /g, "")}`}
          className="underline decoration-2 underline-offset-2 hover:text-terracotta"
        >
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}
