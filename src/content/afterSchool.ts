// All copy for /after-school-programs and /after-school-programs/safety.
// Source of truth: docs/after-school/after-school-programs-copy_1.md (Parts A
// and B). Pages and components read from here so wording lives in one place.

export const INFO_PACK_LABEL = "Request the info pack"
// TODO(info-pack): the info pack PDF (copy file Part C) doesn't exist yet.
// Until it does, this goes to the request form page. When the PDF is published,
// point this at it and change the label to "Download the info pack".
export const INFO_PACK_HREF = "/after-school-programs/request"
export const ASK_HREF = "/after-school-programs/contact"

export const hero = {
  eyebrow: "After-school programs",
  audience: "For councils, schools and youth organisations",
  headline: "Music's Better Shared. Especially After School.",
  body: "We help young people in WA create original music through regular after school music programs. The result? Finding their tribe, getting out of their heads, and having a tonne of fun in the process.",
  subhead:
    "A weekly songwriting, jamming and recording program for young musicians in Perth. We travel to your venue, bring the plan and run every session (or show you how to).",
  intro: [
    "We're dedicated to making music and songwriting accessible for every young person in WA. Our after-school programs get young people writing, playing and recording original music together.",
    "We believe in the power of music to connect people, build self-compassion and inject a sense of play into their lives. We've seen it first-hand. We want your students or local youth to experience it too.",
  ],
  photoAlt:
    "Young musicians laughing together in a jam session, with saxophones, a microphone and lyric sheets in hand",
}

export const outcomes = {
  heading: "What young people walk away with",
  tiles: [
    { word: "Belonging", line: "A band to be part of, with people they'd never have otherwise met." },
    { word: "Confidence", line: "To create original music and share it." },
    { word: "Collaboration", line: "Listening to other people's ideas, adding to them and backing them." },
    { word: "Resilience", line: "Taking on a creative challenge and seeing it through." },
    { word: "Their own song", line: "A finished original song, and a recording of it to keep." },
  ],
  footnote: "And fun. Lots of it.",
}

export const eightWeekSchedule = [
  { week: "1", what: "Warm up together, first jam, pick a theme for the song, sketch some chords, start humming melodies", theme: "Permission" },
  { week: "2", what: "Lyric writing methods and activities, exploring chord progressions and melodies", theme: "Permission" },
  { week: "3", what: "Song structure mostly locked, lyrics nearly done", theme: "Permission into Play" },
  { week: "4", what: "Adding colour to the song: hooks, counter melodies, harmonies, etc.", theme: "Play" },
  { week: "5", what: "More time on the extras: a solo, a bridge, dynamics, dropping in and out", theme: "Play" },
  { week: "6", what: "Run-throughs and a nerves check-in", theme: "Connection" },
  { week: "7", what: "The finale: a performance at a pre-organised festival or event, or an in-house concert for family and friends (or, instead of a performance, a live recording at your venue)", theme: "Connection" },
  { week: "8", what: "Reflection and projection: how last week felt, where they want to take their music, and who will keep them accountable", theme: "Connection" },
]

export const programs = {
  heading: "Program options",
  cards: [
    {
      id: "eight-week",
      title: "8-Week Program",
      oneLiner: "A small group of young musicians write an original song from scratch, play it live and take home a recording.",
      photoAlt: "Two young musicians sitting on a rug in a jam room, smiling as they write lyrics on sheets of paper",
      photoPosition: "center 40%",
    },
    {
      id: "drop-in",
      title: "Weekly Drop-In Sessions",
      oneLiner:
        "Ongoing weekly sessions young people can join any time. Each one stands on its own, so nobody falls behind if they miss a week or two. New participants welcomed each week.",
      photoAlt:
        "Dave Sonntag and a group of young musicians gathered in a jam room, holding guitars, a bass, saxophones and a microphone, smiling at the camera",
      photoPosition: "center 40%",
      details: [
        "Sessions can cover songwriting, lyric writing, dynamics, permission to create, self-compassion as a musician, performance prep, recording, mentoring and free jams.",
        "Some crowd favourites: the Worst Jam Ever, Lyric Circle, Cut-Up Lyrics, the 60-Second Jingle and the Conductor Game.",
        "What the group wants, the group gets. If they want to write a song in an hour, that's exactly what we'll do.",
      ],
    },
    {
      id: "tailored",
      title: "Tailored Programs",
      oneLiner: "A shorter or longer program, a particular age group, or a focus you choose.",
      photoAlt: "Two young musicians talking beside a saxophone on a music stand and a blue electric guitar",
      photoPosition: "center 40%",
      details: [
        "Every school, council and youth organisation is different, and so are the young people in your community. If you'd like a different length, a focus beyond music like self-compassion, resilience or connection, a group with more or less experience, or your staff trained in our methods and activities, we'd love to talk.",
        "We love a challenge. If you don't see a program that suits you, get in touch with Dave and we'll work to make it happen.",
      ],
    },
  ],
}

