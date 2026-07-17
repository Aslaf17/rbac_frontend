import { useState } from 'react'
import { AlertCircle, CheckCircle2, LogIn, LogOut } from 'lucide-react'
import { markAttendance, logoutAttendance } from '../../api/AttendanceApi'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime } from '../../constants/AttendanceHelpers'

const storageKey = (studentId, sessionId) => `attendance_active_${studentId}_${sessionId}`

const readActive = (studentId, sessionId) => {
	if (!studentId || !sessionId) return null
	const saved = localStorage.getItem(storageKey(studentId, sessionId))
	return saved ? JSON.parse(saved) : null
}

export const AttendanceCard = ({ onMarked }) => {
	const { user } = useAuth()

	const [sessionId, setSessionId] = useState('')
	const [studentId, setStudentId] = useState(() => localStorage.getItem('attendance_student_id') || '')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')

	// track which key our `active` state currently reflects
	const [activeKey, setActiveKey] = useState(() => storageKey(studentId, sessionId))
	const [active, setActive] = useState(() => readActive(studentId, sessionId))

	const currentKey = storageKey(studentId, sessionId)
	if (currentKey !== activeKey) {
		setActiveKey(currentKey)
		setActive(readActive(studentId, sessionId))
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		if (!sessionId.trim() || !studentId.trim()) {
			setError('Enter both your Student ID and the Session ID first.')
			return
		}

		setError('')
		setNotice('')
		setSubmitting(true)
		localStorage.setItem('attendance_student_id', studentId.trim())

		try {
			
			const record = await markAttendance({
				userId: studentId.trim(),
				sessionId: sessionId.trim(),
				joinTime: new Date().toISOString(),
			})

			const joinTime = record.joinTime ?? new Date().toISOString()
			const next = { joinTime }

			localStorage.setItem(storageKey(studentId.trim(), sessionId.trim()), JSON.stringify(next))
			setActive(next)
			setNotice('Logged in — attendance marked as present.')
			onMarked?.()
		} catch (err) {
			setError(err.response?.data?.message || 'Could not mark attendance. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleLogout = async () => {
		if (!active) return

		setError('')
		setNotice('')
		setSubmitting(true)

		try {
			await logoutAttendance({
				userId: studentId.trim(),
				sessionId: sessionId.trim(),
			})

			localStorage.removeItem(storageKey(studentId.trim(), sessionId.trim()))
			setActive(null)
			setNotice('Logged out — leave time recorded.')
			onMarked?.()
		} catch (err) {
			setError(err.response?.data?.message || 'Could not record your leave time. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="rounded-xl border border-line bg-surface p-5">
			<p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Mark My Attendance</p>
			<h2 className="mt-1 font-display text-lg font-semibold text-fg">
				{active ? 'You are logged in' : 'Log in to a session'}
			</h2>
			<p className="mt-1 text-sm text-muted">
				{active
					? `Checked in at ${formatDateTime(active.joinTime)}. Log out when the session ends.`
					: `Signed in as ${user?.username}. Enter the session you're joining to mark yourself present.`}
			</p>

			<form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3 sm:flex-row  sm:items-center">
				<input
					type="text"
					value={studentId}
					onChange={(event) => setStudentId(event.target.value)}
					placeholder="Your Student ID"
					disabled={!!active}
					className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
				/>
				<input
					type="text"
					value={sessionId}
					onChange={(event) => setSessionId(event.target.value)}
					placeholder="Session ID"
					disabled={!!active}
					className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 disabled:opacity-60"
				/>

				{active ? (
					<button
						type="button"
						onClick={handleLogout}
						disabled={submitting}
						className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						<LogOut className="h-3.5 w-3.5" />
						{submitting ? 'Logging out...' : 'Log Out'}
					</button>
				) : (
					<button
						type="submit"
						disabled={submitting}
						className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						<LogIn className="h-3.5 w-3.5" />
						{submitting ? 'Logging in...' : 'Log In'}
					</button>
				)}
			</form>

			{error && (
				<div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
					<AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{notice && !error && (
				<div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 ring-1 ring-inset ring-emerald-200">
					<CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
					<span>{notice}</span>
				</div>
			)}
		</div>
	)
}
