import { useEffect, useMemo, useState } from 'react'
import AlertMessage from '../components/AlertMessage.jsx'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DataTable from '../components/DataTable.jsx'
import FormInput from '../components/FormInput.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import Modal from '../components/Modal.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchBox from '../components/SearchBox.jsx'
import SelectInput from '../components/SelectInput.jsx'
import { api } from '../services/api.js'
import { filterRows, idOf, responseData, valueOf } from '../utils/data.js'
import { roles } from '../utils/roles.js'

const emptyForm = { UserID: 0, Username: '', Password: '', Role: '', EmployeeID: '' }
const pageSize = 6

function Users() {
  const [users, setUsers] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editing, setEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
    try {
      setLoading(true)
      const [userResponse, employeeResponse] = await Promise.all([api.getUsers(0), api.getEmployees(0)])
      setUsers(userResponse.status ? responseData(userResponse) : [])
      setEmployees(employeeResponse.status ? responseData(employeeResponse) : [])
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setForm(emptyForm)
    setErrors({})
    setEditing(false)
    setModalOpen(true)
  }

  function openEditModal(row) {
    setForm({
      UserID: idOf(row, 'UserID'),
      Username: valueOf(row, 'Username', 'username'),
      Password: valueOf(row, 'Password', 'password'),
      Role: valueOf(row, 'Role', 'role'),
      EmployeeID: valueOf(row, 'EmployeeID', 'employeeID') || '',
    })
    setErrors({})
    setEditing(true)
    setModalOpen(true)
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.Username.trim()) nextErrors.Username = 'Username is required'
    if (!form.Password.trim()) nextErrors.Password = 'Password is required'
    if (!form.Role) nextErrors.Role = 'Role is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = { ...form, EmployeeID: form.EmployeeID ? Number(form.EmployeeID) : null }

    try {
      const response = editing ? await api.updateUser(payload) : await api.addUser(payload)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      if (response.status) {
        setModalOpen(false)
        loadPageData()
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  async function confirmDelete() {
    try {
      const response = await api.deleteUser(deleteId)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      setDeleteId(null)
      if (response.status) loadPageData()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => filterRows(users, search, ['Username', 'Role', 'EmployeeName']), [users, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { header: 'ID', render: (row) => idOf(row, 'UserID') },
    { header: 'Username', render: (row) => valueOf(row, 'Username', 'username') },
    { header: 'Role', render: (row) => <Badge>{valueOf(row, 'Role', 'role')}</Badge> },
    { header: 'Employee', render: (row) => valueOf(row, 'EmployeeName', 'employeeName') || '-' },
    { header: 'Password', render: () => '••••••' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" className="px-3 py-1" onClick={() => openEditModal(row)}>Edit</Button>
          <Button variant="danger" className="px-3 py-1" onClick={() => setDeleteId(idOf(row, 'UserID'))}>Delete</Button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner text="Loading users..." />

  return (
    <div>
      <PageHeader title="Users" description="Manage login accounts and roles." buttonText="Add User" onButtonClick={openAddModal} />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search users..." />
        <p className="text-sm text-gray-500">Total: {filtered.length}</p>
      </div>

      <DataTable columns={columns} rows={visibleRows} getRowKey={(row) => idOf(row, 'UserID')} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} title={editing ? 'Update User' : 'Add User'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Username" value={form.Username} onChange={(event) => updateField('Username', event.target.value)} error={errors.Username} />
          <FormInput label="Password" type="text" value={form.Password} onChange={(event) => updateField('Password', event.target.value)} error={errors.Password} />
          <SelectInput label="Role" value={form.Role} onChange={(event) => updateField('Role', event.target.value)} error={errors.Role}>
            <option value="">Select role</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </SelectInput>
          <SelectInput label="Employee" value={form.EmployeeID} onChange={(event) => updateField('EmployeeID', event.target.value)}>
            <option value="">No linked employee</option>
            {employees.map((employee) => (
              <option key={idOf(employee, 'EmployeeID')} value={idOf(employee, 'EmployeeID')}>
                {valueOf(employee, 'FullName', 'fullName')}
              </option>
            ))}
          </SelectInput>
          <div className="flex items-end justify-end gap-3 sm:col-span-2">
            <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteId)} message="Are you sure you want to delete this user?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default Users
