import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Palette, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { authService } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authService.login(form.email, form.password)
      login({ ...res })
      navigate(res.role === 'ROLE_ARTIST' ? '/artist/dashboard' : '/gallery')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
            <Palette className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Welcome Back</h1>
          <p className="text-white/40 mt-2">Sign in to your Makers Muse account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
                : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
        <p className="text-center text-white/30 text-sm mt-2">
          <Link to="/forgot-password" className="hover:text-white/60 transition-colors">
            Forgot your password?
          </Link>
        </p>
      </div>
    </main>
  )
}
