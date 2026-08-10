import { Link } from "react-router-dom"
import SubscribeForm from "./SubscribeForm"

// Condensed, reusable version of the Stay in Touch pitch — same shared
// subscribe form/stream, shorter copy. `source` tags which page it's
// rendered on. Fixed bg-cream treatment everywhere it's placed so it reads
// as one consistent module regardless of the page around it.
export default function StayInLoop({ source }: { source: string }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-display max-w-xl text-2xl leading-snug text-terracotta sm:text-3xl">
            Not ready to book? Join our growing community of young Perth
            musicians and be first to know what's next.
          </p>

          <SubscribeForm
            source={source}
            variant="compact"
            submitLabel="Sign Up"
            className="w-full max-w-md"
          />

          <Link
            to="/stay-in-touch"
            className="font-body font-semibold text-sm text-ink/60 underline decoration-2 underline-offset-4 hover:text-terracotta"
          >
            Learn more &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
