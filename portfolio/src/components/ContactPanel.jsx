const contactInfo = {
  email: 'r498liu@uwaterloo.ca',
  phone: '+1 (647)-580-5359',
  links: [
    { label: 'GitHub', href: 'https://github.com/richardL128' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/richard-liu07/' },
  ],
}

export default function ContactPanel() {
  return (
    <div className="border border-gray-200 p-8 md:p-12 max-w-lg bg-gray-50">
      <dl className="space-y-6">
        <div>
          <dt className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Email</dt>
          <dd>
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-serif text-black hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-black"
            >
              {contactInfo.email}
            </a>
          </dd>
        </div>

        <div>
          <dt className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Phone</dt>
          <dd>
            <a
              href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
              className="font-serif text-black hover:text-gray-600 transition-colors focus-visible:ring-2 focus-visible:ring-black"
            >
              {contactInfo.phone}
            </a>
          </dd>
        </div>

        {contactInfo.links.length > 0 && (
          <div>
            <dt className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Links</dt>
            <dd className="flex flex-col gap-1">
              {contactInfo.links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-black hover:text-gray-600 transition-colors underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-black self-start"
                >
                  {label}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
