import type { ReactNode } from "react"

type ConditionalRevealProps = {
  show: boolean
  children: ReactNode
}

// Keeps the aria-live region itself permanently mounted (only its content
// is conditional) so screen readers reliably announce a conditional field
// appearing — an aria-live wrapper that mounts and unmounts with its
// content is not guaranteed to be picked up by assistive tech.
export default function ConditionalReveal({ show, children }: ConditionalRevealProps) {
  return (
    <div aria-live="polite">
      {show && children}
    </div>
  )
}
