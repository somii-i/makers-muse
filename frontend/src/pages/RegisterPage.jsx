import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Palette, Eye, EyeOff, Loader2, UserPlus, Brush, ShoppingBag } from 'lucide-react'
import { authService } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_CUSTOMER',
    bio: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authService.register({
        email: form.email,
        password: form.password,
        role: form.role,
        bio: form.bio || undefined,
      })
      login({ ...res })
      navigate(res.role === 'ROLE_ARTIST' ? '/artist/dashboard' : '/gallery')
    } catch (err) {
      const msg = err?.response?.data?.detail
      setError(msg ?? 'Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
            <Palette className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Create Account</h1>
          <p className="text-white/40 mt-2">Join the Makers Muse community</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <p className="label mb-3">I want to…</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: 'ROLE_CUSTOMER', label: 'Buy Art', icon: ShoppingBag, desc: 'Discover & collect' },
                  { role: 'ROLE_ARTIST',   label: 'Sell Art', icon: Brush,       desc: 'Share & earn' },
                ].map(({ role, label, icon: Icon, desc }) => (
                  <button
                    key={role}
                    type="button"
                    id={`role-${role.toLowerCase().replace('role_', '')}`}
                    onClick={() => setForm({ ...form, role })}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      form.role === role
                        ? 'border-primary-500/70 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${form.role === role ? 'text-primary-400' : 'text-white/40'}`} />
                    <p className={`font-semibold text-sm ${form.role === role ? 'text-white' : 'text-white/60'}`}>{label}</p>
                    <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="register-email">Email</label>
              <input
                id="register-email"
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
              <label className="label" htmlFor="register-password">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                type="password"
                className="input"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            {form.role === 'ROLE_ARTIST' && (
              <div>
                <label className="label" htmlFor="register-bio">Bio (optional)</label>
                <textarea
                  id="register-bio"
                  rows={3}
                  className="input resize-none"
                  placeholder="Tell collectors about yourself and your artistic style…"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account…</>
                : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
