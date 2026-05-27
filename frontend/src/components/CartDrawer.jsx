import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { orderService } from '../services/orderService.js'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, total, clearCart, itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      onClose()
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = items.map((i) => ({ artworkId: i.artwork.id, quantity: i.quantity }))
      const data = await orderService.checkout(payload)
      navigate(data.checkoutUrl)
      onClose()
    } catch (err) {
      setError('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        id="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-canvas-800 border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-primary-400" />
            <h2 className="font-display font-bold text-white text-lg">Your Cart</h2>
            {itemCount > 0 && (
              <span className="badge-primary">{itemCount}</span>
            )}
          </div>
          <button onClick={onClose} className="btn-ghost p-2" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart className="w-16 h-16 text-white/10" />
              <p className="text-white/40">Your cart is empty</p>
              <button onClick={onClose} className="btn-primary text-sm py-2 px-4">Browse Gallery</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.artwork.id} className="flex gap-4 card p-3">
                <img
                  src={item.artwork.thumbnailUrl}
                  alt={item.artwork.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white line-clamp-1">{item.artwork.title}</p>
                  <p className="text-xs text-white/40">
                    ₹{Number(item.artwork.price).toFixed(2)} each
                  </p>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="font-medium text-white text-sm">
                      ₹{(Number(item.artwork.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.artwork.id)}
                  className="btn-ghost p-1 h-fit text-red-400/60 hover:text-red-400"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total</span>
              <span className="font-bold text-lg text-white">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <button
              id="checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Checkout</>
              )}
            </button>
            <button
              onClick={clearCart}
              className="btn-ghost w-full justify-center text-xs text-white/40"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
