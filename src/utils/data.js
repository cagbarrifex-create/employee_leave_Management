export function valueOf(item, ...keys) {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null) {
      return item[key]
    }
  }
  return ''
}

export function idOf(item, name) {
  return valueOf(item, name, name.charAt(0).toLowerCase() + name.slice(1))
}

export function responseData(response) {
  if (Array.isArray(response?.data)) return response.data
  if (response?.data) return response.data
  return []
}

export function toDateInput(date) {
  if (!date) return ''
  return String(date).split('T')[0]
}

export function formatDate(date) {
  if (!date) return '-'
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return String(date).split('T')[0]
  return value.toLocaleDateString()
}

export function normalizeSearch(text) {
  return String(text || '').toLowerCase().trim()
}

export function filterRows(rows, search, fields) {
  const keyword = normalizeSearch(search)
  if (!keyword) return rows

  return rows.filter((row) =>
    fields.some((field) => String(valueOf(row, field, field.charAt(0).toLowerCase() + field.slice(1))).toLowerCase().includes(keyword)),
  )
}

export function getRole(user) {
  return valueOf(user, 'Role', 'role')
}

export function getUserId(user) {
  return valueOf(user, 'UserID', 'userID')
}

export function getEmployeeId(user) {
  return valueOf(user, 'EmployeeID', 'employeeID')
}
