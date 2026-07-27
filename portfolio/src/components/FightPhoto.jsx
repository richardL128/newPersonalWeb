import { useState } from 'react'

export default function FightPhoto({ src, alt, caption }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    /* Centred block on mobile; from sm: up floats right at a share of the column
       (not a fixed width) so it can never crowd out the prose measure. */
    <figure className="w-full max-w-sm mx-auto mb-6 sm:w-[45%] sm:max-w-[290px] sm:mx-0 sm:float-right sm:ml-7 sm:mb-4">
      {!imgFailed && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block [box-shadow:6px_8px_18px_rgba(0,0,0,0.16)]"
          onError={() => setImgFailed(true)}
        />
      ) : (
        /* Placeholder shown when the photo is missing */
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase">
          Photo Coming Soon
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-xs tracking-[0.15em] uppercase text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
