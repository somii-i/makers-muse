import { Upload, ShoppingCart, Download, Search, Shield, Star, Zap, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HowItWorksPage() {
  const sellerSteps = [
    { step: '01', icon: Upload,        title: 'Create Your Account', desc: 'Sign up as a Seller in seconds. Set up your artist profile with a bio and portfolio.' },
    { step: '02', icon: Star,          title: 'Upload Your Art',     desc: 'Add your artwork with a title, description, price, and category. We handle thumbnail compression automatically.' },
    { step: '03', icon: ShoppingCart,  title: 'Start Earning',       desc: 'Buyers discover and purchase your work. Earnings are tracked in your dashboard in real time.' },
  ]

  const buyerSteps = [
    { step: '01', icon: Search,   title: 'Discover Art',       desc: 'Browse 20+ categories or use our AI-powered search to describe exactly what you\'re looking for.' },
    { step: '02', icon: Shield,   title: 'Secure Checkout',    desc: 'Purchase with confidence through Stripe-secured payments. Your card info is never stored on our servers.' },
    { step: '03', icon: Download, title: 'Instant Download',   desc: 'Digital purchases are available immediately — your secure download link arrives via email and in your dashboard.' },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 badge-primary mb-6 text-sm py-1.5 px-4">
            <Zap className="w-3.5 h-3.5" /> Simple. Fast. Secure.
          </div>
          <h1 className="section-title text-5xl mb-4">How Makers Muse Works</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From upload to download in minutes. Here's everything you need to know.
          </p>
        </div>

        {/* For Sellers */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">For Sellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sellerSteps.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-8 relative overflow-hidden group hover:border-primary-500/20 transition-colors">
                <span className="absolute top-4 right-6 font-display font-black text-6xl text-white/5 group-hover:text-white/8 transition-colors">{step}</span>
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/register" className="btn-primary">Start Selling Today</Link>
          </div>
        </section>

        {/* For Buyers */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">For Buyers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buyerSteps.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card p-8 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                <span className="absolute top-4 right-6 font-display font-black text-6xl text-white/5">{step}</span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/gallery" className="btn-primary">Browse the Gallery</Link>
          </div>
        </section>

        {/* AI Chatbot Callout */}
        <div className="card p-10 text-center border-primary-500/20 bg-gradient-to-br from-primary-900/30 to-canvas-700">
          <MessageCircle className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="font-display font-bold text-2xl text-white mb-3">Need Help? Ask Muse AI</h3>
          <p className="text-white/50 mb-6 max-w-lg mx-auto">
            Our AI assistant Muse is available 24/7 to help you find the perfect artwork, 
            answer questions, or guide you through selling. Just click the chat bubble! 💬
          </p>
          <p className="text-primary-400 text-sm font-medium">Look for the 💬 button in the bottom-right corner of any page.</p>
        </div>
      </div>
    </main>
  )
}
