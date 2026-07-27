# CLAUDE.md — src/components

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Reusable UI components shared across pages. Each component is self-contained — no page-level logic lives here.

## HeroScene.jsx / IcosahedronNav.jsx

3D pyramid navigation rendered via React Three Fiber. `HeroScene` is the Canvas wrapper; it tracks DOM-level pointer events for click/drag discrimination (5px threshold) and renders the DOM tooltip. `IcosahedronNav` owns the geometry, zone coloring, rotation (`useFrame`), and R3F pointer events. Navigation across all pages is done entirely through this component — there is no header nav bar.

## Carousel.jsx / CarouselCard.jsx

**Carousel props:** `{ items: Project[] }` — the `projects` array from `src/data/projects.js`. Renders a vertical 3D drum: cards are laid out at `360 / n` degree steps on a `translateZ(RADIUS)` ring, dragged with the mouse/touch on the Y axis, and snapped to the nearest card on release. Adding or removing projects needs no changes here — the angle step is derived from `items.length`.

**Single-perspective rule (do not nest 3D contexts):** `Carousel` owns the only `perspective` in its ancestry, and the 15° sideways lean lives *inside* it as the `TILT_Y` tilt group wrapping the track. Do **not** wrap `<Carousel>` in another `perspective` + `rotate*` + `preserve-3d` layer from the page. `Projects.jsx` used to do exactly that, and it silently killed pointer input: the cards still painted in the right place and `elementsFromPoint` still listed the link as topmost, but `elementFromPoint` resolved to the `<section>` instead, so *no point in the entire viewport* hit-tested to the "View Project" anchor and the click could never land. Nothing about it looked broken — that is what makes it easy to reintroduce.

Because the tilt now happens inside the perspective, `rotateY` swings each card along the ring radius and pushes the active card `RADIUS * sin(TILT_Y)` off-centre; `TILT_OFFSET_X` cancels that with a matching `translateX`. Change `TILT_Y` and the offset follows automatically — keep them together.

To check hit-testing after touching any of this, scan for points that actually resolve to the link rather than trusting the visuals:

```js
const a = [...document.querySelectorAll('a')].find(x => x.textContent.includes('View Project'))
const r = a.getBoundingClientRect()
document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === a  // must be true
```

**Interaction rule:** the section-level drag handlers deliberately skip `handleDragStart` when the press lands on an `a`, `button`, or `[role="button"]` (see the `isInteractive` helper). Without this guard, any pointer jitter during a click rotates the track, the element slides out from under the cursor, and the browser never dispatches `click` on it. `CarouselCard`'s link additionally sets `draggable={false}` and stops propagation on `mousedown`/`touchstart`. Keep both when adding new interactive controls inside the drum. (This guard is necessary but was *not* sufficient on its own — the nested-perspective bug above masked it.)

**CarouselCard props:** `{ name, image, active, imgFailed, onImgError }` — **image only**. Non-active cards are dimmed and get `pointer-events: none`. Image failures are tracked by index in the parent's `imgFailedMap` so the ghost previews stay in sync.

**Text lives outside the perspective — do not move it back into the card.** The title, description, and "View Project" link are rendered by `Carousel.jsx` as a flat, absolutely-positioned block, not by `CarouselCard`. Inside the drum the text took two resampling passes — a `PERSP / (PERSP - RADIUS)` ≈ 1.35× perspective magnification plus the `TILT_Y` foreshortening — which visibly blurred 14px body copy. Only the active card's annotation was ever visible (the rest were `opacity: 0`), so hoisting it costs nothing and it now rasterises as ordinary 2D type.

Its position is derived, not hardcoded: `projectEdge()` projects the card's left and right edges through the same tilt + perspective the drum uses, and `ANNOTATION_LEFT/W/TOP` fall out of that. The tilted card projects as a trapezoid whose centre is ~18px left of the section centre, so simply centring the text misaligns it against the card's left edge. Change `TILT_Y`, `RADIUS`, `PERSP`, or `CARD_W` and the annotation follows automatically.

**Every card wrapper must be exactly `TRACK_H` tall.** A card rotates about its own centre while the track rotates about the track's centre. If those two centres differ, the paired rotations no longer cancel and each card settles at a different depth — so the cards render at visibly different sizes and the annotation, anchored to the ideal geometry, ends up underneath the image. This held by accident while the card contained the annotation (270px image + ~110px text = `TRACK_H`); once the text moved out, the wrapper shrank to 270px and the drum desynchronised. The height is now pinned explicitly — keep it tied to `TRACK_H`, not to content.

**`isSnapping` gates the annotation's opacity**, so it must never be left stuck true. `handleDragEnd` and `snapTo` both set it only when `targetRot !== rotation` — a click with no drag, or a click on the active card's own dot, produces a no-op rotation that fires no `transitionend`, which would otherwise hide the text permanently.

## ProjectCard.jsx

**Props:** `{ name: string, description: string, link: string | undefined, image: string | undefined }`

Displays a single project with an image preview (`aspect-video`), title, description, and an external link. The `onError` handler on the image hides it if the file is missing — no broken icon is shown. If `link` is falsy, the "View Project" anchor is omitted entirely.

## ProfilePhoto.jsx

Renders the profile photo in the hero section of `Home.jsx`. The source path is a single constant `PHOTO_PATH = '/profile.png'` at the top — change it there to swap the file. If the image is missing, the component falls back to a styled `RL` monogram placeholder (no broken image shown). To process a new photo through background removal before placing it, run `scripts/remove_bg.py`.

## FightPhoto.jsx

**Props:** `{ src: string | undefined, alt: string, caption: string | undefined }`

Renders a single BJJ fight photo as a `<figure>` with an optional `<figcaption>`. Used inside the description body of `src/pages/BJJ.jsx`. If the file is missing, `onError` swaps in a "Photo Coming Soon" placeholder instead of a broken image. The caption is omitted entirely when falsy.

**Sizing is proportional (`sm:w-[45%]`), not fixed — keep it that way.** Below `sm:` the figure is a centred block capped at `max-w-sm`. From `sm:` up it floats right at 45% of the prose column, capped at 290px. A fixed pixel width breaks at the `lg:` breakpoint: the honeycomb sidebar is `w-[460px]`, so at a 1024px viewport the prose column is only ~516px and a fixed 256px float squeezed the text to ~230px — roughly three words per line. A percentage width shrinks with the column instead.

**The float needs both halves to work.** In `BJJ.jsx` the `<FightPhoto />` must come *before* the `<p>` in the DOM (a float only wraps content after it), and the prose container must not use `space-y-*` — that pushes a margin onto the first paragraph and drops the text below the top of the photo. The container uses `[&>p+p]:mt-6` for paragraph spacing plus an `after:clear-both` clearfix instead. Reverting either one silently un-wraps the layout.

The component holds no paths — the source and caption come from `latestFight` in `src/data/fights.js`. Photos live in `public/bjj/`.

## ContactPanel.jsx

Renders the owner's contact details (email, phone, and optional links). Update the `contactInfo` object at the top of the file to change displayed information — no prop changes are needed in parent components.
