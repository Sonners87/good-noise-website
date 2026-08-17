import type { ReactNode } from "react"
import PillButton from "./PillButton"

type InfoRow = { label: string; value: ReactNode }

type WorkshopInfoCardProps = {
  title?: string
  /** Overrides the default title styling entirely — e.g. to match another
      heading elsewhere on the page instead of this card's own default. */
  titleClassName?: string
  rows: InfoRow[]
  ctaLabel?: string
  ctaHref?: string
  className?: string
  /** Rendered inside the CTA footer, below the button — e.g. a short
      urgency note. Only shown alongside a CTA. */
  children?: ReactNode
}

export default function WorkshopInfoCard({
  title,
  titleClassName,
  rows,
  ctaLabel,
  ctaHref,
  className = "",
  children,
}: WorkshopInfoCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden border-2 border-ink bg-cream ${className}`}
    >
      {title && (
        <div className="border-b-2 border-ink px-6 py-4 md:py-5">
          {/* h2 (not span) so titleClassName="font-display" can pick up the
              h2.font-display global rule — that's what actually swaps the
              family to Anton with the right letter-spacing/size-adjust;
              the plain .font-display utility alone stays Work Sans. */}
          <h2 className={titleClassName ?? "font-body font-bold text-lg text-ink"}>
            {title}
          </h2>
        </div>
      )}
      <div className="flex flex-1 flex-col justify-start gap-4 px-6 py-6">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-start justify-between gap-4 ${i === rows.length - 1 ? "" : "border-b border-ink/15 pb-4"}`}
          >
            <span className="shrink-0 font-body font-semibold text-xs tracking-wide text-ink/60">
              {row.label}
            </span>
            <span className="whitespace-pre-line font-body font-semibold text-sm text-ink text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      {ctaLabel && ctaHref && (
        <div className="border-t-2 border-ink px-6 py-6 md:py-8">
          <PillButton href={ctaHref} variant="primary" className="w-full">
            {ctaLabel}
            <span aria-hidden="true">&rarr;</span>
          </PillButton>
          {children}
        </div>
      )}
    </div>
  )
}
