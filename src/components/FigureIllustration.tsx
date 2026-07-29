// Single-line figure illustrations, reused from the brand-direction
// exploration (same paths, same forest stroke) — cropped to isolate one
// figure per card rather than the full group scene.

type Figure = "guitarist" | "singer"

type FigureIllustrationProps = {
  figure: Figure
  className?: string
}

export default function FigureIllustration({
  figure,
  className = "",
}: FigureIllustrationProps) {
  return (
    <svg
      viewBox={figure === "guitarist" ? "15 10 170 230" : "450 10 170 230"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {figure === "guitarist" ? (
          <>
            <path d="M110,73 C107,95 106,120 109,148" />
            <path d="M109,92 C90,98 72,108 58,124" />
            <path d="M109,92 C122,96 133,106 138,120 C140,128 136,134 128,138" />
            <ellipse
              cx="128"
              cy="158"
              rx="27"
              ry="19"
              transform="rotate(-15 128 158)"
            />
            <path d="M58,124 L34,98" />
            <path d="M109,148 C107,175 100,200 92,226" />
            <path d="M109,148 C116,172 128,196 136,222" />
            <path d="M82,227 L100,224" />
            <path d="M126,223 L145,219" />
            <circle cx="110" cy="52" r="21" />
          </>
        ) : (
          <>
            <path d="M530,69 C528,95 529,122 530,148" />
            <path d="M528,88 C513,80 498,68 486,52 C482,47 480,44 478,40" />
            <path d="M532,88 C547,80 562,68 574,52 C578,47 580,44 582,40" />
            <path d="M530,148 C526,172 518,196 510,222" />
            <path d="M530,148 C536,170 546,192 554,214 C557,220 557,224 554,227" />
            <path d="M502,224 L519,222" />
            <path d="M546,227 L563,224" />
            <circle cx="530" cy="48" r="21" />
          </>
        )}
      </g>
    </svg>
  )
}
