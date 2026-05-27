import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Loader2, ShoppingBag, Package } from 'lucide-react'
import { orderService } from '../services/orderService'

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState(null)

  useEffect(() => {
    orderService.getMyOrders(0, 5).then((res) => {
      setOrders(res.content)
    }).finally(() => setLoading(false))
  }, [])

  const handleDownload = async (orderId, itemId) => {
    setDownloadLoading(itemId)
    try {
      const { downloadUrl } = await orderService.getDownloadUrl(orderId, itemId)
      window.open(downloadUrl, '_blank')
    } catch {
      alert('Download link expired or unavailable. Please contact support.')
    } finally {
      setDownloadLoading(null)
    }
  }

  const latestOrder = orders[0]

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-2xl">
        {/* Success Banner */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="font-display font-black text-4xl text-white mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-white/50 text-lg">
            Your order is confirmed. Digital artworks are available for download below.
          </p>
          {sessionId && (
            <p className="text-xs text-white/20 mt-2 font-mono">Session: {sessionId.slice(0, 24)}…</p>
          )}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : latestOrder ? (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-primary-400" />
                <h2 className="font-display font-bold text-white text-lg">
                  Order #{latestOrder.id}
                </h2>
                <span className="badge-success ml-auto">
                  {latestOrder.paymentStatus}
                </span>
              </div>

              <div className="space-y-4">
                {latestOrder.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-canvas-700/50 border border-white/5"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.artworkTitle}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm line-clamp-1">{item.artworkTitle}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        ₹{Number(item.purchasePrice).toFixed(2)} • {item.licenseType === 'DIGITAL_DOWNLOAD' ? 'Digital Download' : 'Physical Print'}
                      </p>
                    </div>
                    {item.licenseType === 'DIGITAL_DOWNLOAD' && latestOrder.paymentStatus === 'COMPLETED' && (
                      <button
                        id={`download-item-${item.itemId}`}
                        onClick={() => handleDownload(latestOrder.id, item.itemId)}
                        disabled={downloadLoading === item.itemId}
                        className="btn-primary text-xs py-2 px-3 flex-shrink-0"
                      >
                        {downloadLoading === item.itemId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <><Download className="w-3.5 h-3.5" /> Download</>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <span className="text-white/50">Total Paid</span>
                <span className="font-display font-bold text-xl text-white">
                  ₹{Number(latestOrder.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/30 text-center">
              Download links are valid for 30 minutes. Return to this page to generate a new link.
            </p>
          </div>
        ) : (
          <div className="card p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-white/10 mx-auto" />
            <p className="text-white/40">Your order is being processed…</p>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Link to="/gallery" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </main>
  )
}
