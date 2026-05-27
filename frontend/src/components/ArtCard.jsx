import { ShoppingCart, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS } from '../types/index.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ArtCard({ artwork }) {
  const { addItem, isInCart } = useCart()
  const { isCustomer } = useAuth()
  const inCart = isInCart(artwork.id)

  return (
    <article className="card-hover group overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <Link to={`/artworks/${artwork.id}`} className="relative block overflow-hidden aspect-[4/3] bg-canvas-700">
        <img
          src={artwork.thumbnailUrl}
          alt={artwork.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs text-white/80 flex items-center gap-1">
            <Eye className="w-3 h-3" /> View Details
          </span>
        </div>
        {/* License badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge text-[10px] ${artwork.licenseType === 'DIGITAL_DOWNLOAD' ? 'badge-primary' : 'badge-warning'}`}>
            {artwork.licenseType === 'DIGITAL_DOWNLOAD' ? 'Digital' : 'Print'}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category */}
        <span className="text-xs text-primary-400 font-medium">
          {CATEGORY_LABELS[artwork.category]}
        </span>

        {/* Title */}
        <Link to={`/artworks/${artwork.id}`}>
          <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 hover:text-primary-300 transition-colors">
            {artwork.title}
          </h3>
        </Link>

        {/* Artist */}
        <p className="text-xs text-white/40 truncate">
          by {artwork.artistEmail.split('@')[0]}
        </p>

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display font-bold text-white text-lg">
            ₹{Number(artwork.price).toFixed(2)}
          </span>

          {isCustomer && (
            <button
              id={`add-to-cart-${artwork.id}`}
              onClick={(e) => {
                e.preventDefault()
                addItem(artwork)
              }}
              disabled={inCart}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                inCart
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 cursor-default'
                  : 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {inCart ? 'Added' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
