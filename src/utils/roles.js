export const roles = ['Admin', 'Manager', 'Employee']

export function canManage(role, moduleName) {
  if (role === 'Admin') return true
  if (role === 'Manager') return ['Employees', 'LeaveRequests'].includes(moduleName)
  if (role === 'Employee') return ['LeaveRequests'].includes(moduleName)
  return false
}
