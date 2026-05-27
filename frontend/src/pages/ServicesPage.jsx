import { Shield, Download, Search, Star, Palette, Zap, Globe, CreditCard, Bot, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ServicesPage() {
  const buyerServices = [
    { icon: Search,    title: 'Advanced Discovery',    desc: 'Search across 20 art categories with keyword, price range, and style filters. Our AI chatbot also helps you describe what you\'re looking for.' },
    { icon: Shield,    title: 'Buyer Protection',       desc: 'Every purchase is secured by Stripe. If something goes wrong, we\'ve got you covered.' },
    { icon: Download,  title: 'Instant Digital Downloads', desc: 'Purchase digital art and get a secure download link immediately — valid for 24 hours with up to 3 downloads.' },
    { icon: Star,      title: 'Verified Reviews',        desc: 'Read authentic reviews from verified buyers before purchasing. Rate and review your own purchases too.' },
  ]

  const sellerServices = [
    { icon: Palette,   title: 'Beautiful Storefront',    desc: 'Your art is displayed in a polished gallery with automatic thumbnail generation and compression.' },
    { icon: CreditCard, title: 'Fast Payouts',           desc: 'Earnings tracked in real time. Stripe-powered payouts with transparent fee structure.' },
    { icon: Globe,     title: 'Global Audience',          desc: 'Reach collectors from around the world. Your art is discoverable by anyone, anywhere.' },
    { icon: Zap,       title: 'Simple Uploads',           desc: 'Upload your work in minutes with our drag-and-drop interface. We handle compression and storage automatically.' },
  ]

  const platformServices = [
    { icon: Bot,  title: 'AI Art Assistant',    desc: 'Muse AI is our built-in chatbot powered by Spring AI + OpenAI. It helps buyers find art and guides sellers through the platform 24/7.' },
    { icon: Lock, title: 'Enterprise Security',  desc: 'JWT authentication, BCrypt password hashing, S3 private storage, Stripe webhook signature verification — security at every layer.' },
  ]

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden mb-12">
        <img
          src="/hero-services.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            Our Services
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Everything you need — whether you create art or collect it.
          </p>
        </div>
      </section>

      <div className="page-container">

        {/* For Buyers */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">🛍</span>
            For Buyers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {buyerServices.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-5 hover:border-white/10 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* For Sellers */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-sm">🎨</span>
            For Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sellerServices.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-5 hover:border-white/10 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform */}
        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl text-white mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {platformServices.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-5 border-primary-500/10 hover:border-primary-500/20 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link to="/register" className="btn-primary text-base py-4 px-10">Get Started Free</Link>
        </div>
      </div>
    </main>
  )
}
