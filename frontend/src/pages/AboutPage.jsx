import { Palette, Heart, Globe, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  const team = [
    { name: 'Alex Rivera', role: 'Co-Founder & CEO', emoji: '🧑‍💼', bio: 'Former art director with a passion for empowering independent artists.' },
    { name: 'Priya Nair',  role: 'Head of Product',  emoji: '👩‍💻', bio: 'Product designer obsessed with creating seamless buyer experiences.' },
    { name: 'Kai Chen',    role: 'Lead Engineer',    emoji: '🧑‍🔬', bio: 'Full-stack engineer and hobbyist painter who bridges art and tech.' },
    { name: 'Sofia Torres', role: 'Community Lead',  emoji: '👩‍🎨', bio: 'Artist advocate who curates featured collections every week.' },
  ]

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src="/hero-about.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full mb-6 text-sm py-1.5 px-4">
            <Heart className="w-3.5 h-3.5" /> Our Story
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-4">
            Built for Artists, <br />By Art Lovers
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Makers Muse was born from a simple belief: every artist deserves a beautiful place to share their work.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-white/5">
        <div className="page-container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: 'Our Mission', color: 'from-primary-500 to-cyan-500',
                text: 'To create the most artist-friendly marketplace on the internet, where creators keep the majority of what they earn and buyers find truly unique art.' },
              { icon: Globe,   title: 'Global Reach', color: 'from-emerald-500 to-teal-500',
                text: 'Connecting artists and collectors from over 50 countries, spanning 20 art categories from oil paintings to AI-generated masterpieces.' },
              { icon: Users,   title: 'Community', color: 'from-amber-500 to-orange-500',
                text: 'A growing community of 10,000+ artists and collectors who believe that supporting independent art matters — one purchase at a time.' },
            ].map(({ icon: Icon, title, color, text }) => (
              <div key={title} className="card p-8 space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-white/5">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the Team</h2>
            <p className="text-white/40 mt-3">The people who make Makers Muse possible</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map(({ name, role, emoji, bio }) => (
              <div key={name} className="card p-6 text-center space-y-3 hover:border-primary-500/20 transition-colors">
                <span className="text-5xl">{emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-white">{name}</h3>
                  <p className="text-primary-400 text-xs mt-0.5">{role}</p>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="page-container text-center">
          <h2 className="section-title mb-4">Join Our Community</h2>
          <p className="text-white/40 mb-8 max-w-xl mx-auto">
            Whether you create or collect, there's a place for you on Makers Muse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">Start Selling <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/gallery"  className="btn-secondary">Explore Gallery</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
