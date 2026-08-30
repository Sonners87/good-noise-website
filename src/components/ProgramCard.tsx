import type { ReactNode } from "react"
import PillButton from "./PillButton"

type ProgramCardRow = { label: string; value: ReactNode }

type ProgramCardProps = {
  title: string
  price: number
  priceLabel: string
  scholarshipNote: string
  rows: ProgramCardRow[]
  ctaLabel: string
  ctaHref: string
  refundNote?: string
  className?: string
}

// The one featured .gn-card on /school-holiday-music-camp-perth. Price leads
// (largest element after the title) with the scholarship line right beneath
// it as full body copy, not fine print — both sit ahead of the When/Where
// details so a parent scanning the card sees cost and accessibility before
// logistics. Props-driven so a future program is a data change, not a page
// rewrite — see src/data/upcomingProgram.ts.
export default function ProgramCard({
  title,
  price,
  priceLabel,
  scholarshipNote,
  rows,
  ctaLabel,
  ctaHref,
  refundNote,
  className = "",
}: ProgramCardProps) {
  return (
    <div className={`gn-card !p-0 flex flex-col overflow-hidden ${className}`}>
      <div className="border-b-2 border-ink px-6 py-5 md:py-6">
        <h3 className="font-display text-2xl uppercase leading-[0.98] text-terracotta sm:text-3xl">
          {title}
        </h3>
      </div>

      <div className="border-b-2 border-ink px-6 py-6">
        <span className="font-display text-6xl leading-none text-ink sm:text-7xl">
          ${price}
        </span>
        <p className="mt-2 font-body text-sm font-semibold text-ink/70">{priceLabel}</p>
        <p className="mt-4 font-body text-base font-semibold leading-relaxed text-ink">
          {scholarshipNote}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-6 py-6">
        {rows.map((row, i) => (
          <div
            key={typeof row.label === "string" ? row.label : i}
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

      <div className="border-t-2 border-ink px-6 py-6 md:py-8">
        <PillButton href={ctaHref} variant="primary" className="w-full">
          {ctaLabel}
          <span aria-hidden="true">&rarr;</span>
        </PillButton>
        {refundNote && (
          <p className="mt-3 text-center font-body font-semibold text-xs text-ink/60">
            {refundNote}
          </p>
        )}
      </div>
    </div>
  )
}
