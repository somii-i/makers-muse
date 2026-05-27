import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, KeyRound, CheckCircle } from 'lucide-react'
import apiClient from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ForgotPasswordPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendOtp = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      await apiClient.post('/auth/forgot-password', { email })
      setStep('otp')
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await apiClient.post('/auth/reset-password', {
        email, otp, newPassword
      })
      login({ token: res.data.token, email, role: res.data.role, userId: res.data.userId, artistProfileId: res.data.artistProfileId })
      setStep('done')
      setTimeout(() => navigate('/'), 2000)
    } catch { setError('Invalid or expired OTP. Please request a new code.') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="w-full max-w-md animate-slide-up relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/30">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Reset Password</h1>
          <p className="text-white/40 mt-2">
            {step === 'email' ? "Enter your email to receive a reset code"
              : step === 'otp' ? "Enter the 6-digit code sent to your email"
              : step === 'reset' ? "Choose a new password"
              : "Password reset successfully!"}
          </p>
        </div>

        {step === 'done' ? (
          <div className="card p-10 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-white font-semibold">Password changed!</p>
            <p className="text-white/40 text-sm">Redirecting you to the homepage…</p>
          </div>
        ) : (
          <div className="card p-8">
            {step === 'email' && (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label className="label" htmlFor="forgot-email">Email Address</label>
                  <input id="forgot-email" type="email" className="input" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button id="send-otp-btn" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</> : 'Send Reset Code'}
                </button>
              </form>
            )}
            {step === 'otp' && (
              <form onSubmit={(e) => { e.preventDefault(); setStep('reset') }} className="space-y-5">
                <div>
                  <label className="label" htmlFor="otp-input">6-Digit Code</label>
                  <input id="otp-input" type="text" className="input text-center text-2xl tracking-[0.5em] font-mono" 
                    placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
                  <p className="text-white/30 text-xs mt-2">Sent to {email} · Check your spam folder if not received</p>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button id="verify-otp-btn" type="submit" disabled={otp.length !== 6} className="btn-primary w-full justify-center py-3.5">
                  Verify Code
                </button>
                <button type="button" onClick={() => { setStep('email'); setOtp('') }} className="btn-ghost w-full justify-center text-sm">
                  ← Back
                </button>
              </form>
            )}
            {step === 'reset' && (
              <form onSubmit={resetPassword} className="space-y-5">
                <div>
                  <label className="label" htmlFor="new-password">New Password</label>
                  <div className="relative">
                    <input id="new-password" type={showPw ? 'text' : 'password'} className="input pr-12"
                      placeholder="Min. 8 characters" value={newPassword}
                      onChange={e => setNewPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button id="reset-password-btn" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</> : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}

        <p className="text-center text-white/40 text-sm mt-6">
          Remember your password? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
        </p>
      </div>
    </main>
  )
}
