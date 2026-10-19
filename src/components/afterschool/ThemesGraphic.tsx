import { themes } from "../../content/afterSchool"

const panelStyles = [
  "bg-[var(--gn-acid)] text-ink",
  "bg-[var(--gn-pink)] text-ink",
  "bg-ink text-cream border-cream",
]

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" aria-hidden="true" className={`h-5 w-8 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="4">
      <path d="M0 12h34M24 2l12 10-12 10" />
    </svg>
  )
}

// HTML/CSS rebuild of permission-play-connection.png. Stacks vertically on
// phones (arrows turn downward), runs left to right from md up.
export default function ThemesGraphic() {
  return (
    <figure
      className="bg-cream p-4 text-ink md:p-6"
      aria-label="How the three themes work together: Permission, then Play, then Connection, and around again"
    >
      <h4 className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-2xl uppercase leading-tight">
        <span>Permission</span>
        <Arrow />
        <span>Play</span>
        <Arrow />
        <span>Connection</span>
      </h4>
      <p className="mt-2 text-center text-sm text-ink/70">How the three themes work together</p>

      <ol className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-stretch">
        {themes.map((theme, i) => (
          <li key={theme.name} className="contents">
            <div className={`flex flex-1 flex-col border-2 border-ink p-5 ${panelStyles[i]}`}>
              <h5 className="font-display text-2xl uppercase">{theme.name}</h5>
              <p className="mt-2 font-semibold italic">{theme.line}</p>
              <div className="mt-3 space-y-1 text-sm leading-relaxed">
                {theme.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className="mt-auto pt-4 text-xs font-bold uppercase tracking-wider opacity-80">{theme.weeks}</p>
            </div>
            {i < themes.length - 1 && (
              <Arrow className="mx-auto rotate-90 self-center text-ink md:mx-0 md:rotate-0" />
            )}
          </li>
        ))}
      </ol>

      <p className="font-body mt-5 text-center text-sm font-semibold text-ink">
        ...and around again. Permission is given every session.
      </p>
    </figure>
  )
}
