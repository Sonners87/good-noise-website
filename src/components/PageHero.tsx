import type { ReactNode } from "react"
import Header from "./Header"

// Shared nav + heading wrapper for simple "heading, tagline, content" pages
// (Workshops, Contact, booking pages, etc.) — keeps the gap below the nav
// consistent as new landing pages are added, rather than each page
// hand-rolling its own top padding.
export default function PageHero({ children }: { children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand">
      <Header />
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
        {children}
      </div>
    </section>
  )
}
