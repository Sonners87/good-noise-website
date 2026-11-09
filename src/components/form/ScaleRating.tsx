type ScaleRatingProps = {
  name: string
  question: string
  /** What 1 means, e.g. "Very hard for them". */
  lowLabel: string
  /** What 10 means, e.g. "No trouble at all". */
  highLabel: string
}

// A 1–10 rating row: ten equal numbered pills with a plain-language label
// at each end. Native radios (visually hidden) so it works with the
// keyboard and screen readers, and with FormData as-is. Always required —
// it only renders inside the support-needs reveal.
export default function ScaleRating({ name, question, lowLabel, highLabel }: ScaleRatingProps) {
  return (
    <fieldset className="grid grid-cols-1 gap-2">
      <legend className="font-body text-sm font-semibold text-ink md:text-base">{question}</legend>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <label
            key={n}
            className="flex min-h-11 cursor-pointer items-center justify-center border-2 border-ink bg-cream font-body font-semibold text-ink has-[:checked]:bg-ink has-[:checked]:text-white"
          >
            <input required type="radio" name={name} value={String(n)} className="sr-only" />
            {n}
          </label>
        ))}
      </div>
      <div className="flex justify-between gap-4 text-xs text-ink/70">
        <span>1 = {lowLabel}</span>
        <span className="text-right">10 = {highLabel}</span>
      </div>
    </fieldset>
  )
}
