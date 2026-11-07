// Media slots for program pages. Files live in src/assets/programs/ and are
// matched by name: drop a file with the config's placeholder name in there and
// the slot fills itself. Until then, preview builds show a dashed placeholder
// naming the file to add; production renders nothing (no empty boxes).
import { SHOW_PLACEHOLDERS } from "./afterschool/Placeholder"
import type { MediaImage, MediaVideo } from "../content/programs"

const assetUrls = import.meta.glob("../assets/programs/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

function resolveAsset(file?: string): string | undefined {
  if (!file) return undefined
  return assetUrls[`../assets/programs/${file}`]
}

function EmptySlot({ label, file, aspect }: { label: string; file: string; aspect: string }) {
  if (!SHOW_PLACEHOLDERS) return null
  return (
    <div
      data-placeholder="PLACEHOLDER"
      className={`flex ${aspect} w-full items-center justify-center border-2 border-dashed border-ink/40 bg-[var(--gn-pink)]/30 p-4 text-center font-body text-sm font-semibold text-ink`}
    >
      [PLACEHOLDER: {label} — add src/assets/programs/{file}]
    </div>
  )
}

export function ProgramImage({
  image,
  aspect = "aspect-[16/9]",
  className = "",
}: {
  image: MediaImage
  aspect?: string
  className?: string
}) {
  const src = resolveAsset(image.file)
  if (!src) {
    return (
      <div className={className}>
        <EmptySlot label="image" file={image.file} aspect={aspect} />
      </div>
    )
  }
  return (
    <div className={`${aspect} w-full overflow-hidden border-2 border-ink ${className}`}>
      <img
        src={src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

export function ProgramVideo({ video, className = "" }: { video: MediaVideo; className?: string }) {
  const poster = resolveAsset(video.posterFile)
  const src = resolveAsset(video.file)

  if (video.embedUrl) {
    return (
      <div className={`aspect-video w-full overflow-hidden border-2 border-ink bg-ink ${className}`}>
        <iframe
          src={video.embedUrl}
          title={video.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    )
  }

  if (!src) {
    return (
      <div className={className}>
        <EmptySlot
          label="video"
          file={`${video.file ?? "video.mp4"} (+ poster ${video.posterFile ?? "poster.webp"}), or set embedUrl`}
          aspect="aspect-video"
        />
      </div>
    )
  }

  return (
    <div className={`aspect-video w-full overflow-hidden border-2 border-ink bg-ink ${className}`}>
      {/* preload="none" + poster: nothing downloads until the visitor presses
          play. Muted + playsInline so it behaves on iOS. */}
      <video
        controls
        muted
        playsInline
        preload="none"
        poster={poster}
        aria-label={video.title}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
