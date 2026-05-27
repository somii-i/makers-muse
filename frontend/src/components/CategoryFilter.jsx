import { ALL_CATEGORIES, CATEGORY_LABELS } from '../types/index.js'

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        id="category-all"
        onClick={() => onChange('')}
        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
          selected === ''
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
        }`}
      >
        All
      </button>

      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`category-${cat.toLowerCase()}`}
          onClick={() => onChange(selected === cat ? '' : cat)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
            selected === cat
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
