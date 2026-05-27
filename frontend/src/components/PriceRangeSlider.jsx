import { useState } from 'react'

export default function PriceRangeSlider({ min, max, value, onChange }) {
  const [localMin, setLocalMin] = useState(value[0])
  const [localMax, setLocalMax] = useState(value[1])

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), localMax - 1)
    setLocalMin(v)
    onChange([v, localMax])
  }

  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), localMin + 1)
    setLocalMax(v)
    onChange([localMin, v])
  }

  const minPct = ((localMin - min) / (max - min)) * 100
  const maxPct = ((localMax - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">Price Range</span>
        <span className="text-primary-400 font-semibold">
          ₹{localMin.toLocaleString('en-IN')} — ₹{localMax === max ? `${max.toLocaleString('en-IN')}+` : localMax.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2 rounded-full bg-canvas-600">
        {/* Active range */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        {/* Min thumb */}
        <input
          id="price-range-min"
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={handleMinChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: localMin > max - 100 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          id="price-range-max"
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* Visual thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-lg shadow-primary-500/40 pointer-events-none"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-lg shadow-primary-500/40 pointer-events-none"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>
    </div>
  )
}
