import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'elms_user'

function readStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  async function login(username, password) {
    const response = await api.login({ Username: username, Password: password })

    if (!response.status) {
      return response
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data))
    setUser(response.data)
    return response
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
