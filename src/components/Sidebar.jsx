import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getRole } from '../utils/data.js'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['Admin', 'Manager', 'Employee'] },
  { path: '/users', label: 'Users', icon: '👥', roles: ['Admin'] },
  { path: '/departments', label: 'Departments', icon: '🏢', roles: ['Admin'] },
  { path: '/employees', label: 'Employees', icon: '🧑‍💼', roles: ['Admin', 'Manager'] },
  { path: '/leave-types', label: 'Leave Types', icon: '📋', roles: ['Admin'] },
  { path: '/leave-requests', label: 'Leave Requests', icon: '🗓️', roles: ['Admin', 'Manager', 'Employee'] },
  { path: '/change-password', label: 'Change Password', icon: '🔐', roles: ['Admin', 'Manager', 'Employee'] },
]

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const role = getRole(user)
  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-gray-900/40 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-blue-600 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">✓</div>
          <div>
            <h1 className="text-lg font-bold">ELMS</h1>
            <p className="text-xs text-blue-100">Leave Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-white/20 text-white shadow-sm' : 'text-blue-50 hover:bg-white/10'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-50 hover:bg-white/10">
            <span>↩</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
