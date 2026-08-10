import type { ReactNode } from "react"
import { Link } from "react-router-dom"

type Size = "sm" | "md"
type Variant = "onBlue" | "onLight" | "primary" | "outline"

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
  outline:
    "bg-transparent text-ink border-ink hover:bg-ink hover:text-cream",
}

export const pillBaseStyles =
  "font-body font-semibold inline-flex items-center justify-center gap-2 rounded-full border-2 tracking-wide transition"

// PillButton is used for both in-app routes ("/about") and links that need a
// real browser navigation — downloadable files ("/info-pack.pdf"), external
// URLs, and same-page hash anchors ("/#workshops"). Only the former should go
// through React Router's Link; the rest need a plain <a> so the browser
// handles the request (or hash scroll) itself.
function isInternalRoute(href: string) {
  return href.startsWith("/") && !href.includes("#") && !/\.[a-z0-9]+$/i.test(href)
}

export default function PillButton({
  href,
  variant = "onBlue",
  size = "md",
  className = "",
  children,
}: PillButtonProps) {
  const sharedClassName = `${pillBaseStyles} ${pillSizeStyles[size]} ${pillVariantStyles[variant]} ${className}`

  if (isInternalRoute(href)) {
    return (
      <Link to={href} className={sharedClassName}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={sharedClassName}>
      {children}
    </a>
  )
}
