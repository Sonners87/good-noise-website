import type { ReactNode } from "react"

type AccordionProps = {
  summary: ReactNode
  children: ReactNode
  /** "dark" for ink backgrounds, "light" for paper. */
  tone?: "dark" | "light"
  className?: string
  summaryClassName?: string
}

// "+" style accordion on a native <details>, so it works without JS, is
// keyboard accessible and prerenders with its content in the HTML.
export default function Accordion({
  summary,
  children,
  tone = "light",
  className = "",
  summaryClassName = "",
}: AccordionProps) {
  const border = tone === "dark" ? "border-cream/30" : "border-ink/20"
  return (
    <details className={`group border-t-2 ${border} ${className}`}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-body font-semibold [&::-webkit-details-marker]:hidden ${summaryClassName}`}
      >
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className="relative h-5 w-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-0.5 after:-translate-x-1/2 after:bg-current after:transition group-open:after:scale-y-0"
        />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}
