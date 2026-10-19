import type { ReactNode } from "react"

// [PLACEHOLDER: ...] and [CHECK: ...] markers from the copy file. They show as
// highlighted TODOs in dev and on Netlify preview builds (VITE_SHOW_PLACEHOLDERS,
// set in netlify.toml) and render nothing in production.
export const SHOW_PLACEHOLDERS =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_PLACEHOLDERS === "true"

type PlaceholderProps = {
  kind?: "PLACEHOLDER" | "CHECK"
  children: ReactNode
  className?: string
  /** Renders as a <span> so it can sit inside a sentence or list item. */
  inline?: boolean
}

export default function Placeholder({ kind = "PLACEHOLDER", children, className = "", inline = false }: PlaceholderProps) {
  if (!SHOW_PLACEHOLDERS) return null
  if (inline) {
    return (
      <span data-placeholder={kind} className={`bg-[var(--gn-pink)] px-1 font-semibold text-ink ${className}`}>
        [{kind}: {children}]
      </span>
    )
  }
  return (
    <p
      data-placeholder={kind}
      className={`border-2 border-dashed border-[var(--gn-acid)] bg-[var(--gn-pink)] p-4 font-body text-sm font-semibold text-ink ${className}`}
    >
      [{kind}: {children}]
    </p>
  )
}
