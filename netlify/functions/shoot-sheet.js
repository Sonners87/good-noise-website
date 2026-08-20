// Server-side proxy for the admin shoot sheet. Keeps the Netlify personal
// access token (account-wide credential) out of the browser bundle — the
// client only ever holds the short access key set below, which is scoped
// to this one function and can be rotated without touching the site's
// real Netlify credentials.
export default async (req) => {
  const accessKey = req.headers.get("x-shoot-sheet-key") || new URL(req.url).searchParams.get("key")

  if (!process.env.SHOOT_SHEET_ACCESS_KEY || accessKey !== process.env.SHOOT_SHEET_ACCESS_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  if (!process.env.NETLIFY_FORMS_ACCESS_TOKEN || !process.env.NETLIFY_SITE_ID) {
    return new Response(
      JSON.stringify({
        error:
          "Shoot sheet isn't configured yet — NETLIFY_FORMS_ACCESS_TOKEN and NETLIFY_SITE_ID need to be set as environment variables.",
      }),
      { status: 500 },
    )
  }

  try {
    const formsResponse = await fetch(
      `https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/forms`,
      { headers: { Authorization: `Bearer ${process.env.NETLIFY_FORMS_ACCESS_TOKEN}` } },
    )
    if (!formsResponse.ok) {
      return new Response(JSON.stringify({ error: "Could not list forms" }), {
        status: formsResponse.status,
      })
    }
    const forms = await formsResponse.json()
    const campSignupForm = forms.find((form) => form.name === "camp-signup")
    if (!campSignupForm) {
      return new Response(JSON.stringify({ participants: [] }), { status: 200 })
    }

    const submissionsResponse = await fetch(
      `https://api.netlify.com/api/v1/forms/${campSignupForm.id}/submissions`,
      { headers: { Authorization: `Bearer ${process.env.NETLIFY_FORMS_ACCESS_TOKEN}` } },
    )
    if (!submissionsResponse.ok) {
      return new Response(JSON.stringify({ error: "Could not list submissions" }), {
        status: submissionsResponse.status,
      })
    }
    const submissions = await submissionsResponse.json()

    const participants = submissions.map((submission) => {
      const data = submission.data || {}
      return {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        camp: data.camp || "",
        effectiveConsentLevel: data.effectiveConsentLevel || "none",
        songLicenceParent: data.songLicenceParent === "on",
        submittedAt: submission.created_at,
      }
    })

    return new Response(JSON.stringify({ participants }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
