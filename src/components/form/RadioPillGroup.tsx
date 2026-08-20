type RadioOption = {
  value: string
  label: string
}

type RadioPillGroupProps = {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  required?: boolean
  /** Static Tailwind class controlling column count at `sm:` — must be a
   * literal string (not composed at runtime) so Tailwind's build-time
   * scanner picks it up. Defaults to one column per option. */
  columnsClassName?: string
}

// Equal-weight radio pills: every option gets identical size, colour and
// prominence (no default/primary styling on any one option), a 44px+
// touch target, and a visually-hidden native input so keyboard/screen
// reader users get standard radio semantics while the label carries the
// visual state via `has-[:checked]`.
export default function RadioPillGroup({
  name,
  options,
  value,
  onChange,
  required = true,
  columnsClassName,
}: RadioPillGroupProps) {
  return (
    <div
      role="radiogroup"
      className={`grid grid-cols-1 gap-3 ${columnsClassName ?? ""}`}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex min-h-11 cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-cream px-4 py-3 text-center font-body font-semibold text-ink has-[:checked]:bg-ink has-[:checked]:text-white"
        >
          <input
            required={required}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}
