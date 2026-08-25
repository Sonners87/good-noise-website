export default async (req) => {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
    }

    if (process.env.BREVO_PUSH_ENABLED === "true") {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          attributes: name ? { FIRSTNAME: name } : {},
          listIds: [7],
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        return new Response(JSON.stringify(err), { status: response.status });
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
