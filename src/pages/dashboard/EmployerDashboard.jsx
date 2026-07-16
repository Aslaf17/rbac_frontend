import { Briefcase, Inbox, Mic2, BarChart3 } from 'lucide-react'
import { DashboardShell } from '../../components/DashboardShell'

const EmployerDashboard = () => {

	return (
		<DashboardShell
			role="EMPLOYER"
			endpoint="/employer/dashboard"
			description="Post jobs, review applicants, and manage your hiring pipeline."
			cards={[
				{ title: 'Open Positions', text: '6 roles currently posted.', icon: Briefcase },
				{ title: 'Applicants', text: '42 new applications this week.', icon: Inbox },
				{ title: 'Interviews', text: '5 interviews scheduled.', icon: Mic2 },
				{ title: 'Analytics', text: 'Avg. time-to-hire: 18 days.', icon: BarChart3 },
			]}
		/>
	)
}

export default EmployerDashboard;
