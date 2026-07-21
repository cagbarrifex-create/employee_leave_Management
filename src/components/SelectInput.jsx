function SelectInput({ label, error, children, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <select
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export default SelectInput
