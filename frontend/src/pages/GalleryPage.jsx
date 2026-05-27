import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import ArtCard from '../components/ArtCard'
import CategoryFilter from '../components/CategoryFilter'
import PriceRangeSlider from '../components/PriceRangeSlider'
import { artworkService } from '../services/artworkService.js'

const MAX_PRICE = 500000

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [artworks, setArtworks] = useState([])
  const [pageInfo, setPageInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter state
  const [keyword, setKeyword]     = useState(searchParams.get('keyword') ?? '')
  const [category, setCategory]   = useState(searchParams.get('category') ?? '')
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE])
  const [sort, setSort]             = useState('newest')
  const [page, setPage]             = useState(0)

  const fetchArtworks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await artworkService.search({
        keyword:  keyword || undefined,
        category: category || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
        sort,
        page,
        size: 12,
      })
      setArtworks(res.content)
      const { content: _, ...info } = res
      setPageInfo(info)
    } catch {
      setArtworks([])
    } finally {
      setLoading(false)
    }
  }, [keyword, category, priceRange, sort, page])

  useEffect(() => { fetchArtworks() }, [fetchArtworks])

  const handleKeywordSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchArtworks()
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(0)
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-72 overflow-hidden">
        <img
          src="/hero-gallery.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-3">
            Art Gallery
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            {pageInfo ? `${pageInfo.totalElements.toLocaleString()} artworks to explore` : 'Discovering artworks…'}
          </p>
        </div>
      </section>

      <div className="page-container py-10">

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleKeywordSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="gallery-search"
                type="text"
                placeholder="Search artworks, artists…"
                className="input pl-10"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" id="search-submit-btn" className="btn-primary py-3 px-5">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex gap-2">
            <select
              id="gallery-sort"
              className="input w-auto bg-canvas-700 appearance-none"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0) }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary py-3 px-4 ${showFilters ? 'border-primary-500/50 text-primary-400' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="card p-6 mb-6 space-y-6 animate-slide-up">
            <PriceRangeSlider
              min={0}
              max={MAX_PRICE}
              value={priceRange}
              onChange={(range) => { setPriceRange(range); setPage(0) }}
            />
            <div>
              <p className="label">Category</p>
              <div className="mt-2">
                <CategoryFilter selected={category} onChange={handleCategoryChange} />
              </div>
            </div>
          </div>
        )}

        {/* Category pills (always visible quick filter) */}
        <div className="mb-8 overflow-x-auto scrollbar-hide pb-2">
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <p className="text-5xl">🎨</p>
            <p className="text-white/60 text-lg">No artworks found</p>
            <p className="text-white/30 text-sm">Try different filters or search terms</p>
            <button
              onClick={() => { setKeyword(''); setCategory(''); setPriceRange([0, MAX_PRICE]); setPage(0) }}
              className="btn-ghost text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
            {artworks.map((art) => (
              <ArtCard key={art.id} artwork={art} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageInfo && pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              id="pagination-prev"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary py-2 px-4 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/50 text-sm">
              Page {page + 1} of {pageInfo.totalPages}
            </span>
            <button
              id="pagination-next"
              onClick={() => setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))}
              disabled={pageInfo.last}
              className="btn-secondary py-2 px-4 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
