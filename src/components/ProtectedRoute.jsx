import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-paper font-mono text-sm text-muted">
				Verifying credential...
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		return <Navigate to="/access-denied" replace />
	}

	return children
}
