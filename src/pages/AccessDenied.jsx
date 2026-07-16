import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_THEME } from '../roleTheme'

const AccessDenied = () => {
	const { user } = useAuth()
	const theme = user ? ROLE_THEME[user.role] : null
	const homePath = theme ? theme.path : '/login'

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D62839]/10">
				<ShieldAlert className="h-8 w-8 text-[#D62839]" strokeWidth={2} />
			</div>

			<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Clearance denied</p>
			<h1 className="mt-2 font-display text-3xl font-semibold text-fg">Access Denied</h1>
			<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
				{theme
					? `Your credential (${theme.label} · ${theme.clearanceLine}) doesn't cover this area.`
					: 'You need to sign in with a valid credential to view this page.'}
			</p>

			<Link
				to={homePath}
				className="group mt-8 flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
			>
				{user ? (
					<>
						<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
						Back to my dashboard
					</>
				) : (
					<>
						<LogIn className="h-4 w-4" />
						Go to login
					</>
				)}
			</Link>
		</div>
	)
}

export default AccessDenied;
