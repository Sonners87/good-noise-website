type PhotoImageProps = {
  src: string
  alt: string
  className?: string
  aspect?: string
  objectPosition?: string
  tint?: boolean
}

export default function PhotoImage({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/5]",
  objectPosition = "center",
  tint = false,
}: PhotoImageProps) {
  return (
    <div className={`relative ${aspect} w-full overflow-hidden ${className}`}>
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
