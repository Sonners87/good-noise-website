// Photo/alt pairing for each workshop's WorkshopCard, kept separate from
// workshops.ts (which stays plain, no image imports — see the comment in
// WorkshopDetail.tsx) but centralised here so both the Workshops pillar page
// and the homepage "What's coming up" teaser render the exact same card.
import jamInstrumentsPhoto from "../assets/images/workshop-jam-instruments.jpg"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"

export const workshopCardPhotos: Record<
  string,
  { src: string; alt: string; objectPosition?: string }
> = {
  "2026-spring-holidays": {
    src: jamInstrumentsPhoto,
    alt: "Silhouetted hands holding guitars, a bass, a keyboard, a cymbal and microphones up against the sky",
    objectPosition: "center 80%",
  },
  "songwriting-oct-2026": {
    src: bandPracticePhoto,
    alt: "Two young musicians at band practice, one playing electric guitar and singing into a microphone",
  },
}
