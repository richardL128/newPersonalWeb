import { projects } from '../data/projects'
import Carousel from '../components/Carousel'

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Flat title — no 3D tilt */}
      <div className="border-b-2 border-accent pb-6 mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Portfolio</p>
        <h1 className="font-serif text-3xl font-medium text-black">Projects</h1>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400 text-sm">No projects yet.</p>
      ) : (
        /* The carousel's 15deg tilt lives inside Carousel itself — do NOT wrap
           this in another perspective/rotate layer. See Carousel.jsx (TILT_Y). */
        <Carousel items={projects} />
      )}
    </div>
  )
}
