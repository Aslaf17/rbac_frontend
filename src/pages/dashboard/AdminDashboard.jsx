import { Users, ShieldCheck, Activity, FileClock } from 'lucide-react'
import { DashboardShell } from '../../components/DashboardShell'

const AdminDashboard = () => {
	return (
		<DashboardShell
			role="ADMIN"
			endpoint="/admin/dashboard"
			description="Manage users, assign roles, and configure system-wide settings."
			cards={[
				{ title: 'Total Users', text: '128 registered across all roles.', icon: Users },
				{ title: 'Role Assignment', text: "Promote or change a user's role.", icon: ShieldCheck },
				{ title: 'System Health', text: 'All services operational.', icon: Activity },
				{ title: 'Audit Log', text: '14 admin actions logged today.', icon: FileClock },
			]}
		/>
	)
}

export default AdminDashboard;
