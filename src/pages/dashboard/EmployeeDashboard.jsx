import { Wallet, Clock, Palmtree, Bell } from 'lucide-react'
import { DashboardShell } from '../../components/DashboardShell'

const EmployeeDashboard = () => {
	return (
		<DashboardShell
			role="EMPLOYEE"
			endpoint="/employee/dashboard"
			description="View your payroll, timesheets, and company announcements."
			cards={[
				{ title: 'Payslips', text: 'Latest payslip issued July 1.', icon: Wallet },
				{ title: 'Timesheet', text: '38.5 hours logged this week.', icon: Clock },
				{ title: 'Leave Balance', text: '12 days remaining this year.', icon: Palmtree },
				{ title: 'Announcements', text: '2 unread company updates.', icon: Bell },
			]}
		/>
	)
}

export default EmployeeDashboard;
