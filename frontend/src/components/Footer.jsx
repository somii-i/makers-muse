import { Link } from 'react-router-dom'
import { Palette, Twitter, Instagram, Github, Youtube, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import apiClient from '../api/axiosClient.js'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await apiClient.post('/newsletter/subscribe', { email })
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="border-t border-white/5 bg-canvas-800/50 mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">Makers Muse</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              The premier marketplace for independent artists and art collectors worldwide.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: Twitter,   href: '#', label: 'Twitter'   },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube,   href: '#', label: 'YouTube'   },
                { icon: Github,    href: '#', label: 'GitHub'    },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/gallery',      label: 'Browse Gallery' },
                { to: '/how-it-works', label: 'How It Works'  },
                { to: '/services',     label: 'Services'      },
                { to: '/about',        label: 'About Us'      },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/contact',         label: 'Contact Us'       },
                { to: '/register',        label: 'Start Selling'    },
                { to: '/gallery',         label: 'Discover Art'     },
                { to: '#',               label: 'Privacy Policy'   },
                { to: '#',               label: 'Terms of Service' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Stay Inspired</h3>
            <p className="text-white/40 text-sm">Get weekly featured art and seller tips delivered to your inbox.</p>
            {status === 'done' ? (
              <p className="text-emerald-400 text-sm">🎨 You're subscribed!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  className="input text-sm py-2.5"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {status === 'error' && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
                <button id="newsletter-subscribe-btn" type="submit" disabled={status === 'loading'}
                  className="btn-primary w-full justify-center text-sm py-2.5">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} Makers Muse. All rights reserved.</p>
          <p className="text-white/20 text-xs">Built with ❤️ for artists everywhere</p>
        </div>
      </div>
    </footer>
  )
}
