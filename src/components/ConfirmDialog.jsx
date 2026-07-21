import Button from './Button.jsx'
import Modal from './Modal.jsx'

function ConfirmDialog({ open, title = 'Confirm delete', message, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidth="max-w-md">
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
