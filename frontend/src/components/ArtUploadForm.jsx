import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, Loader2, CheckCircle, X } from 'lucide-react'
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types/index.js'
import { artworkService } from '../services/artworkService.js'

export default function ArtUploadForm({ onSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    dimensions: '',
    category: '',
    licenseType: 'DIGITAL',
    stockCount: '1',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.size > 50 * 1024 * 1024) {
      setError('File must be under 50 MB')
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      handleFileChange({ target: { files: [dropped] } })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select an image file'); return }
    if (!form.category) { setError('Please select a category'); return }
    if (!form.title.trim()) { setError('Title is required'); return }

    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('dimensions', form.dimensions)
      formData.append('category', form.category)
      formData.append('licenseType', form.licenseType)
      formData.append('stockCount', form.stockCount)

      await artworkService.upload(formData)
      setSuccess(true)
      setFile(null)
      setPreview(null)
      setForm({ title: '', description: '', price: '', dimensions: '', category: '', licenseType: 'DIGITAL', stockCount: '1' })
      onSuccess?.()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-white/20 hover:border-primary-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group bg-canvas-700/50"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-white/40 mt-2">{file?.name} ({((file?.size || 0) / 1024 / 1024).toFixed(1)} MB)</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <Upload className="w-7 h-7 text-primary-400" />
            </div>
            <div>
              <p className="text-white font-medium">Drop your artwork here</p>
              <p className="text-white/40 text-sm mt-1">PNG, JPG, WEBP • Max 50 MB</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="artwork-file-input"
        />
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label" htmlFor="upload-title">Title *</label>
          <input
            id="upload-title"
            type="text"
            className="input"
            placeholder="Give your artwork a name"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="upload-description">Description</label>
          <textarea
            id="upload-description"
            rows={3}
            className="input resize-none"
            placeholder="Tell the story behind your artwork…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="upload-price">Price (INR) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">₹</span>
            <input
              id="upload-price"
              type="number"
              min="0.01"
              step="0.01"
              className="input pl-8"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="upload-dimensions">Dimensions</label>
          <input
            id="upload-dimensions"
            type="text"
            className="input"
            placeholder="e.g. 24×36 inches"
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="upload-category">Category *</label>
          <select
            id="upload-category"
            className="input bg-canvas-700 appearance-none"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="upload-license">License Type *</label>
          <select
            id="upload-license"
            className="input bg-canvas-700 appearance-none"
            value={form.licenseType}
            onChange={(e) => setForm({ ...form, licenseType: e.target.value })}
          >
            <option value="DIGITAL">Digital Download</option>
            <option value="PHYSICAL">Physical Print</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="upload-stock">Stock Count</label>
          <input
            id="upload-stock"
            type="number"
            min="1"
            className="input"
            value={form.stockCount}
            onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Artwork uploaded successfully!
        </div>
      )}

      <button
        id="upload-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Uploading…</>
        ) : (
          <><ImageIcon className="w-5 h-5" /> Publish Artwork</>
        )}
      </button>
    </form>
  )
}
