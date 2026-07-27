import ContactPanel from '../components/ContactPanel'

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Flat title */}
      <div className="border-b-2 border-accent pb-6 mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Get in Touch</p>
        <h1 className="font-serif text-3xl font-medium text-black">Contact</h1>
      </div>

      {/* Tilt applied to the contact panel */}
      <div className="[perspective:1000px]">
        <div className="[transform:rotateY(7deg)] [transform-origin:center] [transform-style:preserve-3d]">
          <ContactPanel />
        </div>
      </div>
    </div>
  )
}

