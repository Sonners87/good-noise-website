import type { ReactNode } from "react"

type Size = "sm" | "md"
type Variant = "onBlue" | "onLight" | "primary"

type PillButtonProps = {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export const pillSizeStyles: Record<Size, string> = {
  sm: "px-6 py-3 text-base",
  md: "px-9 py-4 text-lg",
}

export const pillVariantStyles: Record<Variant, string> = {
  onBlue:
    "bg-white text-ink border-terracotta hover:bg-terracotta hover:text-white hover:border-terracotta",
  onLight:
    "bg-brand text-white border-terracotta hover:bg-terracotta hover:text-white hover:border-terracotta",
  primary:
    "bg-terracotta text-white border-terracotta hover:bg-ink hover:text-white hover:border-ink",
}

export const pillBaseStyles =
  "font-body font-semibold inline-flex items-center justify-center gap-2 rounded-full border-2 tracking-wide transition"

export default function PillButton({
  href,
  variant = "onBlue",
  size = "md",
  className = "",
  children,
}: PillButtonProps) {
  return (
    <a
      href={href}
      className={`${pillBaseStyles} ${pillSizeStyles[size]} ${pillVariantStyles[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
