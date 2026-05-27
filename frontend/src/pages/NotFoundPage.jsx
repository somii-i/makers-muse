import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="text-center max-w-md relative animate-slide-up">
        {/* Glowing 404 */}
        <div className="relative mb-8">
          <p className="font-display font-black text-[10rem] leading-none text-transparent bg-gradient-to-b from-white/10 to-transparent bg-clip-text select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display font-black text-8xl gradient-text">404</p>
          </div>
        </div>

        <h1 className="font-display font-bold text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 mb-10 leading-relaxed">
          Looks like this canvas is blank. The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" id="not-found-home-btn" className="btn-primary">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/gallery" id="not-found-gallery-btn" className="btn-secondary">
            <Search className="w-4 h-4" /> Browse Gallery
          </Link>
        </div>

        <button onClick={() => history.back()} className="btn-ghost text-sm mt-6 w-full justify-center">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </main>
  )
}
