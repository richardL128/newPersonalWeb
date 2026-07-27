import { Link } from 'react-router-dom'
import ProfilePhoto from '../components/ProfilePhoto'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 [perspective:1000px]">
      <section className="flex items-end gap-8 border-b border-gray-200 [transform:rotateY(25deg)] [transform-origin:center] [transform-style:preserve-3d]">
        {/* Text — left, top-padded */}
        <div className="flex-1 py-16 md:py-28">
          <p className="text-xs tracking-[0.2em] uppercase text-black-400 mb-6">
            2A computer engineering @uwaterloo
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-black leading-tight mb-8 pb-3 border-b-2 border-accent w-fit">
            Richard Liu
          </h1>
          <Link to="/payment-evolution" className="block text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed px-3 py-0.5 -mx-3 border border-transparent underline underline-offset-4 decoration-gray-300 hover:decoration-accent hover:border-gray-200 hover:bg-gray-50 hover:font-semibold hover:text-accent transition-all duration-200">
            SWE @Payment Evolution (1B Co-op)
          </Link>
          <Link to="/ml-research" className="block text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed px-3 py-0.5 -mx-3 border border-transparent underline underline-offset-4 decoration-gray-300 hover:decoration-accent hover:border-gray-200 hover:bg-gray-50 hover:font-semibold hover:text-accent transition-all duration-200">
            ML Research @Carleton University
          </Link>
          <Link to="/bjj" className="block text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed px-3 py-0.5 -mx-3 border border-transparent underline underline-offset-4 decoration-gray-300 hover:decoration-accent hover:border-gray-200 hover:bg-gray-50 hover:font-semibold hover:text-accent transition-all duration-200">
            White belt in Brazilian jiu-jitsu 🥋
          </Link>
        </div>

        {/* Photo — right, anchored to bottom of section */}
        <div className="hidden lg:block shrink-800 w-72 self-end">
          <ProfilePhoto />
        </div>
      </section>
    </div>
  )
}
