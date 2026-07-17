import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, KeyRound, User, ArrowRight, ScanFace, AlertCircle, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLES, ROLE_THEME } from '../../constants/roleTheme'

const Register = () => {
	const { register } = useAuth()
	const navigate = useNavigate()

	const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STUDENT' })
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setSubmitting(true)
		try {
			const data = await register(form.username, form.email, form.password, form.role)
			navigate(ROLE_THEME[data.role]?.path ?? '/profile')
		} catch (err) {
			setError(err.response?.data?.message || 'Registration failed.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
			<div className="w-full max-w-md">
				<div className="mb-8 text-center">
					<div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink">
						<ScanFace className="h-5 w-5 text-white" />
					</div>
					<h1 className="font-display text-2xl font-semibold text-fg">Request a credential</h1>
					<p className="mt-1 text-sm text-muted">
						This demo lets you pick any clearance level — in production, role
						assignment would typically be admin-only.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-5 rounded-2xl border border-line bg-surface p-8 shadow-sm"
				>
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
								minLength={3}
								value={form.username}
								onChange={update('username')}
								className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-ink/10 focus:border-ink"
								placeholder="jane_doe"
							/>
						</div>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
							Email
						</label>
						<div className="relative">
							<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
							<input
								type="email"
								required
								value={form.email}
								onChange={update('email')}
								className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-ink/10 focus:border-ink"
								placeholder="jane@example.com"
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
								minLength={6}
								value={form.password}
								onChange={update('password')}
								className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-ink/10 focus:border-ink"
								placeholder="At least 6 characters"
							/>
						</div>
					</div>

					<div>
						<label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
							Clearance level
						</label>
						<div className="grid grid-cols-1 gap-2">
							{ROLES.map((role) => {
								const theme = ROLE_THEME[role]
								const Icon = theme.icon
								const active = form.role === role
								return (
									<button
										type="button"
										key={role}
										onClick={() => setForm({ ...form, role })}
										className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
											active ? 'border-ink bg-ink/[0.03]' : 'border-line hover:border-ink/30'
										}`}
									>
										<div
											className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
											style={{ backgroundColor: theme.color }}
										>
											<Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm font-semibold text-fg">{theme.label}</p>
											<p className="font-mono text-[11px] text-muted">{theme.clearanceLine}</p>
										</div>
										{active && <Check className="h-4 w-4 shrink-0 text-fg" strokeWidth={2.5} />}
									</button>
								)
							})}
						</div>
					</div>

					<button
						type="submit"
						disabled={submitting}
						className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting ? 'Creating credential...' : 'Create account'}
						{!submitting && (
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
						)}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-muted">
					Already have an account?{' '}
					<Link to="/login" className="font-semibold text-fg hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Register;
