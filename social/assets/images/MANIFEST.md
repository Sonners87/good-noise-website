# Image slots

Three T4 (full-bleed image) slides need real photos. Until then, each slot
has a generated placeholder — a solid ink fill with an accent border, the
slot ID, and a one-line description of the shot needed.

To swap a real photo in: drop a file named `<slot-id>.jpg` (or `.jpeg` /
`.png`) into this folder, e.g. `06-05.jpg`. The build checks for `.jpg`,
then `.jpeg`, then `.png` and uses whichever it finds first — a dropped
`.jpg` takes priority over the existing placeholder `.png` even if you
don't delete the old file. Re-run `npm run build` from `social/`. No code
or JSON changes needed.

All three images are duotoned (ink → signature blue) via CSS and get a
bottom scrim so the headline stays legible — a straight `object-fit: cover`
crop is applied, so compose the shot with the subject roughly centred or
weighted to the top two-thirds (the bottom ~40% gets covered by the scrim
and headline text).

| Slot | Post / slide | Shot needed | Crop |
|------|---------------|-------------|------|
| `06-05` | Post 06, slide 5 | Hands on instruments, or you playing. Faces optional. Will be duotoned, so contrast matters more than colour. | Full-bleed cover, 4:5. Headline + sub sit bottom-left over a dark scrim — keep the main subject in the upper two-thirds. |
| `08-01` | Post 08, slide 1 | Player 1 Music School, wide shot of the room. | Full-bleed cover, 4:5. Single headline sits bottom-left over a dark scrim. |
| `08-03` | Post 08, slide 3 | Instrument detail: kit, amp, pedal, mic stand. Close and grainy is fine. | Full-bleed cover, 4:5. Headline + sub sit bottom-left over a dark scrim. |
