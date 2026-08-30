declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

// Fires a Meta Pixel event via the base pixel script loaded in index.html.
// A no-op if that script hasn't loaded (e.g. blocked by an ad/privacy
// blocker) so callers don't need to guard every call site.
//
// Pass eventId to match a server-side Conversions API event sent for the
// same action (e.g. a Stripe checkout session ID) — Meta uses it to
// de-duplicate the two instead of double-counting the conversion.
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window.fbq !== "function") return
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId })
  } else {
    window.fbq("track", eventName, params ?? {})
  }
}
