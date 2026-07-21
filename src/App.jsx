import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Departments from './pages/Departments.jsx'
import Employees from './pages/Employees.jsx'
import LeaveRequests from './pages/LeaveRequests.jsx'
import LeaveTypes from './pages/LeaveTypes.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Users from './pages/Users.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route index element={<Users />} />
            </Route>
            <Route path="/departments" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route index element={<Departments />} />
            </Route>
            <Route path="/employees" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} />}>
              <Route index element={<Employees />} />
            </Route>
            <Route path="/leave-types" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route index element={<LeaveTypes />} />
            </Route>
            <Route path="/leave-requests" element={<LeaveRequests />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
