import { useEffect, useState } from 'react'
import { Package, Download, Loader2, ShoppingBag } from 'lucide-react'
import { orderService } from '../services/orderService.js'
import apiClient from '../api/axiosClient.js'

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState(null)

  useEffect(() => {
    orderService.getMyOrders(0, 20)
      .then(res => setOrders(res.content))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (token) => {
    setDownloadLoading(Number(token.substring(0, 4)) || 0)
    try {
      const res = await apiClient.get(`/download/${token}`)
      window.open(res.data.downloadUrl, '_blank')
    } catch {
      alert('Download link expired. Please contact support.')
    } finally {
      setDownloadLoading(null)
    }
  }

  const completedOrders = orders.filter(o => o.paymentStatus === 'COMPLETED')
  const totalSpent = completedOrders.reduce((s, o) => s + Number(o.totalAmount), 0)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <p className="text-primary-400 text-sm font-medium mb-1">Buyer Dashboard</p>
          <h1 className="section-title">My Purchases</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: completedOrders.length },
            { label: 'Total Spent',  value: `₹${totalSpent.toFixed(2)}` },
            { label: 'Artworks',     value: completedOrders.reduce((s, o) => s + o.items.length, 0) },
          ].map(({ label, value }) => (
            <div key={label} className="card p-5 text-center">
              <p className="font-display font-bold text-2xl text-white">{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-primary-400 animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div className="card p-16 text-center space-y-4">
            <ShoppingBag className="w-14 h-14 text-white/10 mx-auto" />
            <p className="text-white/50">No purchases yet</p>
            <a href="/gallery" className="btn-primary text-sm inline-flex">Browse Gallery</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary-400" />
                    <h3 className="font-semibold text-white">Order #{order.id}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${order.paymentStatus === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus}
                    </span>
                    <span className="text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.itemId} className="flex items-center gap-4 p-3 rounded-xl bg-canvas-700/50">
                      <img src={item.thumbnailUrl} alt={item.artworkTitle}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm line-clamp-1">{item.artworkTitle}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          ₹{Number(item.purchasePrice).toFixed(2)} • {item.licenseType === 'DIGITAL' ? 'Digital Download' : 'Physical Print'}
                        </p>
                      </div>
                      {item.licenseType === 'DIGITAL' && order.paymentStatus === 'COMPLETED' && (
                        <a
                          href={`/download/${item.artworkId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary text-xs py-2 px-3 flex-shrink-0 flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-white/40 text-sm">Order Total</span>
                  <span className="font-bold text-white">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
