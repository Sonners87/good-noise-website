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
}

export default function Placeholder({ kind = "PLACEHOLDER", children, className = "" }: PlaceholderProps) {
  if (!SHOW_PLACEHOLDERS) return null
  return (
    <p
      data-placeholder={kind}
      className={`border-2 border-dashed border-[var(--gn-acid)] bg-[var(--gn-pink)] p-4 font-body text-sm font-semibold text-ink ${className}`}
    >
      [{kind}: {children}]
    </p>
  )
}
