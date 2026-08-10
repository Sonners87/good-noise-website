import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Eyebrow from "../components/Eyebrow"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import FacilitatorContact from "../components/FacilitatorContact"
import StayInLoop from "../components/StayInLoop"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"

const bioParagraphs = [
  "Music has been Dave Sonntag's saviour, his mate, his megaphone and his silo — a way to express, a way to vent, and above all, a way to connect. For thirty years as a drummer and twenty as a self-taught guitarist, vocalist and singer-songwriter, it's carried him as much as he's carried it: onto Triple J, onto the drum stool in front of thousands, and into a life built around creativity, connection and belonging. It introduced him to lifelong mates. It even introduced him to his wife.",
  "His professional path as a copywriter led him to design and refresh programs for zero2hero, a West Australian youth mental health organisation, where he's spent time volunteering and mentoring young people.",
  "He's passionate about youth mental health, about seeing music in young people's lives, and about the indescribable feelings and incomparable opportunities that playing music — and creating with others — can give them.",
  "That's why he started Good Noise.",
]

const credentialsLine =
  "Dave holds a current Working With Children Check and SafeTALK (suicide alertness) certification."

export default function About() {
  useEffect(() => {
    document.title = "About Dave — Good Noise Project"
  }, [])

  return (
    <>
      <div className="bg-brand">
        <Header />
      </div>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24">
          <Eyebrow tone="onLight">About</Eyebrow>
          <h1 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
            Meet Dave
          </h1>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-20">
          <PhotoImage
            src={facilitatorPhoto}
            alt="Dave Sonntag playing acoustic guitar and singing into a microphone outdoors"
            aspect="aspect-[4/5]"
            objectPosition="center 20%"
          />

          <div>
            <div className="space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
              {bioParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <FacilitatorContact className="mt-8" />

            <p className="mt-8 border-t border-ink/15 pt-6 text-sm leading-relaxed text-ink/65">
              {credentialsLine}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <div className="flex flex-col items-start gap-4 border-t border-ink/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-ink/80 md:text-lg">
              Curious what a Good Noise workshop looks like?
            </p>
            <PillButton href="/#workshops" variant="onLight" size="sm">
              See workshops
            </PillButton>
          </div>
        </div>
      </section>

      <StayInLoop source="stay-in-loop-block" />
      <Footer />
    </>
  )
}
