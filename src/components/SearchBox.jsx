function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export default SearchBox
