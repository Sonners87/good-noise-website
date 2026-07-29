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
