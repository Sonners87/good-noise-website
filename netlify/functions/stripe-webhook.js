// Receives the webhook Stripe sends after a payment on a program Payment Link
// completes (Spring Holidays 2026, North Perth Dec 2026, ...), verifies it's genuinely from Stripe,
// then sends the same confirmation shown on /booking-confirmed-2026-spring as an email
// via Brevo. Keep this copy in sync with src/pages/BookingConfirmed.tsx.
import { createHash } from "node:crypto"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Server-side half of the Meta Conversions API integration (the client-side
// half is the Pixel "Purchase" event fired from BookingConfirmed.tsx). Only
// runs once both env vars are set in Netlify — until then this is a no-op,
// same as the BREVO_PUSH_ENABLED gate in subscribe.js.
async function sendMetaPurchaseEvent(session, sourceUrl) {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN
  if (!pixelId || !accessToken) return

  // A $0 payment (e.g. a 100%-off test coupon) is not a real conversion.
  if (!session.amount_total) return

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
        event_source_url: sourceUrl,
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

const SITE = "https://goodnoiseproject.com.au"

// Per-program confirmation emails, keyed by Stripe Payment Link ID (the
// `plink_...` shown in the Stripe dashboard; Checkout sessions carry it as
// session.payment_link). A payment on any link not listed here falls back to
// the Spring Holidays email below, which is how it behaved before this table
// existed. Keep copy in sync with src/content/programs.ts and
// src/pages/ProgramConfirmed.tsx.
function confirmationEmail({ programName, when, time, where, whatToExpect, whatToBring, daysWord }) {
  return `
          <div style="text-align:center;padding:16px 0 24px;background:#ffffff;">
            <img src="${SITE}/email-logo.png" alt="Good Noise Project" width="240" style="width:240px;max-width:100%;height:auto;border:0;">
          </div>
          <p>Hey there!</p>
          <p>You're officially locked in for Good Noise Project's ${programName}! We're so excited to have you on board.</p>
          <h3>Here's What You Need to Know</h3>
          <p><strong>When</strong><br>
          ${when}<br>
          ${time}</p>
          <p><strong>Where</strong><br>
          ${where}</p>
          <h3>What to Expect</h3>
          <p>${whatToExpect}</p>
          <p>The ${daysWord} are all about fun, creativity and good vibes. There's no pressure — just ${daysWord} of jamming, creating music and finding some likeminded musos to make noise with.</p>
          <h3>Please Pack Enough Food for the Day</h3>
          <p><strong>Every participant needs to bring enough food for the whole day: lunch plus snacks.</strong> There's a small kitchen space at the venue where you can store and prepare your food.</p>
          <p>Participants aren't permitted to go to the nearby grocery stores unless a parent or guardian has expressly given permission to Dave. If you'd like to give that permission, just reply to this email and let me know.</p>
          <p><strong>What to Bring Each Day</strong></p>
          <ul>
          ${whatToBring.map((item) => `<li>${item}</li>`).join("\n          ")}
          </ul>
          <p>I'll be in touch closer to the date with any last bits of info you need. In the meantime, if you've got questions, just reply to this email or reach me directly:</p>
          <p>Dave Sonntag<br>
          dave@goodnoiseproject.com.au<br>
          0413 626 240</p>
          <p>Can't wait to see you there!</p>
          <p>Dave<br>
          Good Noise Project<br>
          +61 413 626 240<br>
          dave@goodnoiseproject.com.au</p>
        `
}

const SPRING_PROGRAM = {
  sourceUrl: `${SITE}/booking-confirmed-2026-spring`,
  subject: "You're in! Welcome to the band.",
  html: null, // uses the original inline copy below
}

const WHAT_TO_BRING = [
  "Your instrument (we've also got a range on hand)",
  "Water bottle",
  "<strong>Enough food for the day: packed lunch plus snacks</strong>",
  "Earplugs (if sensitive to noise)",
]

const PROGRAMS_BY_PAYMENT_LINK = {
  // North Perth
  plink_1UZ2U8DBlAJ3RHxBwZDpdnsD: {
    sourceUrl: `${SITE}/workshops/summer-holidays-2026-27/north-perth/confirmed`,
    brevoListId: 10,
    subject: "You're in! Welcome to the band.",
    html: confirmationEmail({
      programName: "Summer Holidays Jam Program (North Perth)",
      when: "Mon 21 – Tue 22 Dec 2026",
      time: "9:30am – 2:30pm each day",
      where: "Player 1 Music School<br>\n          5 Woodville Lane, North Perth WA 6006<br>\n          (Note: Please don't confuse with <strong><em>Woodville Street</em></strong>)",
      whatToExpect:
        "You'll join several other young musos in a safe space and jam out an original song together — lyrics, melody, harmonies, chords, the lot.",
      whatToBring: WHAT_TO_BRING,
      daysWord: "two days",
    }),
  },

  // Cockburn
  plink_1UZ2VFDBlAJ3RHxBRBFGvHhk: {
    sourceUrl: `${SITE}/workshops/summer-holidays-2026-27/cockburn/confirmed`,
    brevoListId: 11,
    subject: "You're in! Welcome to the band.",
    html: confirmationEmail({
      programName: "Summer Holidays Jam Program (Cockburn)",
      when: "Mon 11 – Wed 13 Jan 2027",
      time: "9:30am – 2:30pm each day",
      where: "Cockburn Youth Centre<br>\n          25 Wentworth Parade, Success WA 6164",
      whatToExpect:
        "You'll join several other young musos in a safe space and spend the first two days writing an original song together — lyrics, melody, harmonies, chords, the lot. Day three is recording day: you'll get an introduction to audio recording and see how a song is captured track by track, which will help with your own recording at home.",
      whatToBring: WHAT_TO_BRING,
      daysWord: "three days",
    }),
  },
}

function programForSession(session) {
  return PROGRAMS_BY_PAYMENT_LINK[session.payment_link] ?? SPRING_PROGRAM
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

  const program = programForSession(session)
  await sendMetaPurchaseEvent(session, program.sourceUrl)

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
        subject: program.subject,
        htmlContent: program.html ?? `
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

  // Add the paying customer to this program's Brevo list (North Perth #10,
  // Cockburn #11). Runs after the email and never fails the webhook — a
  // failure here is logged, so Stripe doesn't retry and re-send the email.
  if (program.brevoListId) {
    try {
      const listResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: customerEmail,
          attributes: customerName !== "there" ? { FIRSTNAME: customerName } : {},
          listIds: [program.brevoListId],
          updateEnabled: true,
        }),
      })
      if (!listResponse.ok) {
        console.error(`Brevo list #${program.brevoListId} error:`, await listResponse.text())
      } else {
        console.log(`Added ${customerEmail} to Brevo list #${program.brevoListId}`)
      }
    } catch (err) {
      console.error("Error adding contact to Brevo list:", err)
    }
  }

  return new Response("Received", { status: 200 })
}
