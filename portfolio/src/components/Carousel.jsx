import { useState, useRef } from 'react'
import CarouselCard from './CarouselCard'

const CARD_W     = 480
const RADIUS     = 360
const DRAG_SCALE = 1.5
const PERSP      = 1400
const TILT_Y     = 15   // deg: the drum's signature sideways lean
const ACCENT     = '#e8c94b'
const GRAY       = '#a3a3a3'

// Tilting inside the perspective swings every card along the ring's radius, so
// the active card lands RADIUS*sin(TILT_Y) to the right of centre. Cancel it.
const TILT_OFFSET_X = -RADIUS * Math.sin((TILT_Y * Math.PI) / 180)

const CARD_H    = Math.round(CARD_W * (9 / 16))
const TRACK_H   = CARD_H + 110
const SECTION_H = 700

// Project a point on the active card's face to screen space, relative to the
// perspective origin at the section's centre. Because the drum is tilted
// TILT_Y about Y, the card's near edge sits closer to the camera than its far
// edge, so each edge is magnified by a different amount — the card lands as a
// trapezoid whose centre is NOT the section centre. The flat annotation below
// is anchored off these numbers so it lines up with the card's left edge.
const TILT_RAD = (TILT_Y * Math.PI) / 180
function projectEdge(xLocal) {
  const worldX = xLocal * Math.cos(TILT_RAD)
  const worldZ = -xLocal * Math.sin(TILT_RAD) + RADIUS * Math.cos(TILT_RAD)
  const scale  = PERSP / (PERSP - worldZ)
  return { x: worldX * scale, scale }
}

const NEAR_EDGE = projectEdge(-CARD_W / 2)  // card's left edge — the text's anchor
const FAR_EDGE  = projectEdge(CARD_W / 2)

const ANNOTATION_LEFT = Math.round(NEAR_EDGE.x)
const ANNOTATION_W    = Math.round(FAR_EDGE.x - NEAR_EDGE.x)

// Card's bottom edge, magnified at the near edge's rate, then an 18px gap.
const CARD_BOTTOM_Y  = ((SECTION_H - TRACK_H) / 2 + CARD_H - SECTION_H / 2) * NEAR_EDGE.scale
const ANNOTATION_TOP = Math.round(SECTION_H / 2 + CARD_BOTTOM_Y + 18)

// Pointer presses that land on a link or button must not start a carousel drag.
// Otherwise the smallest cursor jitter rotates the track, the element slides out
// from under the pointer, and the browser never dispatches `click` on it.
function isInteractive(target) {
  return !!target?.closest?.('a, button, [role="button"]')
}

