// ── Category Display Labels ───────────────────────────────────────────────────

export const CATEGORY_LABELS = {
  PORTRAITS:              'Portraits',
  PHOTOGRAPHY:            'Photography',
  SCULPTURE_CERAMICS:     'Sculpture & Ceramics',
  RESIN_ART:              'Resin Art',
  CROCHET_ART:            'Crochet Art',
  CANDLE:                 'Candles',
  JEWELERY:               'Jewelry',
  OTHERS:                 'Others'
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS)

// ── Image URL Helper ─────────────────────────────────────────────────────────
// Converts relative backend paths like /api/files/thumbnails/abc.jpg
// to absolute URLs pointing at the Render backend in production.
const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : ''

export function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url          // already absolute
  if (BACKEND_BASE) return BACKEND_BASE + url     // prepend Render domain
  return url                                       // local dev: relative is fine
}
