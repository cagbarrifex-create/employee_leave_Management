import { useState } from 'react'
import AlertMessage from '../components/AlertMessage.jsx'
import Button from '../components/Button.jsx'
import FormInput from '../components/FormInput.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { getUserId } from '../utils/data.js'

function ChangePassword() {
  const { user } = useAuth()
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.oldPassword.trim()) nextErrors.oldPassword = 'Old password is required'
    if (!form.newPassword.trim()) nextErrors.newPassword = 'New password is required'
    if (form.newPassword && form.newPassword.length < 4) nextErrors.newPassword = 'Password should be at least 4 characters'
    if (form.confirmPassword !== form.newPassword) nextErrors.confirmPassword = 'Passwords do not match'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      const response = await api.changePassword({
        UserID: Number(getUserId(user)),
        OldPassword: form.oldPassword,
        NewPassword: form.newPassword,
      })
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      if (response.status) setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Change Password" description="Update the password for your current user account." />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Old Password" type="password" value={form.oldPassword} onChange={(event) => updateField('oldPassword', event.target.value)} error={errors.oldPassword} />
          <FormInput label="New Password" type="password" value={form.newPassword} onChange={(event) => updateField('newPassword', event.target.value)} error={errors.newPassword} />
          <FormInput label="Confirm New Password" type="password" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} error={errors.confirmPassword} />
          <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Change Password'}</Button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
