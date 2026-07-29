// Netlify Forms expects a standard form-urlencoded POST to "/" (or the
// current path) with a "form-name" field matching the form's name. Doing
// this via fetch — rather than a native form submission — lets us stay on
// the page and show our own inline success/error state instead of Netlify's
// default success page.
export async function submitNetlifyForm(form: HTMLFormElement): Promise<void> {
  const body = new URLSearchParams()
  for (const [key, value] of new FormData(form).entries()) {
    body.append(key, String(value))
  }

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Netlify form submission failed: ${response.status}`)
  }
}
