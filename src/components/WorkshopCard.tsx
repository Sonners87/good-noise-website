import { Link } from "react-router-dom"
import FigureIllustration from "./FigureIllustration"
import PhotoImage from "./PhotoImage"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"

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
  photoObjectPosition?: string
}

type ComingSoonWorkshopCardProps = CardBody & {
  status: "comingSoon"
  figure: "guitarist" | "singer"
}

type WorkshopCardProps = LiveWorkshopCardProps | ComingSoonWorkshopCardProps

function Title({ title }: { title: string }) {
  return (
    <div className="px-6 pb-4 pt-6">
      <h3 className="font-display text-2xl leading-[1.05] text-ink md:text-3xl">{title}</h3>
    </div>
  )
}

function Details({ blurb, whoFor }: { blurb: string; whoFor: string }) {
  return (
    <div className="px-6 pb-6 pt-4">
      <p className="text-sm leading-snug text-ink/75">{blurb}</p>
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
        <Title title={props.title} />

        <PhotoImage
          src={props.photoSrc}
          alt={props.photoAlt}
          aspect="aspect-[16/9]"
          objectPosition={props.photoObjectPosition}
        />

        <Details blurb={props.blurb} whoFor={props.whoFor} />

        <div className="px-6 pb-6">
          <span
            className={`w-full ${pillBaseStyles} ${pillSizeStyles.sm} ${pillVariantStyles.primary} group-hover:bg-ink group-hover:border-ink`}
          >
            Find out more
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="border-2 border-ink bg-cream">
      <div className="opacity-60">
        <Title title={props.title} />
      </div>

      <div className="relative opacity-60">
        <span className="absolute left-4 top-4 z-10 border border-ink/30 bg-cream px-3 py-1 font-body font-semibold text-xs tracking-wide text-ink/60">
          Coming soon
        </span>
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-sage/25">
          <FigureIllustration
            figure={props.figure}
            className="h-16 w-16 text-brand md:h-20 md:w-20"
          />
        </div>
      </div>

      <div className="opacity-60">
        <Details blurb={props.blurb} whoFor={props.whoFor} />
      </div>
    </div>
  )
}
