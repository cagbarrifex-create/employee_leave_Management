function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl bg-white p-8 text-gray-600 shadow-sm">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span className="ml-3 text-sm font-medium">{text}</span>
    </div>
  )
}

export default LoadingSpinner
