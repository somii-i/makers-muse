import { useState } from 'react'
import { Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'
import apiClient from '../api/axiosClient.js'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await apiClient.post('/contact', form)
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Failed to send message. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden mb-12">
        <img
          src="/hero-contact.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full mb-6 text-sm py-1.5 px-4">
            <Mail className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            We'd Love to Hear <br />From You
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Have a question about an order, need help setting up your shop, or just want to say hi?
          </p>
        </div>
      </section>

      <div className="page-container max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail,    title: 'Email',       value: 'hello@makersmuse.com',    sub: 'We reply within 24 hours' },
              { icon: MapPin,  title: 'Based In',    value: 'Global 🌍',               sub: 'Remote-first team' },
              { icon: Clock,   title: 'Support Hours', value: 'Mon–Fri, 9am–6pm IST',  sub: 'AI chatbot available 24/7' },
            ].map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">{title}</p>
                  <p className="text-white font-medium mt-0.5">{value}</p>
                  <p className="text-white/30 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Message Sent!</h3>
                <p className="text-white/50">We'll get back to you within 24 hours. Check your email for a confirmation.</p>
                <button onClick={() => setSuccess(false)} className="btn-ghost text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="contact-name">Full Name *</label>
                    <input id="contact-name" type="text" className="input" placeholder="John Doe" required
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">Email *</label>
                    <input id="contact-email" type="email" className="input" placeholder="you@example.com" required
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="contact-subject">Subject *</label>
                  <input id="contact-subject" type="text" className="input" placeholder="What's this about?" required
                    value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="contact-message">Message *</label>
                  <textarea id="contact-message" rows={6} className="input resize-none" placeholder="Tell us how we can help…" required
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button id="contact-submit-btn" type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
