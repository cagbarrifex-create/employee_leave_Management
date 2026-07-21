const styles = {
  Pending: 'bg-orange-100 text-orange-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Admin: 'bg-blue-100 text-blue-700',
  Manager: 'bg-purple-100 text-purple-700',
  Employee: 'bg-gray-100 text-gray-700',
}

function Badge({ children }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[children] || 'bg-gray-100 text-gray-700'}`}>{children}</span>
}

export default Badge
