import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage.jsx'
import Button from '../components/Button.jsx'
import FormInput from '../components/FormInput.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.username.trim()) nextErrors.username = 'Username is required'
    if (!form.password.trim()) nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    if (!validate()) return

    try {
      setLoading(true)
      const response = await login(form.username, form.password)
      if (response.status) {
        navigate('/dashboard', { replace: true })
      } else {
        setMessage(response.message || 'Invalid username or password')
      }
    } catch (error) {
      setMessage(error.message || 'Could not connect to the backend API')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-blue-600 p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">✓</div>
              <h1 className="text-4xl font-bold leading-tight">Employee Leave Management System</h1>
              <p className="mt-4 text-blue-100">Manage users, employees, departments, leave types, and leave requests from one clean dashboard.</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 text-sm text-blue-50">
              <p className="font-semibold">Test accounts from SQL seed data:</p>
              <p className="mt-2">admin / admin123</p>
              <p>manager / manager123</p>
              <p>employee / employee123</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600">✓</div>
            <h1 className="text-2xl font-bold text-gray-900">ELMS</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          <p className="mt-2 text-sm text-gray-500">Use your username and password from the Users table.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <AlertMessage message={message} type="error" onClose={() => setMessage('')} />
            <FormInput label="Username" value={form.username} onChange={(event) => updateField('username', event.target.value)} error={errors.username} />
            <FormInput label="Password" type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} error={errors.password} />
            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? 'Checking...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
