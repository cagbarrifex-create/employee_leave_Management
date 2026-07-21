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
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'
import { filterRows, formatDate, getEmployeeId, getRole, getUserId, idOf, responseData, toDateInput, valueOf } from '../utils/data.js'

const emptyForm = { LeaveRequestID: 0, EmployeeID: '', LeaveTypeID: '', StartDate: '', EndDate: '', Reason: '' }
const pageSize = 6

function LeaveRequests() {
  const { user } = useAuth()
  const role = getRole(user)
  const loggedEmployeeId = getEmployeeId(user)
  const loggedUserId = getUserId(user)
  const canApprove = role === 'Admin' || role === 'Manager'
  const isEmployee = role === 'Employee'

  const [leaveRequests, setLeaveRequests] = useState([])
  const [employees, setEmployees] = useState([])
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
    loadPageData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPageData() {
    try {
      setLoading(true)
      const leavePromise = isEmployee && loggedEmployeeId ? api.getLeaveRequestsByEmployee(loggedEmployeeId) : api.getLeaveRequests(0)
      const [leaveResponse, employeeResponse, leaveTypeResponse] = await Promise.all([leavePromise, api.getEmployees(0), api.getLeaveTypes(0)])
      setLeaveRequests(leaveResponse.status ? responseData(leaveResponse) : [])
      setEmployees(employeeResponse.status ? responseData(employeeResponse) : [])
      setLeaveTypes(leaveTypeResponse.status ? responseData(leaveTypeResponse) : [])
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setForm({ ...emptyForm, EmployeeID: isEmployee ? loggedEmployeeId : '' })
    setErrors({})
    setEditing(false)
    setModalOpen(true)
  }

  function openEditModal(row) {
    setForm({
      LeaveRequestID: idOf(row, 'LeaveRequestID'),
      EmployeeID: valueOf(row, 'EmployeeID', 'employeeID'),
      LeaveTypeID: valueOf(row, 'LeaveTypeID', 'leaveTypeID'),
      StartDate: toDateInput(valueOf(row, 'StartDate', 'startDate')),
      EndDate: toDateInput(valueOf(row, 'EndDate', 'endDate')),
      Reason: valueOf(row, 'Reason', 'reason'),
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
    if (!form.EmployeeID) nextErrors.EmployeeID = 'Employee is required'
    if (!form.LeaveTypeID) nextErrors.LeaveTypeID = 'Leave type is required'
    if (!form.StartDate) nextErrors.StartDate = 'Start date is required'
    if (!form.EndDate) nextErrors.EndDate = 'End date is required'
    if (form.StartDate && form.EndDate && form.EndDate < form.StartDate) nextErrors.EndDate = 'End date cannot be before start date'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = {
      ...form,
      EmployeeID: Number(form.EmployeeID),
      LeaveTypeID: Number(form.LeaveTypeID),
    }

    try {
      const response = editing ? await api.updateLeaveRequest(payload) : await api.applyLeave(payload)
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
      const response = await api.deleteLeaveRequest(deleteId)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      setDeleteId(null)
      if (response.status) loadPageData()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
      setDeleteId(null)
    }
  }

  async function decideLeave(row, decision) {
    try {
      const payload = { LeaveRequestID: idOf(row, 'LeaveRequestID'), ApprovedBy: Number(loggedUserId) }
      const response = decision === 'approve' ? await api.approveLeave(payload) : await api.rejectLeave(payload)
      setAlert({ type: response.status ? 'success' : 'error', message: response.message })
      if (response.status) loadPageData()
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  const filtered = useMemo(
    () => filterRows(leaveRequests, search, ['EmployeeName', 'DepartmentName', 'LeaveTypeName', 'Status', 'Reason']),
    [leaveRequests, search],
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    { header: 'ID', render: (row) => idOf(row, 'LeaveRequestID') },
    { header: 'Employee', render: (row) => valueOf(row, 'EmployeeName', 'employeeName') },
    { header: 'Leave Type', render: (row) => valueOf(row, 'LeaveTypeName', 'leaveTypeName') },
    { header: 'From', render: (row) => formatDate(valueOf(row, 'StartDate', 'startDate')) },
    { header: 'To', render: (row) => formatDate(valueOf(row, 'EndDate', 'endDate')) },
    { header: 'Status', render: (row) => <Badge>{valueOf(row, 'Status', 'status')}</Badge> },
    {
      header: 'Actions',
      render: (row) => {
        const status = valueOf(row, 'Status', 'status')
        return (
          <div className="flex flex-wrap gap-2">
            {status === 'Pending' && (
              <Button variant="outline" className="px-3 py-1" onClick={() => openEditModal(row)}>Edit</Button>
            )}
            {canApprove && status === 'Pending' && (
              <>
                <Button variant="success" className="px-3 py-1" onClick={() => decideLeave(row, 'approve')}>Approve</Button>
                <Button variant="warning" className="px-3 py-1" onClick={() => decideLeave(row, 'reject')}>Reject</Button>
              </>
            )}
            <Button variant="danger" className="px-3 py-1" onClick={() => setDeleteId(idOf(row, 'LeaveRequestID'))}>Delete</Button>
          </div>
        )
      },
    },
  ]

  if (loading) return <LoadingSpinner text="Loading leave requests..." />

  return (
    <div>
      <PageHeader title="Leave Requests" description="Apply, update, approve, reject, and delete leave requests." buttonText="Apply Leave" onButtonClick={openAddModal} />
      <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search leave requests..." />
        <p className="text-sm text-gray-500">Total: {filtered.length}</p>
      </div>

      <DataTable columns={columns} rows={visibleRows} getRowKey={(row) => idOf(row, 'LeaveRequestID')} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal open={modalOpen} title={editing ? 'Update Leave Request' : 'Apply Leave'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <SelectInput label="Employee" value={form.EmployeeID} disabled={isEmployee} onChange={(event) => updateField('EmployeeID', event.target.value)} error={errors.EmployeeID}>
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={idOf(employee, 'EmployeeID')} value={idOf(employee, 'EmployeeID')}>
                {valueOf(employee, 'FullName', 'fullName')}
              </option>
            ))}
          </SelectInput>
          <SelectInput label="Leave Type" value={form.LeaveTypeID} onChange={(event) => updateField('LeaveTypeID', event.target.value)} error={errors.LeaveTypeID}>
            <option value="">Select leave type</option>
            {leaveTypes.map((leaveType) => (
              <option key={idOf(leaveType, 'LeaveTypeID')} value={idOf(leaveType, 'LeaveTypeID')}>
                {valueOf(leaveType, 'LeaveTypeName', 'leaveTypeName')}
              </option>
            ))}
          </SelectInput>
          <FormInput label="Start Date" type="date" value={form.StartDate} onChange={(event) => updateField('StartDate', event.target.value)} error={errors.StartDate} />
          <FormInput label="End Date" type="date" value={form.EndDate} onChange={(event) => updateField('EndDate', event.target.value)} error={errors.EndDate} />
          <FormInput className="sm:col-span-2" label="Reason" value={form.Reason} onChange={(event) => updateField('Reason', event.target.value)} />
          <div className="flex items-end justify-end gap-3 sm:col-span-2">
            <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Apply'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteId)} message="Are you sure you want to delete this leave request?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default LeaveRequests
