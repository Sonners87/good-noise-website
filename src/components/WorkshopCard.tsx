import { Link } from "react-router-dom"
import FigureIllustration from "./FigureIllustration"
import PhotoImage from "./PhotoImage"

type CardBody = {
  title: string
  blurb: string
  whoFor: string
}

type LiveWorkshopCardProps = CardBody & {
  status: "live"
  href: string
  photoSrc: string
  photoAlt: string
}

type ComingSoonWorkshopCardProps = CardBody & {
  status: "comingSoon"
  figure: "guitarist" | "singer"
}

type WorkshopCardProps = LiveWorkshopCardProps | ComingSoonWorkshopCardProps

function CardBody({ title, blurb, whoFor }: CardBody) {
  return (
    <div className="px-6 py-6">
      <h3 className="font-display text-xl leading-[1.05] text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-snug text-ink/75">{blurb}</p>
      <div className="mt-4 border-t border-ink/15 pt-3">
        <span className="font-body font-semibold text-xs tracking-wide text-ink/50">
          Who's it for
        </span>
        <p className="font-body font-semibold text-sm text-ink">{whoFor}</p>
      </div>
    </div>
  )
}

export default function WorkshopCard(props: WorkshopCardProps) {
  if (props.status === "live") {
    return (
      <Link
        to={props.href}
        className="group block border-2 border-ink bg-cream transition hover:border-terracotta"
      >
        <PhotoImage
          src={props.photoSrc}
          alt={props.photoAlt}
          aspect="aspect-[4/5]"
        />
        <CardBody title={props.title} blurb={props.blurb} whoFor={props.whoFor} />
      </Link>
    )
  }

  return (
    <div className="relative border-2 border-ink bg-cream">
      <span className="absolute left-4 top-4 z-10 border border-ink/30 bg-cream px-3 py-1 font-body font-semibold text-xs tracking-wide text-ink/60">
        Coming soon
      </span>
      <div className="opacity-60">
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-sage/25">
          <FigureIllustration
            figure={props.figure}
            className="h-28 w-28 text-brand md:h-36 md:w-36"
          />
        </div>
        <CardBody title={props.title} blurb={props.blurb} whoFor={props.whoFor} />
      </div>
    </div>
  )
}
