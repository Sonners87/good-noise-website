type ConsentCheckboxProps = {
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  description?: string
  required?: boolean
}

// A single independent, unticked-by-default consent checkbox. Every
// instance renders at the same size/weight regardless of whether it's an
// "accept" or "decline" option — that equal weighting is what makes a
// decline option valid consent rather than a discouraged one.
export default function ConsentCheckbox({
  name,
  checked,
  onChange,
  title,
  description,
  required = false,
}: ConsentCheckboxProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 border-2 border-ink bg-cream px-4 py-3 text-ink has-[:checked]:bg-ink has-[:checked]:text-white">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        required={required}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
      />
      <span className="flex flex-col gap-1 py-0.5">
        <span className="font-body font-semibold leading-snug">{title}</span>
        {description && (
          <span className="text-sm leading-snug opacity-80">{description}</span>
        )}
      </span>
    </label>
  )
}
