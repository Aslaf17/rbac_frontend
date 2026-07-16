import { useEffect, useState } from 'react'
import { Mail, AlertCircle, Unlock } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { AccessBadge } from '../components/AccessBadge'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
	const { user } = useAuth()
	const [serverData, setServerData] = useState(null)
	const [error, setError] = useState('')

	useEffect(() => {
		api
			.get('/user/profile')
			.then((res) => setServerData(res.data))
			.catch(() => setError('Could not reach the backend profile endpoint.'))
	}, [])

	return (
		<AppLayout maxWidth="max-w-2xl">
				<p className="text-xs uppercase tracking-[0.2em] text-muted">My credential</p>
				<h1 className="mt-1 font-display text-2xl font-semibold text-fg">Profile</h1>
				<p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
					<Unlock className="mt-0.5 h-4 w-4 shrink-0" />
					<span>This account is protected by login and role access checks.</span>
				</p>

				<div className="mt-6">
					<AccessBadge role={user.role} username={user.username} />
				</div>

				<div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3">
					<Mail className="h-4 w-4 text-muted" />
					<span className="text-sm text-fg">{user.email}</span>
				</div>

				<div className="mt-6 rounded-xl border border-line bg-surface p-5">
					{error && (
						<div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
							<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}
					{serverData && (
						<div className="space-y-3 text-sm text-muted">
							<p className="font-medium text-fg">Profile details</p>
							<p>Role: {serverData.role}</p>
							<p>Username: {serverData.username}</p>
						</div>
					)}
				</div>
		</AppLayout>
	)
}

export default Profile;
