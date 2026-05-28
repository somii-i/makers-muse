import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Download, Maximize2, Loader2 } from 'lucide-react'
import { artworkService } from '../services/artworkService.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { CATEGORY_LABELS, getImageUrl } from '../types/index.js'

export default function ArtworkDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [zoomed, setZoomed] = useState(false)

  const { addItem, isInCart } = useCart()
  const { isCustomer } = useAuth()

  useEffect(() => {
    if (!id) return
    artworkService.getById(Number(id))
      .then(setArtwork)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-16">
        <p className="text-5xl">🖼️</p>
        <p className="text-white/60">Artwork not found</p>
        <button onClick={() => navigate('/gallery')} className="btn-secondary">Back to Gallery</button>
      </div>
    )
  }

  const inCart = isInCart(artwork.id)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn-ghost mb-8 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden bg-canvas-800 border border-white/5 cursor-zoom-in"
              onClick={() => setZoomed(true)}
            >
              <img
                src={getImageUrl(artwork.thumbnailUrl)}
                alt={artwork.title}
                className="w-full object-contain max-h-[600px]"
              />
              <button className="absolute top-4 right-4 btn-ghost bg-black/40 p-2 rounded-lg">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <span className="badge-primary">{CATEGORY_LABELS[artwork.category]}</span>

            {/* Title */}
            <h1 className="font-display font-black text-4xl text-white leading-tight">{artwork.title}</h1>

            {/* Artist */}
            <p className="text-white/40">
              by <span className="text-white/70 font-medium">{artwork.artistEmail.split('@')[0]}</span>
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <div className="font-display font-bold text-4xl text-white">
                ₹{Number(artwork.price).toFixed(2)}
              </div>
              <span className={`badge ${artwork.licenseType === 'DIGITAL' ? 'badge-primary' : 'badge-warning'}`}>
                {artwork.licenseType === 'DIGITAL' ? 'Digital Download' : 'Physical Print'}
              </span>
            </div>

            {/* Description */}
            {artwork.description && (
              <p className="text-white/60 leading-relaxed">{artwork.description}</p>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4">
              {artwork.dimensions && (
                <div className="card p-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Dimensions</p>
                  <p className="text-white font-medium">{artwork.dimensions}</p>
                </div>
              )}
              <div className="card p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Stock</p>
                <p className="text-white font-medium">
                  {artwork.stockCount > 0 ? `${artwork.stockCount} available` : 'Sold out'}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            {isCustomer && (
              <button
                id={`detail-add-to-cart-${artwork.id}`}
                onClick={() => addItem(artwork)}
                disabled={inCart || artwork.stockCount === 0}
                className={`btn-primary w-full justify-center text-base py-4 ${inCart ? 'opacity-60' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
            )}

            {artwork.licenseType === 'DIGITAL' && (
              <p className="text-xs text-white/30 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Secure download link provided after purchase (valid 30 minutes)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img
            src={getImageUrl(artwork.thumbnailUrl)}
            alt={artwork.title}
            className="max-w-full max-h-full rounded-2xl object-contain animate-fade-in"
          />
        </div>
      )}
    </main>
  )
}
