function AlertMessage({ message, type = 'success', onClose }) {
  if (!message) return null

  const style = type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'

  return (
    <div className={`mb-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium ${style}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-4 text-lg leading-none">
          ×
        </button>
      )}
    </div>
  )
}

export default AlertMessage
