import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { AccessBadge } from './AccessBadge'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import { ROLE_THEME } from '../constants/roleTheme'

export const DashboardShell = ({ role, endpoint, description, cards, actions = [] }) => {
	const { user } = useAuth()
	const theme = ROLE_THEME[role]
	const [data, setData] = useState(null)
	const [error, setError] = useState('')

	useEffect(() => {
	api
		.get(endpoint)
		.then((res) => setData(res.data))
		.catch(() => setError('Could not reach the backend for this dashboard.'))
}, [endpoint])

	return (
		<AppLayout maxWidth="max-w-5xl">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-muted">
							{theme.label} Dashboard
						</p>
						<h1 className="mt-1 font-display text-2xl font-semibold text-fg">
							Welcome back, {user.username}
						</h1>
						<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>

                        {data && (
                            <p className="mt-2 text-sm font-medium text-fg">
                                Total Users: {data.totalUsers}
                            </p>
                        )}

						{actions.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-2">
								{actions.map((action) => {
									const Icon = action.icon
									return (
										<Link
											key={action.label}
											to={action.to}
											className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
										>
											{Icon && <Icon className="h-3.5 w-3.5" />}
											{action.label}
										</Link>
									)
								})}
							</div>
						)}
					</div>
					<AccessBadge role={role} username={user.username} />
				</div>

				{error && (
					<div className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{cards.map((card) => {
						const Icon = card.icon
						return (
							<div
								key={card.title}
								className="rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm"
							>
								<div
									className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
									style={{ backgroundColor: `${theme.color}1A` }}
								>
									<Icon className="h-4.5 w-4.5" style={{ color: theme.color }} strokeWidth={2} />
								</div>
								<h3 className="font-display font-semibold text-fg">{card.title}</h3>
								<p className="mt-1 text-sm text-muted">{card.text}</p>
							</div>
						)
					})}
				</div>

				{}
		</AppLayout>
	)
}