export default function Carousel({ items }) {
  const n          = items.length
  const ANGLE_STEP = 360 / n

  const [activeIndex,  setActiveIndex]  = useState(0)
  const [rotation,     setRotation]     = useState(0)
  const [isSnapping,   setIsSnapping]   = useState(false)
  const [isDragging,   setIsDragging]   = useState(false)
  const [imgFailedMap, setImgFailedMap] = useState({})

  const isDraggingRef  = useRef(false)
  const dragStartYRef  = useRef(0)
  const dragBaseRotRef = useRef(0)

  function handleDragStart(clientY) {
    isDraggingRef.current  = true
    dragStartYRef.current  = clientY
    dragBaseRotRef.current = rotation
    setIsSnapping(false)
    setIsDragging(true)
  }

  function handleDragMove(clientY) {
    if (!isDraggingRef.current) return
    setRotation(dragBaseRotRef.current + (clientY - dragStartYRef.current) * DRAG_SCALE)
  }

  function handleDragEnd() {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)

    const n       = items.length
    const nearest = ((Math.round(-rotation / ANGLE_STEP) % n) + n) % n

    // Find the equivalent target angle closest to current rotation so the
    // animation always continues in the same direction (no wraparound reversal).
    const targetBase = -nearest * ANGLE_STEP
    const k          = Math.round((rotation - targetBase) / 360)
    const targetRot  = targetBase + k * 360

    // Only arm the snap transition if the transform actually changes. A click
    // with no drag lands on targetRot === rotation, which fires no transition
    // and therefore no `transitionend` — leaving isSnapping stuck true and the
    // annotation (which fades out while snapping) hidden for good.
    if (targetRot !== rotation) setIsSnapping(true)
    setRotation(targetRot)
    setActiveIndex(nearest)
  }

  function snapTo(i) {
    const targetBase = -i * ANGLE_STEP
    const k          = Math.round((rotation - targetBase) / 360)
    const targetRot  = targetBase + k * 360
    // Same guard as handleDragEnd — clicking the active card's own dot is a no-op
    // rotation, which would otherwise strand isSnapping at true.
    if (targetRot !== rotation) setIsSnapping(true)
    setRotation(targetRot)
    setActiveIndex(i)
  }

  const prevIdx = (activeIndex - 1 + n) % n
  const nextIdx = (activeIndex + 1) % n

  // Ghost preview dimensions — slightly narrower than main card
  const GHOST_W = Math.round(CARD_W * 0.68)
  const GHOST_H = Math.round(GHOST_W * (9 / 16))
  const GHOST_STRIP = 88  // px of the ghost image exposed at each edge

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      style={{ height: SECTION_H, cursor: 'grab', touchAction: 'none' }}
      onMouseDown={(e) => { if (!isInteractive(e.target)) handleDragStart(e.clientY) }}
      onMouseMove={(e) => { if (e.buttons === 1) handleDragMove(e.clientY) }}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => { if (!isInteractive(e.target)) handleDragStart(e.touches[0].clientY) }}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
    >
      {/* Perspective wrapper — the ONLY perspective in the carousel's ancestry.
          Nesting a second perspective/rotate layer above this one (as the page
          used to do) silently breaks pointer hit-testing on the cards: they
          still paint in the right place, but no point in the viewport hit-tests
          to the "View Project" link, so it can never be clicked. Keep the tilt
          inside this context. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: PERSP, perspectiveOrigin: '50% 50%' }}
      >
        {/* Tilt group — leans the whole drum sideways within the same 3D context */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(${TILT_OFFSET_X}px) rotateY(${TILT_Y}deg)`,
          }}
        >
          {/* Rotating track */}
          <div
            style={{
              position: 'relative',
              width: CARD_W,
              height: TRACK_H,
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation}deg)`,
              transition: isSnapping ? 'transform 350ms cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            }}
            onTransitionEnd={() => setIsSnapping(false)}
          >
            {items.map((item, i) => (
              <div
                key={item.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: CARD_W,
                  // Must match TRACK_H. Each card rotates about its OWN centre
                  // while the track rotates about the track's centre; if the two
                  // centres differ, the paired rotations stop cancelling and every
                  // card lands at a different depth — i.e. a different on-screen
                  // size. Height used to come out at TRACK_H only by accident,
                  // because the card also held the annotation. Pin it explicitly.
                  height: TRACK_H,
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <CarouselCard
                  {...item}
                  active={i === activeIndex}
                  imgFailed={imgFailedMap[i] ?? false}
                  onImgError={() => setImgFailedMap(prev => ({ ...prev, [i]: true }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active card's text, rendered OUTSIDE the perspective wrapper on purpose.
          Inside the drum it inherited two resampling passes — a ~1.35x
          perspective magnification (translateZ(RADIUS) under PERSP) plus the
          15deg rotateY foreshortening — which visibly blurred 14px body copy.
          Flat here, it rasterises as ordinary 2D type. Only the active card's
          annotation was ever visible anyway, so nothing is lost. */}
      <div
        className="absolute left-1/2 flex flex-col gap-2"
        style={{
          top: ANNOTATION_TOP,
          width: ANNOTATION_W,
          marginLeft: ANNOTATION_LEFT,
          opacity: isDragging || isSnapping ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        <h3 className="font-serif text-lg font-medium text-black leading-snug">
          {items[activeIndex].name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {items[activeIndex].description}
        </p>
        {items[activeIndex].link && (
          <a
            href={items[activeIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            /* Keep the press off the carousel's drag handler so the click lands. */
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="mt-1 inline-block text-xs tracking-widest uppercase text-black border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors self-start focus-visible:ring-2 focus-visible:ring-black"
          >
            View Project →
          </a>
        )}
      </div>

      {/* Dot indicators — vertical, right edge */}
      <div className="absolute top-0 right-4 bottom-0 flex flex-col items-center justify-center gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => snapTo(i)}
            aria-label={`Go to ${items[i].name}`}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === activeIndex ? ACCENT : GRAY,
              transition: 'background 300ms',
            }}
          />
        ))}
      </div>

      {/* Ghost preview — previous card peeking from top */}
      {n > 1 && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none flex justify-center items-end"
          style={{ height: GHOST_STRIP, overflow: 'hidden' }}
        >
          {!imgFailedMap[prevIdx] && items[prevIdx].image && (
            <img
              key={prevIdx}
              src={items[prevIdx].image}
              alt=""
              draggable={false}
              className="object-cover block flex-shrink-0"
              style={{
                width: GHOST_W,
                height: GHOST_H,
                opacity: 0.22,
                transition: 'opacity 0.35s',
              }}
            />
          )}
        </div>
      )}

      {/* Ghost preview — next card peeking from bottom */}
      {n > 1 && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center items-start"
          style={{ height: GHOST_STRIP, overflow: 'hidden' }}
        >
          {!imgFailedMap[nextIdx] && items[nextIdx].image && (
            <img
              key={nextIdx}
              src={items[nextIdx].image}
              alt=""
              draggable={false}
              className="object-cover block flex-shrink-0"
              style={{
                width: GHOST_W,
                height: GHOST_H,
                opacity: 0.22,
                transition: 'opacity 0.35s',
              }}
            />
          )}
        </div>
      )}
    </section>
  )
}
