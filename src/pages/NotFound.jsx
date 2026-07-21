import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-5xl font-bold text-blue-600">404</h1>
        <p className="mt-3 text-lg font-semibold text-gray-900">Page not found</p>
        <p className="mt-1 text-sm text-gray-500">The page you opened does not exist.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
