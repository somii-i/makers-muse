import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Zap, Palette } from 'lucide-react'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types/index.js'

const CATEGORY_EMOJIS = {
  PORTRAITS: '🖼️', PHOTOGRAPHY: '📷', SCULPTURE_CERAMICS: '🏺',
  RESIN_ART: '✨', CROCHET_ART: '🧶', CANDLE: '🕯️', 
  JEWELERY: '💍', OTHERS: '🎨'
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero with background image */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-home.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-canvas-900/70 backdrop-blur-[2px]" />
        </div>

        <div className="page-container relative text-center">
          <div className="inline-flex items-center gap-2 badge-primary mb-8 text-sm py-1.5 px-4">
            <Sparkles className="w-3.5 h-3.5" />
            20 Art Categories · Global Artists · Instant Downloads
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[1.05] mb-6">
            Where Art Meets
            <br />
            <span className="gradient-text">Its Audience</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover extraordinary works from independent artists worldwide. 
            From oil paintings to AI-generated art — find your next masterpiece.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/gallery" id="hero-browse-btn" className="btn-primary text-base py-4 px-8">
              Browse Gallery <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register" id="hero-sell-btn" className="btn-secondary text-base py-4 px-8">
              Start Selling <Palette className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[['20+', 'Art Categories'], ['∞', 'Artworks'], ['100%', 'Secure Payments']].map(
              ([num, label]) => (
                <div key={label} className="text-center">
                  <p className="font-display font-bold text-3xl gradient-text">{num}</p>
                  <p className="text-white/40 text-sm mt-1">{label}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 border-t border-white/5">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Secure Payments',
                desc: 'Stripe-powered checkout with buyer protection on every purchase.',
                color: 'from-emerald-500 to-teal-500',
              },
              {
                icon: Zap,
                title: 'Instant Downloads',
                desc: 'Get time-limited secure download links for digital art immediately after purchase.',
                color: 'from-primary-500 to-cyan-500',
              },
              {
                icon: Palette,
                title: 'Artist-First',
                desc: 'Artists keep the majority of their revenue. No hidden fees.',
                color: 'from-amber-500 to-orange-500',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-8 space-y-4 hover:border-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-xl">{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore by Category</h2>
            <p className="text-white/40 mt-3">20 curated categories spanning every artistic medium</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/gallery?category=${cat}`}
                id={`home-category-${cat.toLowerCase()}`}
                className="card-hover p-4 text-center group flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
              >
                <span className="text-3xl">{CATEGORY_EMOJIS[cat] ?? '🖼️'}</span>
                <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors leading-tight">
                  {CATEGORY_LABELS[cat]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 border-t border-white/5">
        <div className="page-container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-900/60 to-canvas-700 border border-primary-500/20 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent pointer-events-none" />
            <h2 className="font-display font-black text-4xl text-white mb-4 relative">
              Are You an Artist?
            </h2>
            <p className="text-white/50 text-lg mb-8 relative max-w-xl mx-auto">
              Join thousands of artists selling their work globally. Upload your art and start earning today.
            </p>
            <Link to="/register" id="cta-artist-btn" className="btn-primary text-base py-4 px-10 relative">
              Start Selling Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
