import { useAuth } from '../context/AuthContext.jsx'
import { getRole, valueOf } from '../utils/data.js'
import Badge from './Badge.jsx'
import Button from './Button.jsx'

function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="px-3 lg:hidden" onClick={onMenuClick}>
          ☰
        </Button>
        <div>
          <h2 className="text-base font-bold text-blue-600 sm:text-lg">Employee Leave Management System</h2>
          <p className="hidden text-xs text-gray-500 sm:block">ASP.NET Core API + React frontend</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-gray-900">{valueOf(user, 'Username', 'username')}</p>
          <Badge>{getRole(user)}</Badge>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
          {String(valueOf(user, 'Username', 'username') || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default Navbar
