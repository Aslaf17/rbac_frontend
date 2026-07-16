import { BookOpen, ClipboardList, Award, CalendarClock, CalendarCheck } from 'lucide-react'
import { DashboardShell } from '../../components/DashboardShell'

const StudentDashboard = () => {
	return (
		<DashboardShell
			role="STUDENT"
			endpoint="/student/dashboard"
			description="Track your courses, assignments, and grades in one place."
			actions={[{ label: 'Attendance', to: '/attendance', icon: CalendarCheck }]}
			cards={[
				{ title: 'My Courses', text: '5 courses in progress this term.', icon: BookOpen },
				{ title: 'Assignments', text: '3 assignments due this week.', icon: ClipboardList },
				{ title: 'Grades', text: 'Current GPA: 3.8', icon: Award },
				{ title: 'Schedule', text: 'Next class: Data Structures, 10:00 AM.', icon: CalendarClock },
			]}
		/>
	)
}

export default StudentDashboard;
