import EmptyState from './EmptyState.jsx'

function DataTable({ columns, rows, getRowKey }) {
  if (!rows.length) {
    return <EmptyState title="No records found" message="Try adding a new record or changing the search keyword." />
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="table-scroll overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 ${column.className || ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row, index) => (
              <tr key={getRowKey ? getRowKey(row) : index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-3 text-sm text-gray-700 ${column.cellClassName || ''}`}>
                    {column.render ? column.render(row, index) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
