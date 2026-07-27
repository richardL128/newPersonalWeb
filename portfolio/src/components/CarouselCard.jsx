// Image-only card. The title/description/link live in `Carousel.jsx`, rendered
// OUTSIDE the perspective — see the annotation block there for why.
export default function CarouselCard({ name, image, active, imgFailed, onImgError }) {
  return (
    <article
      className="w-[480px] select-none"
      style={{
        opacity: active ? 1 : 0.45,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}
    >
      <div className="w-[480px] aspect-video bg-gray-100 overflow-hidden border border-black">
        {!imgFailed && image ? (
          <img
            src={image}
            alt={`${name} preview`}
            className="w-full h-full object-cover block"
            onError={onImgError}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase">
            No Preview
          </div>
        )}
      </div>
    </article>
  )
}
