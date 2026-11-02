// Photo/alt pairing for the "No Judgement / No Hierarchy / No Pressure" tiles,
// shared by the homepage SafetyFirst section and the school holiday camp page
// so changing a photo here updates both.
import judgementPhoto from "../assets/images/after-school-tailored.webp"
import hierarchyPhoto from "../assets/images/hero-guitar-jam.webp"
import pressurePhoto from "../assets/images/after-school-eight-week.webp"

export const pillarPhotos = {
  judgement: {
    src: judgementPhoto,
    alt: "Two young musicians talking beside a saxophone on a music stand and a blue electric guitar",
  },
  hierarchy: {
    src: hierarchyPhoto,
    alt: "A Good Noise facilitator laughing as he plays acoustic guitar with young musicians on keyboard, guitar and electric guitar in a studio jam session",
  },
  pressure: {
    src: pressurePhoto,
    alt: "Two young musicians sitting on a rug in a jam room, smiling as they write lyrics on sheets of paper",
  },
}
