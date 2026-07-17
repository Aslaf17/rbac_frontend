import { useState } from 'react'
import { AlertCircle, CalendarClock, CheckCircle2, LogIn, PlayCircle, Radio, Search, StopCircle } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { startSession, endSession, getSession, joinSession } from '../../api/SessionApi'

const formatTimestamp = (value) => {
	if (!value) return null
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value)
	return date.toLocaleString(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	})
}

const DetailRow = ({ label, value }) => {
	return (
		<div className="flex items-center justify-between  border-line py-2.5 text-sm last:border-b-0">
			<span className="text-muted">{label}</span>
			<span className="font-medium text-fg">{value ?? '—'}</span>
		</div>
	)
}

const Session = () => {

	const { user } = useAuth()
	const canCreate = user?.role === 'ADMIN' || user?.role === 'TEACHER'

	const [session, setSession] = useState(null)
	const [titleInput, setTitleInput] = useState('')
	const [idInput, setIdInput] = useState('')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')

	const runAction = async (action) => {
		setLoading(true)
		setError('')
		setNotice('')
		try {
			await action()
		} catch (err) {
			setError(err.response?.data?.message || err.response?.data || 'Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = (event) => {
		event.preventDefault()
		const title = titleInput.trim()
		if (!title) return
		runAction(async () => {
			const data = await startSession(title)
			setSession(data)
			setTitleInput('')
			setNotice('Session started.')
		})
	}

	const handleLoad = (event) => {
		event.preventDefault()
		const id = idInput.trim()
		if (!id) return
		runAction(async () => {
			const data = await getSession(id)
			setSession(data)
			setIdInput('')
			setNotice('Session loaded.')
		})
	}

	const handleJoin = () => {
		if (!session) return
		runAction(async () => {
			await joinSession(session.sessionId)
			setNotice('Joined session — check your attendance record.')
		})
	}

	const handleEnd = () => {
		if (!session) return
		runAction(async () => {
			const data = await endSession(session.sessionId)
			setSession(data)
			setNotice('Session ended.')
		})
	}

	return (
		<AppLayout maxWidth="max-w-4xl">
			<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Virtual Classroom</p>
			<h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold text-fg">
				<Radio className="h-5 w-5" />
				Session
			</h1>
			<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				{canCreate
					? 'Start a new session, or load an existing one by ID to see its details.'
					: 'Load a session by ID to see its details, or join it to mark your attendance.'}
			</p>

			{error && (
				<div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
					<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{notice && (
				<div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-900">
					<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{notice}</span>
				</div>
			)}

			<div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div className="flex flex-col gap-4">
					{canCreate && (
						<form
							onSubmit={handleCreate}
							className="glossy-surface flex flex-col gap-3 rounded-xl border   border-line bg-surface p-4"
						>
							<label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
								Start a session
							</label>
							<div className="flex flex-col gap-2 sm:flex-row">
								<input
									type="text"
									value={titleInput}
									onChange={(event) => setTitleInput(event.target.value)}
									placeholder="Session title"
									className="flex-1 rounded-lg border border-line  bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
								/>
								<button
									type="submit"
									disabled={loading}
									className="glossy inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
								>
									<PlayCircle className="h-3.5 w-3.5" />
									Start
								</button>
							</div>
						</form>
					)}

					<form
						onSubmit={handleLoad}
						className="glossy-surface flex flex-col gap-3 rounded-xl border border-line  bg-surface p-4"
					>
						<label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
							Load a session
						</label>
						<div className="flex flex-col gap-2 sm:flex-row">
							<input
								type="text"
								value={idInput}
								onChange={(event) => setIdInput(event.target.value)}
								placeholder="Session ID"
								className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
							/>
							<button
								type="submit"
								disabled={loading}
								className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:opacity-50"
							>
								<Search className="h-3.5 w-3.5" />
								Load
							</button>
						</div>
					</form>
				</div>

				<div className="glossy-surface rounded-xl border border-line bg-surface p-4">
					<div className="mb-1 flex items-center justify-between">
						<label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
							Session details
						</label>
						{session && (
							<span
								className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
									session.status === 'ACTIVE'
										? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
										: 'bg-surface-2 text-muted'
								}`}
							>
								{session.status}
							</span>
						)}
					</div>

					{session ? (
						<>
							<h2 className="mt-2 truncate font-display text-lg font-semibold text-fg" title={session.title}>
								{session.title}
							</h2>

							<div className="mt-3">
								<DetailRow label="Session ID" value={<span className="font-mono text-xs">{session.sessionId}</span>} />
								<DetailRow label="Trainer" value={session.trainerName} />
								<DetailRow label="Started" value={formatTimestamp(session.startedAt)} />
								<DetailRow label="Ended" value={formatTimestamp(session.endedAt)} />
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								{session.status === 'ACTIVE' && (
									<button
										type="button"
										onClick={handleJoin}
										disabled={loading}
										className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:opacity-50"
									>
										<LogIn className="h-3.5 w-3.5" />
										Join session
									</button>
								)}
								{canCreate && session.status === 'ACTIVE' && (
									<button
										type="button"
										onClick={handleEnd}
										disabled={loading}
										className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50"
									>
										<StopCircle className="h-3.5 w-3.5" />
										End session
									</button>
								)}
							</div>
						</>
					) : (
						<div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted">
							<CalendarClock className="h-5 w-5" />
							<p className="text-sm font-medium text-fg">No session loaded</p>
							<p className="text-xs text-muted">
								{canCreate ? 'Start one, or load an existing session by ID.' : 'Load a session by ID to see it here.'}
							</p>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

export default Session;