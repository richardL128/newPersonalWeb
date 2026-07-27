import { Link } from 'react-router-dom'

export default function MLResearch() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors mb-8">
        ← Home
      </Link>
      <div className="border-b-2 border-accent pb-6 mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Research</p>
        <h1 className="font-serif text-3xl font-medium text-black">ML Research @ Carleton University</h1>
      </div>

      <div className="max-w-2xl space-y-6 text-gray-600 leading-relaxed">
        <p>Teaching a Simulated Brain to Solve Visual Puzzles

I built a computer model that solves Raven's Matrices — the classic pattern-completion puzzles used in IQ tests, where you look at a 3x3 grid of shapes and figure out what belongs in the missing square. Most programs that solve these puzzles do it with straightforward logic or pattern-matching. I wanted to try something different: representing the shapes and their relationships as points in a very high-dimensional space, and using vector math to figure out the rule that connects one square to the next, then using that same rule to predict what's missing.

The more interesting part came next. Instead of just running this as a normal computer program, I rebuilt it to run on a simulated network of spiking neurons — a model that mimics, at a basic level, how real neurons in the brain communicate using electrical pulses over time, rather than instant, clean digital signals. This meant redesigning the whole system so it could accumulate information gradually as it "watched" the puzzle, hold onto that information in a kind of short-term memory, and then settle on an answer only when asked — all while working with signals that are noisy and imprecise, much like real biological neurons.

The result is a small working example of how a brain-like system built from simple, noisy components can still perform structured reasoning — the same kind of reasoning we associate with intelligence tests. It's a hands-on way of exploring a question that sits at the intersection of neuroscience, psychology, and AI: how might the brain actually implement the kind of pattern recognition and rule-following that shows up in human reasoning?</p>
      </div>
    </div>
  )
}
