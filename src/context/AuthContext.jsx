import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axiosConfig'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const storedUser = localStorage.getItem('rbac_user')
		const token = localStorage.getItem('rbac_token')
		if (storedUser && token) {
			setUser(JSON.parse(storedUser))
		}
		setLoading(false)
	}, [])

	const login = async (username, password) => {
		const { data } = await api.post('/auth/login', {
				username,
				password
		});

		console.log(data);

		persistSession(data);

		return data;
}

	const register = async (username, email, password, role) => {
		const { data } = await api.post('/auth/register', { username, email, password, role })
		persistSession(data)
		return data
	}

	const persistSession = (data) => {
		const sessionUser = { username: data.username, email: data.email, role: data.role }
		localStorage.setItem('rbac_token', data.token)
		localStorage.setItem('rbac_user', JSON.stringify(sessionUser))
		setUser(sessionUser)
	}

	const logout = () => {
		localStorage.removeItem('rbac_token')
		localStorage.removeItem('rbac_user')
		setUser(null)
	}

	const value = {
		user,
		isAuthenticated: !!user,
		loading,
		login,
		register,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
	return ctx
}
