import { Link } from "react-router-dom"

// Homepage "choose your path" block — lets a parent or teacher self-select
// off the teen-facing default rather than reading through it. Per the
// design brief, each block gets its own flat colour and a slight opposing
// rotation (never used for the pink highlight-block or acid-CTA roles
// elsewhere on the page, since here they're just flat fills).
const blocks: { label: string; href: string; background: string; rotate: string }[] = [
  { label: "For Young Musos", href: "/workshops", background: "var(--gn-acid)", rotate: "-0.6deg" },
  { label: "For Parents", href: "/for-parents", background: "var(--gn-pink)", rotate: "0.5deg" },
  { label: "For Schools", href: "/for-schools", background: "var(--gn-paper-soft)", rotate: "-0.4deg" },
]

export default function AudienceSplit() {
  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-10 md:px-10 md:py-14">
        {blocks.map((block) => (
          <Link
            key={block.label}
            to={block.href}
            className="border-[3px] border-[var(--gn-ink)] px-5 py-[18px] font-display text-[clamp(19px,3vw,27px)] text-[var(--gn-ink)] uppercase leading-none"
            style={{ background: block.background, transform: `rotate(${block.rotate})` }}
          >
            {block.label} &rarr;
          </Link>
        ))}
      </div>
    </section>
  )
}
