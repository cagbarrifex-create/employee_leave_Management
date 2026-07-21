const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
  outline: 'bg-white text-blue-600 hover:bg-blue-50 border-blue-600',
  success: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  warning: 'bg-orange-500 text-white hover:bg-orange-600 border-orange-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent',
  light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200',
}

function Button({ children, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
