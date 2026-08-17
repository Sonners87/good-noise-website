import type { ReactNode } from "react"
import { Link } from "react-router-dom"

type Size = "sm" | "md"
type Variant = "onBlue" | "onLight" | "primary" | "outline" | "outlineOnDark"

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
  // border-cream (not border-terracotta) deliberately: terracotta and brand
  // both alias --gn-ink now (and both alias forest on the workshop-2026
  // route), so a terracotta/ink border on this variant's ink/forest fill
  // vanished whenever the button sat on an ink/forest section background.
  // Cream never gets remapped by any scope, so the border stays visible
  // everywhere regardless of which background or route it's used on.
  primary:
    "bg-terracotta text-white border-cream hover:bg-ink hover:text-white",
  outline:
    "bg-transparent text-ink border-ink hover:bg-ink hover:text-cream",
  outlineOnDark:
    "bg-transparent text-white border-white hover:bg-white hover:text-ink",
}

export const pillBaseStyles =
  "font-body font-semibold inline-flex items-center justify-center gap-2 border-2 tracking-wide transition"

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
