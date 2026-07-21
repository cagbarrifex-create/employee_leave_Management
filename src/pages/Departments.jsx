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
import { api } from '../services/api.js'
import { filterRows, idOf, responseData, valueOf } from '../utils/data.js'

const emptyForm = { DepartmentID: 0, DepartmentName: '', Description: '' }
const pageSize = 6

function Departments() {
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
    loadDepartments()
  }, [])

  async function loadDepartments() {
    try {
      setLoading(true)
      const response = await api.getDepartments(0)
      setDepartments(response.status ? responseData(response) : [])
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
      DepartmentID: idOf(row, 'DepartmentID'),
      DepartmentName: valueOf(row, 'DepartmentName', 'departmentName'),
      Description: valueOf(row, 'Description', 'description'),
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
    if (!form.DepartmentName.trim()) nextErrors.DepartmentName = 'Department name is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    try {
      const response = editing ? await api.updateDepartment(form) : await api.addDepartment(form)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      if (response.status) {
        setModalOpen(false)
        loadDepartments()
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  async function confirmDelete() {
    try {
      const response = await api.deleteDepartment(deleteId)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      setDeleteId(null)
      if (response.status) loadDepartments()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => filterRows(departments, search, ['DepartmentName', 'Description']), [departments, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { header: 'ID', render: (row) => idOf(row, 'DepartmentID') },
    { header: 'Department Name', render: (row) => valueOf(row, 'DepartmentName', 'departmentName') },
    { header: 'Description', render: (row) => valueOf(row, 'Description', 'description') || '-' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" className="px-3 py-1" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button variant="danger" className="px-3 py-1" onClick={() => setDeleteId(idOf(row, 'DepartmentID'))}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner text="Loading departments..." />

  return (
    <div>
      <PageHeader title="Departments" description="Create, update, search, and delete departments." buttonText="Add Department" onButtonClick={openAddModal} />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search departments..." />
        <p className="text-sm text-gray-500">Total: {filtered.length}</p>
      </div>

      <DataTable columns={columns} rows={visibleRows} getRowKey={(row) => idOf(row, 'DepartmentID')} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} title={editing ? 'Update Department' : 'Add Department'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Department Name" value={form.DepartmentName} onChange={(event) => updateField('DepartmentName', event.target.value)} error={errors.DepartmentName} />
          <FormInput label="Description" value={form.Description} onChange={(event) => updateField('Description', event.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteId)} message="Are you sure you want to delete this department?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default Departments
