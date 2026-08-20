export type MediaLevel = "all" | "non_identifiable" | "none"

export type ParentMediaConsent = {
  imagesNonIdentifiable: boolean
  imagesIdentifiable: boolean
  declinedAll: boolean
}

/** Collapses the parent's three mutually-exclusive media ticks into one level. */
export function parentMediaLevel(consent: ParentMediaConsent): MediaLevel {
  if (consent.declinedAll) return "none"
  if (consent.imagesIdentifiable) return "all"
  if (consent.imagesNonIdentifiable) return "non_identifiable"
  return "none"
}

const CONSENT_VALIDITY_YEARS = 3

export function consentExpiry(capturedAt: Date) {
  const expiresAt = new Date(capturedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + CONSENT_VALIDITY_YEARS)
  return expiresAt
}
