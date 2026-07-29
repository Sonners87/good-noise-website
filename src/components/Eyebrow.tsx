import type { ReactNode } from "react"

type EyebrowProps = {
  children: ReactNode
  tone?: "onBlue" | "onLight"
  className?: string
}

const toneStyles: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  onBlue: "border-white text-white",
  onLight: "border-ink text-ink",
}

export default function Eyebrow({
  children,
  tone = "onLight",
  className = "",
}: EyebrowProps) {
  return (
    <span
      className={`font-body font-semibold mb-4 inline-block border-2 px-4 py-2 text-sm tracking-wide ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
