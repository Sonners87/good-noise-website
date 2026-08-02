const PHONE_DISPLAY = "+61 413 626 240"
const PHONE_HREF = "tel:+61413626240"
const EMAIL = "dave@goodnoiseproject.com.au"

type FacilitatorContactProps = {
  className?: string
}

export default function FacilitatorContact({ className = "" }: FacilitatorContactProps) {
  return (
    <div className={`flex flex-col gap-1.5 font-body text-sm text-ink/70 ${className}`}>
      <a href={PHONE_HREF} className="transition hover:text-terracotta">
        <span className="font-semibold text-ink/50">M</span> {PHONE_DISPLAY}
      </a>
      <a href={`mailto:${EMAIL}`} className="transition hover:text-terracotta">
        <span className="font-semibold text-ink/50">E</span> {EMAIL}
      </a>
    </div>
  )
}
