import { useEffect, useMemo, useState } from 'react'
import AlertMessage from '../components/AlertMessage.jsx'
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
import { filterRows, formatDate, idOf, responseData, toDateInput, valueOf } from '../utils/data.js'

const emptyForm = { EmployeeID: 0, FullName: '', Email: '', Phone: '', DepartmentID: '', HireDate: '' }
const pageSize = 6

function Employees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
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
      const [employeeResponse, departmentResponse] = await Promise.all([api.getEmployees(0), api.getDepartments(0)])
      setEmployees(employeeResponse.status ? responseData(employeeResponse) : [])
      setDepartments(departmentResponse.status ? responseData(departmentResponse) : [])
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
      EmployeeID: idOf(row, 'EmployeeID'),
      FullName: valueOf(row, 'FullName', 'fullName'),
      Email: valueOf(row, 'Email', 'email'),
      Phone: valueOf(row, 'Phone', 'phone'),
      DepartmentID: valueOf(row, 'DepartmentID', 'departmentID'),
      HireDate: toDateInput(valueOf(row, 'HireDate', 'hireDate')),
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
    if (!form.FullName.trim()) nextErrors.FullName = 'Full name is required'
    if (!form.Email.trim()) nextErrors.Email = 'Email is required'
    if (form.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) nextErrors.Email = 'Enter a valid email address'
    if (!form.DepartmentID) nextErrors.DepartmentID = 'Department is required'
    if (!form.HireDate) nextErrors.HireDate = 'Hire date is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = { ...form, DepartmentID: Number(form.DepartmentID) }

    try {
      const response = editing ? await api.updateEmployee(payload) : await api.addEmployee(payload)
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
      const response = await api.deleteEmployee(deleteId)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      setDeleteId(null)
      if (response.status) loadPageData()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => filterRows(employees, search, ['FullName', 'Email', 'Phone', 'DepartmentName']), [employees, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { header: 'ID', render: (row) => idOf(row, 'EmployeeID') },
    { header: 'Full Name', render: (row) => valueOf(row, 'FullName', 'fullName') },
    { header: 'Email', render: (row) => valueOf(row, 'Email', 'email') },
    { header: 'Phone', render: (row) => valueOf(row, 'Phone', 'phone') || '-' },
    { header: 'Department', render: (row) => valueOf(row, 'DepartmentName', 'departmentName') || '-' },
    { header: 'Hire Date', render: (row) => formatDate(valueOf(row, 'HireDate', 'hireDate')) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" className="px-3 py-1" onClick={() => openEditModal(row)}>Edit</Button>
          <Button variant="danger" className="px-3 py-1" onClick={() => setDeleteId(idOf(row, 'EmployeeID'))}>Delete</Button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner text="Loading employees..." />

  return (
    <div>
      <PageHeader title="Employees" description="Manage employee records and connect them to departments." buttonText="Add Employee" onButtonClick={openAddModal} />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search employees..." />
        <p className="text-sm text-gray-500">Total: {filtered.length}</p>
      </div>

      <DataTable columns={columns} rows={visibleRows} getRowKey={(row) => idOf(row, 'EmployeeID')} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} title={editing ? 'Update Employee' : 'Add Employee'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Full Name" value={form.FullName} onChange={(event) => updateField('FullName', event.target.value)} error={errors.FullName} />
          <FormInput label="Email" value={form.Email} onChange={(event) => updateField('Email', event.target.value)} error={errors.Email} />
          <FormInput label="Phone" value={form.Phone} onChange={(event) => updateField('Phone', event.target.value)} />
          <SelectInput label="Department" value={form.DepartmentID} onChange={(event) => updateField('DepartmentID', event.target.value)} error={errors.DepartmentID}>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={idOf(department, 'DepartmentID')} value={idOf(department, 'DepartmentID')}>
                {valueOf(department, 'DepartmentName', 'departmentName')}
              </option>
            ))}
          </SelectInput>
          <FormInput label="Hire Date" type="date" value={form.HireDate} onChange={(event) => updateField('HireDate', event.target.value)} error={errors.HireDate} />
          <div className="flex items-end justify-end gap-3 sm:col-span-2">
            <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteId)} message="Are you sure you want to delete this employee?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default Employees
