// A visitor who has already headed to Stripe (or landed on the booking
// confirmation page) has converted — nothing on the site should then pitch
// them a "not ready to book?" offer. Recorded in localStorage rather than
// sessionStorage so it survives the round trip out to Stripe's domain and
// back, and so a booked visitor returning to the workshop page days later
// on the same device still isn't asked.
//
// Deliberately generic: CampSignupForm sets this for any camp it sends to
// checkout, not just the 2026 spring holidays one. Someone who has just
// paid for a program shouldn't be pitched a soft signup on any page.
const CHECKOUT_STARTED_KEY = "gn-checkout-started"

// localStorage throws (rather than no-ops) in Safari private browsing and
// wherever site data is blocked, so every access is guarded. Failing to
// read the flag degrades to "not converted" — the visitor may see a soft
// offer they didn't need, which is the harmless direction to fail in.
export function markCheckoutStarted(): void {
  try {
    localStorage.setItem(CHECKOUT_STARTED_KEY, "1")
  } catch {
    // Storage unavailable — nothing to record.
  }
}

export function hasCheckoutStarted(): boolean {
  try {
    return localStorage.getItem(CHECKOUT_STARTED_KEY) === "1"
  } catch {
    return false
  }
}
