type PhotoImageProps = {
  src: string
  alt: string
  className?: string
  aspect?: string
  objectPosition?: string
  tint?: boolean
  /** Scales the image up within its frame for a tighter, more cropped-in
      feel — pair with an off-centre `objectPosition` rather than "center". */
  zoom?: boolean
}

export default function PhotoImage({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/5]",
  objectPosition = "center",
  tint = false,
  zoom = false,
}: PhotoImageProps) {
  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${tint ? "grayscale contrast-125" : ""} ${zoom ? "scale-125" : ""}`}
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
