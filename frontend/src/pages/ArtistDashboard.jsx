import { useState, useEffect } from 'react'
import { Plus, Grid, Trash2, Loader2, Package, RefreshCw } from 'lucide-react'
import ArtUploadForm from '../components/ArtUploadForm'
import { artworkService } from '../services/artworkService.js'
import { CATEGORY_LABELS } from '../types/index.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ArtistDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('upload')
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchArtworks = async () => {
    setLoading(true)
    try {
      const res = await artworkService.getMyArtworks()
      setArtworks(res.content)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'artworks') fetchArtworks()
  }, [tab])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this artwork?')) return
    setDeleting(id)
    try {
      await artworkService.deleteArtwork(id)
      setArtworks((prev) => prev.filter((a) => a.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-primary-400 text-sm font-medium mb-1">Artist Dashboard</p>
          <h1 className="section-title">Welcome, {user?.email?.split('@')[0]} 👋</h1>
          <p className="text-white/40 mt-2">Manage your portfolio and upload new artworks</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-canvas-800 border border-white/5 w-fit mb-8">
          {[
            { key: 'upload', label: 'Upload Artwork', icon: Plus },
            { key: 'artworks', label: 'My Artworks', icon: Grid },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`dashboard-tab-${key}`}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === key
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'upload' ? (
          <div className="card p-8">
            <h2 className="font-display font-bold text-xl text-white mb-6">Upload New Artwork</h2>
            <ArtUploadForm onSuccess={() => setTab('artworks')} />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">
                My Artworks
                <span className="ml-2 text-primary-400 text-base">({artworks.length})</span>
              </h2>
              <button onClick={fetchArtworks} className="btn-ghost text-sm">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              </div>
            ) : artworks.length === 0 ? (
              <div className="card p-16 text-center space-y-4">
                <Package className="w-16 h-16 text-white/10 mx-auto" />
                <p className="text-white/60">You haven't uploaded any artworks yet</p>
                <button onClick={() => setTab('upload')} className="btn-primary text-sm">
                  <Plus className="w-4 h-4" /> Upload Your First Artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {artworks.map((art) => (
                  <div key={art.id} className="card group overflow-hidden">
                    <div className="relative aspect-[4/3] bg-canvas-700 overflow-hidden">
                      <img
                        src={art.thumbnailUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        id={`delete-artwork-${art.id}`}
                        onClick={() => handleDelete(art.id)}
                        disabled={deleting === art.id}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Delete artwork"
                      >
                        {deleting === art.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-primary-400">{CATEGORY_LABELS[art.category]}</p>
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{art.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-white">₹{Number(art.price).toFixed(2)}</span>
                        <span className={`badge text-[10px] ${art.licenseType === 'DIGITAL_DOWNLOAD' ? 'badge-primary' : 'badge-warning'}`}>
                          {art.licenseType === 'DIGITAL_DOWNLOAD' ? 'Digital' : 'Print'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
