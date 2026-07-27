import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Resume from './pages/Resume'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import PaymentEvolution from './pages/PaymentEvolution'
import MLResearch from './pages/MLResearch'
import BJJ from './pages/BJJ'
import HoneycombNav from './components/HoneycombNav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Left: routed page content */}
        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment-evolution" element={<PaymentEvolution />} />
            <Route path="/ml-research" element={<MLResearch />} />
            <Route path="/bjj" element={<BJJ />} />
          </Routes>
        </div>

        {/* Right: persistent honeycomb navigation */}
        <div className="hidden lg:flex items-center justify-center sticky top-0 h-screen w-[460px] shrink-0 border-l border-gray-200">
          <HoneycombNav />
        </div>
      </div>
    </BrowserRouter>
  )
}
