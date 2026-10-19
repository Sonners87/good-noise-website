const PHONE_DISPLAY = "+61 413 626 240"
const PHONE_HREF = "tel:+61413626240"
const EMAIL = "dave@goodnoiseproject.com.au"

type FacilitatorContactProps = {
  className?: string
  /** "onDark" for ink sections. */
  tone?: "onLight" | "onDark"
}

export default function FacilitatorContact({ className = "", tone = "onLight" }: FacilitatorContactProps) {
  const text = tone === "onDark" ? "text-cream/85" : "text-ink/70"
  const label = tone === "onDark" ? "text-cream/55" : "text-ink/50"
  const hover = tone === "onDark" ? "hover:text-[var(--gn-acid)]" : "hover:text-terracotta"
  return (
    <div className={`flex flex-col gap-1.5 font-body text-sm ${text} ${className}`}>
      <a href={PHONE_HREF} className={`transition ${hover}`}>
        <span className={`font-semibold ${label}`}>M</span> {PHONE_DISPLAY}
      </a>
      <a href={`mailto:${EMAIL}`} className={`transition ${hover}`}>
        <span className={`font-semibold ${label}`}>E</span> {EMAIL}
      </a>
    </div>
  )
}
