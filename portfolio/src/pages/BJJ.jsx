import { Link } from 'react-router-dom'
import FightPhoto from '../components/FightPhoto'
import { latestFight } from '../data/fights'

export default function BJJ() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors mb-8">
        ← Home
      </Link>
      <div className="border-b-2 border-accent pb-6 mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Personal</p>
        <h1 className="font-serif text-3xl font-medium text-black">Brazilian Jiu-Jitsu 🥋</h1>
      </div>

      {/* Photo precedes the prose so the float wraps it; clearfix contains the float */}
      <div className="max-w-2xl text-gray-600 leading-relaxed [&>p+p]:mt-6 after:block after:clear-both after:content-['']">
        <FightPhoto
          src={latestFight.image}
          alt={latestFight.alt}
          caption={latestFight.caption}
        />

        <p>I picked up Jiujitsu during the winter of 2026. It is a hobby that helps break up the pace of prompt engineering and drowning in schoolwork LOL. I have been training for around 5 months now. I competed for the first time this summer; and, I won! I am still not great at the sport, so I will keep training. If anybody wants to roll, send me an open mat location and we can run it!
          
        </p>
      </div>
    </div>
  )
}
