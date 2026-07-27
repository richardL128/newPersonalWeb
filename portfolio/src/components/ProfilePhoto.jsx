
export default function ProfilePhoto() {
  return (
    <div className="w-full overflow-hidden">
      <img
        src={'/profile.png'}
        alt="Richard Liu"
        className="w-full h-auto block"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling.style.display = 'flex'
        }}
      />
      {/* Placeholder shown when photo is missing */}
      <div
        aria-hidden="true"
        style={{ display: 'none' }}
        className="w-40 h-40 items-center justify-center bg-gray-100"
      >
        <span className="font-serif text-3xl md:text-4xl text-gray-400 select-none tracking-tight">
          RL
        </span>
      </div>
    </div>
  )
}
