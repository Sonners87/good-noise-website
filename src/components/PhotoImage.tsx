type PhotoImageProps = {
  src: string
  alt: string
  className?: string
  aspect?: string
  objectPosition?: string
  tint?: boolean
  /** Set false when the image sits flush inside another element that
      handles its own rounding (e.g. as a strip inside a card), or when the
      caller supplies its own bespoke radius via `className`. */
  rounded?: boolean
}

export default function PhotoImage({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/5]",
  objectPosition = "center",
  tint = false,
  rounded = true,
}: PhotoImageProps) {
  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden ${rounded ? "rounded-xl" : ""} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${tint ? "grayscale" : ""}`}
        style={{ objectPosition }}
        loading="lazy"
      />
      {tint && (
        <div
          className="absolute inset-0 bg-brand mix-blend-color"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
