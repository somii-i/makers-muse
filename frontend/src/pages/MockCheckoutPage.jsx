import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import apiClient from '../api/axiosClient.js'

export default function MockCheckoutPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const sessionId = searchParams.get('sessionId')
  const navigate = useNavigate()
  const { total, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Simulate payment completion
  const handleSimulatePayment = async () => {
    setLoading(true)
    setError('')
    try {
      // Hit the backend endpoint to mark order as complete
      await apiClient.post(`/orders/${orderId}/mock-success`)
      
      // Clear the cart
      clearCart()
      
      // Redirect to success page
      navigate(`/order/success?session_id=${sessionId}`)
    } catch (err) {
      setError('Failed to complete mock payment. Please try again.')
      setLoading(false)
    }
  }

  if (!orderId || !sessionId) {
    return (
      <div className="page-container pt-32 text-center text-white">
        <h2 className="text-2xl font-bold text-red-400">Invalid Checkout Link</h2>
        <p className="mt-2 text-white/60">Missing order ID or session ID.</p>
        <button onClick={() => navigate('/cart')} className="mt-6 btn-primary">Return to Cart</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="w-full max-w-md bg-canvas-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 text-center animate-fade-in-up relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-500/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10">
          <ShieldCheck className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-white mb-2">Secure Checkout</h1>
          <p className="text-white/60 text-sm mb-6">Scan the QR code below or click simulate payment to complete your order.</p>

          <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-6 shadow-lg">
            <img src="/upi-qr.png" alt="Scan to pay" className="w-48 h-48 object-contain" />
          </div>

          <div className="bg-canvas-700/50 rounded-xl p-4 mb-8">
            <p className="text-sm text-white/60 mb-1">Total Amount Due</p>
            <p className="font-display font-bold text-3xl text-white">₹{total > 0 ? total.toFixed(2) : "0.00"}</p>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSimulatePayment}
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-lg group"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 
                Simulate Payment Success
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
