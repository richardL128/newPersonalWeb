import { useRef, useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

const RESUME_PATH = '/resume.pdf'
// US Letter aspect ratio: 8.5 / 11
const PAGE_ASPECT = 8.5 / 11

export default function Resume() {
  const titleRef = useRef(null)
  const [pageHeight, setPageHeight] = useState(0)
  const [numPages, setNumPages] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const update = () => {
      const titleH = titleRef.current?.offsetHeight ?? 0
      // py-8 top (32) + mb-6 gap after title (24) + py-8 bottom (32) + 8 buffer
      const available = window.innerHeight - titleH - 32 - 24 - 32 - 8
      setPageHeight(Math.max(available, 400))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const placeholderWidth = Math.round((pageHeight || 600) * PAGE_ASPECT)
  const placeholderHeight = pageHeight || 600

  return (
    <div className="px-8 py-8" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <div ref={titleRef} className="flex items-center justify-between mb-6 border-b-2 border-accent pb-5">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Document</p>
          <h1 className="font-serif text-3xl font-medium text-black">Resume</h1>
        </div>
        <a
          href={RESUME_PATH}
          download
          className="inline-block px-6 py-2.5 bg-black text-white text-sm tracking-widest uppercase hover:bg-accent hover:text-black transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
        >
          Download PDF
        </a>
      </div>

      <div className="flex justify-center" style={{ perspective: '2200px' }}>
        <div
          style={{
            transform: 'rotateY(7deg)',
            transformOrigin: 'center center',
            boxShadow: '22px 20px 55px rgba(0,0,0,0.22), -2px 0 10px rgba(0,0,0,0.06)',
            display: 'inline-block',
            lineHeight: 0,
          }}
        >
          {error ? (
            <div
              className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 text-center px-8"
              style={{ height: placeholderHeight, width: placeholderWidth }}
            >
              <p className="text-gray-600 mb-4 text-sm">Unable to display the PDF in your browser.</p>
              <a
                href={RESUME_PATH}
                download
                className="inline-block px-6 py-2.5 bg-black text-white text-sm tracking-widest uppercase hover:bg-accent hover:text-black transition-colors"
              >
                Download Resume
              </a>
            </div>
          ) : (
            pageHeight > 0 && (
              <Document
                file={RESUME_PATH}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={() => setError(true)}
                loading={
                  <div
                    className="flex items-center justify-center bg-gray-50 text-sm text-gray-400 tracking-widest uppercase"
                    style={{ height: placeholderHeight, width: placeholderWidth }}
                  >
                    Loading…
                  </div>
                }
              >
                {numPages != null &&
                  Array.from({ length: numPages }, (_, i) => (
                    <Page
                      key={i + 1}
                      pageNumber={i + 1}
                      height={pageHeight}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))
                }
              </Document>
            )
          )}
        </div>
      </div>
    </div>
  )
}
