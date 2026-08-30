// Receives the webhook Stripe sends after a payment on the Spring Holidays
// Jam Program Payment Link completes, verifies it's genuinely from Stripe,
// then sends the same confirmation shown on /booking-confirmed-2026-spring as an email
// via Brevo. Keep this copy in sync with src/pages/BookingConfirmed.tsx.
import { createHash } from "node:crypto"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Server-side half of the Meta Conversions API integration (the client-side
// half is the Pixel "Purchase" event fired from BookingConfirmed.tsx). Only
// runs once both env vars are set in Netlify — until then this is a no-op,
// same as the BREVO_PUSH_ENABLED gate in subscribe.js.
async function sendMetaPurchaseEvent(session) {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN
  if (!pixelId || !accessToken) return

  const email = session.customer_details?.email
  if (!email) return

  const hashedEmail = createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex")

  const payload = {
    data: [
      {
        event_name: "Purchase",
        // Stripe's checkout session ID — also used as the eventID for the
        // client-side fbq('track', 'Purchase', ...) call when the Payment
        // Link's confirmation URL passes it through as ?session_id=..., so
        // Meta de-duplicates the two instead of double-counting.
        event_id: session.id,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://goodnoiseproject.com.au/booking-confirmed-2026-spring",
        user_data: {
          em: [hashedEmail],
        },
        custom_data: {
          currency: (session.currency || "aud").toUpperCase(),
          value: (session.amount_total ?? 0) / 100,
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      console.error("Meta Conversions API error:", await response.text())
    }
  } catch (err) {
    console.error("Error calling Meta Conversions API:", err)
  }
}

export default async (req) => {
  const sig = req.headers.get("stripe-signature")
  const rawBody = await req.text()

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    console.error("Webhook signature check failed:", err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return new Response("Received", { status: 200 })
  }

  const session = stripeEvent.data.object
  const customerEmail = session.customer_details?.email
  const customerName = session.customer_details?.name || "there"

  if (!customerEmail) {
    console.error("No customer email found on session — cannot send email")
    return new Response("No email to send to", { status: 200 })
  }

  await sendMetaPurchaseEvent(session)

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Good Noise Project",
          email: "dave@goodnoiseproject.com.au",
        },
        to: [{ email: customerEmail, name: customerName }],
        subject: "You're in! Welcome to the band.",
        htmlContent: `
          <p>Hey there,</p>
          <p>You're officially locked in for Good Noise Project's 2026 Spring Holidays Jam Program! I'm so excited to have you on board.</p>
          <h3>Here's What You Need to Know</h3>
          <p><strong>When</strong><br>
          Wed, 30 Sep – Thur 1 Oct 2026<br>
          9am – 3pm each day</p>
          <p><strong>Where</strong><br>
          Player 1 Music School<br>
          5 Woodville Lane, North Perth WA 6006</p>
          <p><strong>What to Bring Each Day</strong><br>
          Instrument (we've also got a range on hand)<br>
          A water bottle<br>
          Packed lunch &amp; snacks (fridge available)<br>
          Earplugs (if sensitive to noise)</p>
          <p>The two days are all about fun, creativity and good vibes. There's no pressure — just two days of jamming, creating music and finding some likeminded musos to make noise with.</p>
          <p>I'll be in touch closer to the date with any last bits of info you need. In the meantime, if you've got questions, just reply to this email or reach me directly:</p>
          <p>Dave Sonntag<br>
          dave@goodnoiseproject.com.au<br>
          0413 626 240</p>
          <p>Can't wait to see you in the room.</p>
          <p>Dave<br>
          Good Noise Project<br>
          +61 413 626 240<br>
          dave@goodnoiseproject.com.au</p>
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brevo API error:", errorText)
      return new Response("Failed to send email", { status: 500 })
    }

    console.log(`Confirmation email sent to ${customerEmail}`)
  } catch (err) {
    console.error("Error calling Brevo:", err)
    return new Response("Error sending email", { status: 500 })
  }

  return new Response("Received", { status: 200 })
}
