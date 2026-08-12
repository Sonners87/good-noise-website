// Single source of truth for the 2026 Spring Holidays Jam Program's
// early-bird pricing window and the two Stripe Payment Links it switches
// between. WA doesn't observe daylight saving, so AWST (+08:00) is a fixed
// offset year-round — no DST handling needed here.
const EARLY_BIRD_CUTOFF = new Date("2026-09-09T00:00:00+08:00")

export const STANDARD_PRICE_DOLLARS = 195
export const EARLY_BIRD_PRICE_DOLLARS = 145

export const STANDARD_STRIPE_URL = "https://buy.stripe.com/cNi28r4m2cd28Pc5BN3F600"
export const EARLY_BIRD_STRIPE_URL = "https://book.stripe.com/7sY28r4m2fpe2qOd4f3F602"

/** True before 9 Sep 2026 Perth time — the early-bird pricing window. */
export function isEarlyBirdActive(now: Date = new Date()): boolean {
  return now < EARLY_BIRD_CUTOFF
}

/** Whichever Payment Link should be charged right now. */
export function currentStripeUrl(now: Date = new Date()): string {
  return isEarlyBirdActive(now) ? EARLY_BIRD_STRIPE_URL : STANDARD_STRIPE_URL
}
