// Netlify Forms expects a standard form-urlencoded POST to "/" (or the
// current path) with a "form-name" field matching the form's name. Doing
// this via fetch — rather than a native form submission — lets us stay on
// the page and show our own inline success/error state instead of Netlify's
// default success page.
async function postFields(fields: Record<string, string>): Promise<void> {
  const body = new URLSearchParams(fields)

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Netlify form submission failed: ${response.status}`)
  }
}

export async function submitNetlifyForm(form: HTMLFormElement): Promise<void> {
  const fields: Record<string, string> = {}
  for (const [key, value] of new FormData(form).entries()) {
    fields[key] = String(value)
  }
  await postFields(fields)
}

// For submitting a second, lightweight Netlify form from data already
// collected on an existing form element — e.g. filing a targeted alert
// alongside (rather than instead of) the main form submission, so it can
// carry its own "form-name" and trigger its own Netlify email notification.
export async function submitNetlifyFormFields(
  fields: Record<string, string>,
): Promise<void> {
  await postFields(fields)
}
