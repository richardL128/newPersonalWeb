import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { navLinks } from '../data/navLinks'

const HEX_W      = 148
const HEX_H      = 128
const ACCENT     = '#e8c94b'
const DOME_TILT  = 18   // degrees each surrounding hex tilts outward
const CENTER_Z   = 28   // px: center hex pushed toward viewer
const HEX_CLIP   = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

// 7-hex flower — center + 6 surrounding, tight flat-top honeycomb packing.
// Adjacent column spacing: (3/4)*HEX_W = 111px horizontal, HEX_H/2 = 64px vertical offset.
// dx/dy = offset of this hex's center from the flower's center (used to compute dome tilt).
// navIdx: index into navLinks (-1 = decorative filler hex).
const HEX_DEFS = [
  { left: 111, top: 137, dx:    0, dy:    0, navIdx:  0 }, // center      → Home
  { left: 111, top:   9, dx:    0, dy: -128, navIdx: -1 }, // above       → filler
  { left: 222, top:  73, dx:  111, dy:  -64, navIdx:  1 }, // upper-right → Resume
  { left: 222, top: 201, dx:  111, dy:   64, navIdx:  2 }, // lower-right → Projects
  { left: 111, top: 265, dx:    0, dy:  128, navIdx: -1 }, // below       → filler
  { left:   0, top: 201, dx: -111, dy:   64, navIdx:  3 }, // lower-left  → Contact
  { left:   0, top:  73, dx: -111, dy:  -64, navIdx: -1 }, // upper-left  → filler
]

export default function HoneycombNav() {
  const navigate = useNavigate()
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [hoveredHex, setHoveredHex] = useState(null)

  const timeRef    = useRef(0)
  const rafRef     = useRef(null)
  const lastTsRef  = useRef(null)
  const hoveredRef = useRef(null)

  useEffect(() => {
    function tick(ts) {
      if (lastTsRef.current !== null && hoveredRef.current === null) {
        timeRef.current += (ts - lastTsRef.current) / 1000
      }
      lastTsRef.current = ts

      const t = timeRef.current
      // 3× faster frequencies, amplitude kept ≤18 deg so all faces stay visible
      setRotX(10 * Math.sin(t * 0.69) + 5 * Math.sin(t * 1.41))
      setRotY(12 * Math.cos(t * 0.93) + 6 * Math.cos(t * 0.57))

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function handleEnter(i) {
    hoveredRef.current = i
    setHoveredHex(i)
  }
  function handleLeave() {
    hoveredRef.current = null
    lastTsRef.current  = null
    setHoveredHex(null)
  }

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ perspective: '900px' }}
    >
      {/* Oscillating dome group */}
      <div
        style={{
          position: 'relative',
          width: 370,
          height: 393,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {HEX_DEFS.map(({ left, top, dx, dy, navIdx }, i) => {
          const isNav     = navIdx >= 0
          const navItem   = isNav ? navLinks[navIdx] : null
          const Icon      = navItem ? navItem.Icon : null
          const isHovered = hoveredHex === i
          const isDimmed  = hoveredHex !== null && !isHovered && isNav

          // Per-hex outward tilt: each surrounding hex angles away from dome center,
          // creating a convex surface. tiltX/tiltY derived from the radial direction.
          const dist  = Math.sqrt(dx * dx + dy * dy) || 1
          const tiltX = DOME_TILT * (dy / dist)
          const tiltY = -DOME_TILT * (dx / dist)

          // Center bulges toward viewer; surrounding sit at Z=0.
          // Hover adds extra pop-out on top of the base Z.
          const baseZ  = dist === 0 ? CENTER_Z : 0
          const finalZ = isHovered ? baseZ + 30 : baseZ

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
                width: HEX_W,
                height: HEX_H,
                transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${finalZ}px)${isHovered ? ' scale(1.07)' : ''}`,
                transition: 'transform 180ms ease-out, opacity 140ms',
                opacity: isDimmed ? 0.48 : 1,
                cursor: isNav ? 'pointer' : 'default',
                zIndex: isHovered ? 2 : 0,
              }}
              onMouseEnter={() => isNav && handleEnter(i)}
              onMouseLeave={() => isNav && handleLeave()}
              onClick={() => isNav && navigate(navItem.to)}
            >
              {/* Hex face — clip-path shapes the hexagon */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  clipPath: HEX_CLIP,
                  background: isHovered ? ACCENT : isNav ? '#efefef' : '#e3e3e3',
                  transition: 'background 180ms',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                {Icon && (
                  <Icon size={18} strokeWidth={1.5} color="#111" />
                )}
                {navItem && (
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#111',
                      userSelect: 'none',
                    }}
                  >
                    {navItem.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
