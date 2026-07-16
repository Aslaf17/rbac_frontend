import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, User, ArrowRight, ScanFace, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_THEME } from '../roleTheme'

const Login = () => {

	const { login } = useAuth()
	const navigate = useNavigate()

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setSubmitting(true)
		try {
			const data = await login(username, password)
			navigate(ROLE_THEME[data.role]?.path ?? '/profile')
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed. Check your credentials.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-screen bg-paper">
			{}
			<div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-ink px-12 py-12 text-white lg:flex">
				<div
					className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
					style={{ background: 'radial-gradient(circle, #3652E0, transparent 70%)' }}
				/>
				<div className="relative flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
						<ScanFace className="h-5 w-5" strokeWidth={2} />
					</div>
					<span className="font-display text-lg font-semibold">Access Portal</span>
				</div>

				<div className="relative">
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
						Role-based access control
					</p>
					<h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
						One account.
						<br />
						Five clearance levels.
					</h1>
					<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
						Every account is issued a credential scoped to exactly what its
						role should see — students, teachers, employers, employees, and
						admins each land on their own dashboard automatically.
					</p>

					<div className="mt-8 flex flex-wrap gap-2">
						{Object.values(ROLE_THEME).map((theme) => {
							const Icon = theme.icon
							return (
								<span
									key={theme.code}
									className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3"
								>
									<Icon className="h-3.5 w-3.5" style={{ color: theme.color }} strokeWidth={2.5} />
									<span className="font-mono text-[11px] text-white/70">{theme.label}</span>
								</span>
							)
						})}
					</div>
				</div>

				<p className="relative font-mono text-[11px] text-white/30">
					Demo credential system · not for production use
				</p>
			</div>

			{}
			<div className="flex flex-1 items-center justify-center px-6 py-12">
				<div className="w-full max-w-sm">
					<div className="mb-8 lg:hidden">
						<div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink">
							<ScanFace className="h-5 w-5 text-white" />
						</div>
					</div>

					<h1 className="font-display text-2xl font-semibold text-fg">Sign in</h1>
					<p className="mt-1 text-sm text-muted">Verify your credential to reach your dashboard.</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-4">
						{error && (
							<div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
								<span>{error}</span>
							</div>
						)}

						<div>
							<label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
								Username
							</label>
							<div className="relative">
								<User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
								<input
									type="text"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-ink/10 focus:border-ink"
									placeholder="jane_doe"
								/>
							</div>
						</div>

						<div>
							<label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
								Password
							</label>
							<div className="relative">
								<KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
								<input
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-ink/10 focus:border-ink"
									placeholder="••••••••"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{submitting ? 'Verifying...' : 'Sign in'}
							{!submitting && (
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							)}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-muted">
						Don't have a credential?{' '}
						<Link to="/register" className="font-semibold text-fg hover:underline">
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login;
