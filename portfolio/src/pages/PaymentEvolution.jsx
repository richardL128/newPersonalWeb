import { Link } from 'react-router-dom'

export default function PaymentEvolution() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors mb-8">
        ← Home
      </Link>
      <div className="border-b-2 border-accent pb-6 mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Work Experience</p>
        <h1 className="font-serif text-3xl font-medium text-black">SWE @ Payment Evolution</h1>
      </div>

      <div className="max-w-2xl space-y-6 text-gray-600 leading-relaxed">
        <p>This was my first co-op experience, where I worked as a Software Engineering Intern at PaymentEvolution. I had the opportunity to contribute to several exciting projects, including building a proof of concept for a new feature for one of the company’s payroll products.
        </p>   
        <p>The feature was a web-based employee punch-in/punch-out system that used facial detection and facial recognition to verify an employee’s identity when clocking in or out. I used open-source models, YOLOv8 for face detection and ArcFace for facial embedding generation, sourced through Hugging Face. I also built FastAPI services to support identity verification and integrated PostgreSQL with the pgvector extension to store facial embeddings and perform cosine similarity matching.
        </p>
        <p>The web application used React and Next.js for the frontend and API routes, with PostgreSQL and Prisma supporting the backend data layer.
        </p>
        <p> Currently building an AI powered insurance quote ingestion and summarization tool to help streamline our benefits quoting process. The tool leverages the Microsoft Graph API family and FastAPI to extract email attachments and body metadata and uses Anthropic's Claude API to summarize the contents and compute a reccomendation based on the client's desired coverage. 
        </p>  
      </div>
    </div>
  )
}
