function StatCard({ title, value, icon, note, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
          {note && <p className="mt-2 text-xs font-semibold text-gray-500">{note}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  )
}

export default StatCard
