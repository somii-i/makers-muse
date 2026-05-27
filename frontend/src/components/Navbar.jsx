import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Palette, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useState } from 'react'

export default function Navbar({ onCartOpen }) {
  const { user, isAuthenticated, isArtist, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">Makers Muse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/gallery" className="btn-ghost text-sm">Gallery</Link>
            <Link to="/about" className="btn-ghost text-sm">About</Link>
            <Link to="/how-it-works" className="btn-ghost text-sm">How It Works</Link>
            {isArtist && (
              <Link to="/artist/dashboard" className="btn-ghost text-sm">Dashboard</Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-xs text-white/40 px-2">
                  {user?.email?.split('@')[0]}
                </span>
                {!isArtist && (
                  <button
                    id="cart-btn"
                    onClick={onCartOpen}
                    className="relative btn-ghost"
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </button>
                )}
                {isArtist && (
                  <Link to="/artist/dashboard" className="btn-ghost" aria-label="Dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-ghost" aria-label="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn-ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 py-4 animate-fade-in">
          <div className="page-container flex flex-col gap-2">
            <Link to="/gallery" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Gallery</Link>
            <Link to="/about" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/how-it-works" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>How It Works</Link>
            {isArtist && (
              <Link to="/artist/dashboard" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            )}
            {!isArtist && isAuthenticated && (
              <button onClick={() => { onCartOpen?.(); setMobileOpen(false) }} className="btn-ghost justify-start">
                <ShoppingCart className="w-5 h-5" /> Cart ({itemCount})
              </button>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-ghost justify-start text-red-400">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-ghost justify-start" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary justify-start" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
