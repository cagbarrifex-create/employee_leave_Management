const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7128/api'

async function request(path, options = {}) {
  const { method = 'GET', body } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(result?.message || 'API request failed')
  }

  return result
}

export const api = {
  login: (payload) => request('/Users/Login', { method: 'POST', body: payload }),
  changePassword: (payload) => request('/Users/ChangePassword', { method: 'PUT', body: payload }),

  getDashboardSummary: () => request('/Dashboard/Summary'),

  getUsers: (id = 0) => request(`/Users/${id}`),
  addUser: (payload) => request('/Users', { method: 'POST', body: payload }),
  updateUser: (payload) => request('/Users', { method: 'PUT', body: payload }),
  deleteUser: (id) => request(`/Users/${id}`, { method: 'DELETE' }),

  getDepartments: (id = 0) => request(`/Departments/${id}`),
  addDepartment: (payload) => request('/Departments', { method: 'POST', body: payload }),
  updateDepartment: (payload) => request('/Departments', { method: 'PUT', body: payload }),
  deleteDepartment: (id) => request(`/Departments/${id}`, { method: 'DELETE' }),

  getEmployees: (id = 0) => request(`/Employees/${id}`),
  searchEmployees: (text) => request(`/Employees/Search/${encodeURIComponent(text)}`),
  addEmployee: (payload) => request('/Employees', { method: 'POST', body: payload }),
  updateEmployee: (payload) => request('/Employees', { method: 'PUT', body: payload }),
  deleteEmployee: (id) => request(`/Employees/${id}`, { method: 'DELETE' }),

  getLeaveTypes: (id = 0) => request(`/LeaveTypes/${id}`),
  addLeaveType: (payload) => request('/LeaveTypes', { method: 'POST', body: payload }),
  updateLeaveType: (payload) => request('/LeaveTypes', { method: 'PUT', body: payload }),
  deleteLeaveType: (id) => request(`/LeaveTypes/${id}`, { method: 'DELETE' }),

  getLeaveRequests: (id = 0) => request(`/LeaveRequests/${id}`),
  getLeaveRequestsByEmployee: (employeeId) => request(`/LeaveRequests/Employee/${employeeId}`),
  applyLeave: (payload) => request('/LeaveRequests/Apply', { method: 'POST', body: payload }),
  updateLeaveRequest: (payload) => request('/LeaveRequests', { method: 'PUT', body: payload }),
  deleteLeaveRequest: (id) => request(`/LeaveRequests/${id}`, { method: 'DELETE' }),
  approveLeave: (payload) => request('/LeaveRequests/Approve', { method: 'PUT', body: payload }),
  rejectLeave: (payload) => request('/LeaveRequests/Reject', { method: 'PUT', body: payload }),
}

export default api
