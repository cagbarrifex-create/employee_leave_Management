import Button from './Button.jsx'

function Modal({ open, title, children, onClose, maxWidth = 'max-w-2xl' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className={`w-full ${maxWidth} rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <Button variant="ghost" className="px-2 py-1 text-xl" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
