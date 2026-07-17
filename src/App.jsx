import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import Login from './pages/Login/Login'
import Register from './pages/login/Register'
import AccessDenied from './pages/AccessDenied'
import Profile from './pages/Profile'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import EmployerDashboard from './pages/dashboard/EmployerDashboard'
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import Attendance from './pages/Attendance/Attendance'
import Whiteboard from './pages/Whiteboard/Whiteboard'
import Session from './pages/Session/Session'
import ChatWidget from './components/chatComponents/ChatWidget'
import { ROLE_THEME } from './constants/roleTheme'

export default function App() {
	const { user, loading } = useAuth()

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-paper font-mono text-sm text-muted">
				Verifying credential...
			</div>
		)
	}

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<Navigate to={user ? ROLE_THEME[user.role]?.path : '/login'} replace />}
				/>

				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/access-denied" element={<AccessDenied />} />

				<Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>}/>

				<Route path="/student" element={ <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}> <StudentDashboard /> </ProtectedRoute>}/>
				<Route path="/teacher" element={ <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}> <TeacherDashboard /> </ProtectedRoute> } />
				<Route path="/employer" element={ <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN']}> <EmployerDashboard /> </ProtectedRoute> } />
				<Route path="/employee" element={ <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}> <EmployeeDashboard /> </ProtectedRoute> } />
				<Route path="/admin" element={ <ProtectedRoute allowedRoles={['ADMIN']}> <AdminDashboard /> </ProtectedRoute> } />
				<Route path="/attendance" element={ <ProtectedRoute allowedRoles={['TEACHER', 'STUDENT', 'ADMIN']}> <Attendance /> </ProtectedRoute> } />
				<Route path="/whiteboard" element={ <ProtectedRoute> <Whiteboard /> </ProtectedRoute> } />
				<Route path="/session" element={ <ProtectedRoute> <Session /> </ProtectedRoute> } />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			{user && <ChatWidget />}
		</>
	)
}