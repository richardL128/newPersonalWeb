import { useState } from 'react'

const ACCENT = '#e8c94b'
const IMG_W = 340
const IMG_H = Math.round(IMG_W * (9 / 16)) // 123px
const GAP = 56 // matches gap-14 (3.5rem = 56px)

export default function ProjectCard({ name, description, link, image }) {
  const [imgFailed, setImgFailed] = useState(false)

  const dotX = IMG_W
  const dotY = IMG_H / 2
  const lineX = IMG_W + GAP
  const lineY = 18 // targets h3 cap-height

  return (
    <article className="group relative flex flex-col sm:flex-row sm:items-start sm:gap-14">
      {/* 3D image */}
      <div
        className="shrink-0 w-full sm:w-[340px]"
        style={{ perspective: '900px' }}
      >
        <div
          className="bg-background transition-transform duration-300 [transform-style:preserve-3d] [box-shadow:8px_12px_24px_rgba(0,0,0,0.18)] group-hover:[transform:rotateY(-8deg)_rotateX(3deg)]"
          style={{ transform: 'rotateY(-15deg) rotateX(6deg)' }}
        >
          {!imgFailed && image ? (
            <img
              src={image}
              alt={`${name} preview`}
              className="w-full sm:w-[340px] aspect-video object-cover block"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full sm:w-[340px] aspect-video bg-gray-100 flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase">
              No Preview
            </div>
          )}
        </div>
      </div>

      {/* Pointer line — desktop only */}
      <svg
        className="hidden sm:block absolute top-0 left-0 pointer-events-none"
        style={{ width: 0, height: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <circle cx={dotX} cy={dotY} r={3} fill={ACCENT} />
        <line
          x1={dotX} y1={dotY}
          x2={lineX} y2={lineY}
          stroke={ACCENT}
          strokeWidth={1}
        />
        <circle cx={lineX} cy={lineY} r={2} fill={ACCENT} />
      </svg>

      {/* Annotation — no border, no background */}
      <div className="mt-4 sm:mt-0 flex flex-col gap-2 max-w-xs">
        <h3 className="font-serif text-lg font-medium text-black leading-snug">{name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs tracking-widest uppercase text-black border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors self-start focus-visible:ring-2 focus-visible:ring-black"
          >
            View Project →
          </a>
        )}
      </div>
    </article>
  )
}
