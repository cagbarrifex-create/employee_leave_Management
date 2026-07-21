import { useEffect, useState } from 'react'
import Badge from '../components/Badge.jsx'
import DataTable from '../components/DataTable.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { api } from '../services/api.js'
import { formatDate, idOf, responseData, valueOf } from '../utils/data.js'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recentLeaves, setRecentLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const [summaryResponse, leaveResponse] = await Promise.all([api.getDashboardSummary(), api.getLeaveRequests(0)])
      setSummary(summaryResponse.status ? summaryResponse.data : {})
      setRecentLeaves(responseData(leaveResponse).slice(0, 5))
    } catch {
      setSummary({})
      setRecentLeaves([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading dashboard..." />

  const cards = [
    { title: 'Total Employees', value: valueOf(summary, 'TotalEmployees', 'totalEmployees') || 0, icon: '👥', color: 'blue' },
    { title: 'Departments', value: valueOf(summary, 'TotalDepartments', 'totalDepartments') || 0, icon: '🏢', color: 'purple' },
    { title: 'Leave Types', value: valueOf(summary, 'TotalLeaveTypes', 'totalLeaveTypes') || 0, icon: '📋', color: 'green' },
    { title: 'Pending Leaves', value: valueOf(summary, 'PendingLeaves', 'pendingLeaves') || 0, icon: '⏳', color: 'orange' },
    { title: 'Approved Leaves', value: valueOf(summary, 'ApprovedLeaves', 'approvedLeaves') || 0, icon: '✅', color: 'green' },
    { title: 'Rejected Leaves', value: valueOf(summary, 'RejectedLeaves', 'rejectedLeaves') || 0, icon: '✖', color: 'red' },
  ]

  const columns = [
    { header: 'Employee', render: (row) => valueOf(row, 'EmployeeName', 'employeeName') },
    { header: 'Leave Type', render: (row) => valueOf(row, 'LeaveTypeName', 'leaveTypeName') },
    { header: 'From', render: (row) => formatDate(valueOf(row, 'StartDate', 'startDate')) },
    { header: 'To', render: (row) => formatDate(valueOf(row, 'EndDate', 'endDate')) },
    { header: 'Status', render: (row) => <Badge>{valueOf(row, 'Status', 'status')}</Badge> },
  ]

  return (
    <div>
      <PageHeader title="Dashboard" description="Summary of employees, departments, leave types, and leave requests." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-gray-900">Recent Leave Requests</h2>
        <DataTable columns={columns} rows={recentLeaves} getRowKey={(row) => idOf(row, 'LeaveRequestID')} />
      </div>
    </div>
  )
}

export default Dashboard
