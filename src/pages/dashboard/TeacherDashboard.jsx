import { School, CheckSquare, BookMarked, Megaphone, CalendarCheck } from 'lucide-react'
import { DashboardShell } from '../../components/DashboardShell'

const TeacherDashboard = () => {
	return (
		<DashboardShell
			role="TEACHER"
			endpoint="/teacher/dashboard"
			description="Manage your classes, grade assignments, and plan lessons."
			actions={[{ label: 'Attendance', to: '/attendance', icon: CalendarCheck }]}
			cards={[
				{ title: 'My Classes', text: '4 classes, 112 students total.', icon: School },
				{ title: 'Pending Grading', text: '18 submissions awaiting review.', icon: CheckSquare },
				{ title: 'Lesson Plans', text: 'Next lesson: Intro to Algorithms.', icon: BookMarked },
				{ title: 'Announcements', text: 'Post an update to your students.', icon: Megaphone },
			]}
		/>
	)
}

export default TeacherDashboard;