export const whoFor = {
  heading: "Who it's for",
  items: [
    { label: "Ages", text: "Anywhere from 11 to 18." },
    { label: "Experience", text: "Participants need some playing behind them. A few chords, a basic beat or being comfortable singing is plenty." },
    { label: "Instruments", text: "Participants bring their own where they can. If that's tricky, let us know and we'll sort something out." },
    { label: "Hosts", text: "Local councils and youth centres, schools (government, Catholic and independent), youth organisations and community groups." },
    { label: "Where", text: "Your venue, anywhere in Perth." },
    { label: "Who runs it", text: "Us, or us alongside your staff." },
  ],
}

export const howItWorks = {
  heading: "How you can get onboard",
  steps: [
    { title: "We talk", text: "We talk through your young people, your space and what you're after." },
    { title: "Lock it in", text: "We agree the program, dates, numbers and who runs it, and send through our paperwork." },
    { title: "We deliver", text: "We turn up and run every session." },
    { title: "We report back", text: "Attendance, feedback, photos (with consent) and the recording." },
  ],
  delivery: [
    {
      title: "Hand it over to us",
      text: "We plan and run every session, supervise participants and handle sign-in and sign-out. Your team doesn't need to be in the room.",
      shadow: "blue" as const,
    },
    {
      title: "Run it with us",
      text: "Your staff join in and learn the activities as we go. We're in it with you before we take off and leave you to it.",
      shadow: "orange" as const,
    },
  ],
}

export const safetySummary = {
  heading: "The paperwork, sorted",
  ticks: [
    "Child Safety Policy, following the National Principles for Child Safe Organisations",
    "Current Working with Children Check for everyone working with participants",
    "$30 million public liability and $5 million professional liability insurance",
    "Photos, video and recordings only with consent",
  ],
  linkLabel: "See all our safety and paperwork",
  linkHref: "/after-school-programs/safety",
}

export const meetDave = {
  heading: "Meet Dave",
  text: "Good Noise Project is run by Dave Sonntag: a drummer of thirty years, a self-taught singer-songwriter and a youth facilitator who runs wellbeing workshops in WA schools every week.",
  linkLabel: "Read Dave's story",
  photoAlt: "Dave Sonntag smiling as he plays an acoustic guitar in a jam room, surrounded by young musicians",
  videoLabel: "A group of young musicians playing the song they wrote",
}

export type Testimonial = { quote: string; name: string; role: string }
export const testimonials: Testimonial[] = [
  {
    quote:
      "I've had to actually think about what I'm playing. At school, I'm just given the music and it's a bit boring. So, here, I choose my own chords and we make our own song together. It's creative. It's more fun.",
    name: "Zane",
    role: "Good Noise Project participant",
  },
  {
    quote:
      "The best part was making a song from scratch and then listening back it. It takes creativity to think of that sort of thing.",
    name: "Nathan",
    role: "Good Noise Project participant",
  },
  {
    quote: "It helps you work together with people, and I think it's really nice to have that skill.",
    name: "Indie",
    role: "Good Noise Project participant",
  },
  {
    quote: "It gives people a place to connect, a place to get things wrong.",
    name: "Luke",
    role: "Good Noise Project facilitator",
  },
]

export const cost = {
  heading: "Cost",
  text: "Every program is quoted to suit your group and venue. Grant-funded? We're happy to help with your application.",
}

export const faqs = {
  heading: "FAQs",
  items: [
    {
      q: "Where do you run programs?",
      a: "Anywhere in Perth. We'll help you find a suitable venue if you don't have one. And we travel to you.",
    },
    { q: "Who looks after registrations?", a: "We can take them through your booking system, or discuss using our own." },
    {
      q: "What if someone misses a week?",
      a: "They jump straight back in. We catch them up, and there's always a role for them in the band.",
    },
    {
      q: "Is this music therapy?",
      a: "No. There's something genuinely therapeutic in making music together, but we're not a therapy service. Anything that needs more support goes straight back to your team.",
    },
  ],
}

export const finalCta = {
  heading: "Let's get your young people jamming",
  text: "Tell us about your group and your space, and we'll take it from there.",
}

export const safetyPage = {
  heading: "The paperwork, sorted",
  intro: "Before your first session you'll have everything you need to say yes.",
  ticks: [
    { text: "Child Safety Policy, following the National Principles for Child Safe Organisations", href: "/child-safety-policy" },
    { text: "Everyone working with participants holds a current WA Working with Children Check" },
    { text: "$30 million public liability and $5 million professional liability insurance" },
    { text: "SafeTALK (suicide alertness) trained" },
    { text: "Photos, video and recordings only with consent, and young people get their own say", href: "/photography-policy" },
    { text: "Songs belong to the young people who wrote them", href: "/photography-policy#who-owns-the-songs" },
    { text: "Mentoring and small-group work happens in open, visible spaces" },
    {
      text: "A clear referral pathway: if a young person raises something worrying, we pass it straight to your nominated wellbeing contact or youth officer, as set out in our Child Safety Policy",
    },
    { text: "When we run it: sign-in and sign-out, pick-up arrangements and an emergency plan for your venue" },
  ],
  onRequest: "Certificate of currency, risk assessment and emergency plan available on request.",
  links: [
    { label: "Child Safety Policy", href: "/child-safety-policy" },
    { label: "Photography, Filming and Recording Policy", href: "/photography-policy" },
    { label: "Privacy Collection Notice", href: "/privacy" },
  ],
}
