import PhotoImage from "./PhotoImage"
import acousticBoy from "../assets/images/strip-acoustic-boy.webp"
import drummer from "../assets/images/strip-drummer.webp"
import buskingGirl from "../assets/images/strip-busking-girl.webp"
import recordStore from "../assets/images/strip-record-store.webp"

const photos = [
  { src: acousticBoy, alt: "A teenage boy playing acoustic guitar on stage" },
  { src: drummer, alt: "A young drummer performing under green stage light" },
  {
    src: buskingGirl,
    alt: "A young girl singing passionately while playing a pink guitar",
  },
  {
    src: recordStore,
    alt: "A teenager browsing vinyl records in a record store",
  },
]

export default function PhotoStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {photos.map((photo) => (
        <PhotoImage
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          aspect="aspect-square"
        />
      ))}
    </div>
  )
}
