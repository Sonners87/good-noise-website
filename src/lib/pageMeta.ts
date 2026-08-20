// Sets document.title the same way every page already does directly, plus
// the <meta name="description"> tag that no page has needed until now —
// creates the tag if index.html doesn't already have one.
export function setPageMeta(title: string, description: string) {
  document.title = title

  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.name = "description"
    document.head.appendChild(meta)
  }
  meta.content = description
}
