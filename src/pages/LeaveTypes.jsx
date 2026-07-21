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

const emptyForm = { LeaveTypeID: 0, LeaveTypeName: '', MaxDays: '' }
const pageSize = 6

function LeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState([])
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
    loadLeaveTypes()
  }, [])

  async function loadLeaveTypes() {
    try {
      setLoading(true)
      const response = await api.getLeaveTypes(0)
      setLeaveTypes(response.status ? responseData(response) : [])
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
      LeaveTypeID: idOf(row, 'LeaveTypeID'),
      LeaveTypeName: valueOf(row, 'LeaveTypeName', 'leaveTypeName'),
      MaxDays: valueOf(row, 'MaxDays', 'maxDays'),
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
    if (!form.LeaveTypeName.trim()) nextErrors.LeaveTypeName = 'Leave type name is required'
    if (!form.MaxDays || Number(form.MaxDays) <= 0) nextErrors.MaxDays = 'Max days must be greater than zero'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = { ...form, MaxDays: Number(form.MaxDays) }

    try {
      const response = editing ? await api.updateLeaveType(payload) : await api.addLeaveType(payload)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      if (response.status) {
        setModalOpen(false)
        loadLeaveTypes()
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  async function confirmDelete() {
    try {
      const response = await api.deleteLeaveType(deleteId)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      setDeleteId(null)
      if (response.status) loadLeaveTypes()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setDeleteId(null)
    }
  }

  const filtered = useMemo(() => filterRows(leaveTypes, search, ['LeaveTypeName', 'MaxDays']), [leaveTypes, search])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { header: 'ID', render: (row) => idOf(row, 'LeaveTypeID') },
    { header: 'Leave Type', render: (row) => valueOf(row, 'LeaveTypeName', 'leaveTypeName') },
    { header: 'Max Days', render: (row) => valueOf(row, 'MaxDays', 'maxDays') },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" className="px-3 py-1" onClick={() => openEditModal(row)}>Edit</Button>
          <Button variant="danger" className="px-3 py-1" onClick={() => setDeleteId(idOf(row, 'LeaveTypeID'))}>Delete</Button>
        </div>
      ),
    },
  ]

  if (loading) return <LoadingSpinner text="Loading leave types..." />

  return (
    <div>
      <PageHeader title="Leave Types" description="Manage the allowed leave categories and maximum days." buttonText="Add Leave Type" onButtonClick={openAddModal} />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search leave types..." />
        <p className="text-sm text-gray-500">Total: {filtered.length}</p>
      </div>

      <DataTable columns={columns} rows={visibleRows} getRowKey={(row) => idOf(row, 'LeaveTypeID')} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} title={editing ? 'Update Leave Type' : 'Add Leave Type'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Leave Type Name" value={form.LeaveTypeName} onChange={(event) => updateField('LeaveTypeName', event.target.value)} error={errors.LeaveTypeName} />
          <FormInput label="Maximum Days" type="number" min="1" value={form.MaxDays} onChange={(event) => updateField('MaxDays', event.target.value)} error={errors.MaxDays} />
          <div className="flex justify-end gap-3">
            <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteId)} message="Are you sure you want to delete this leave type?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default LeaveTypes
