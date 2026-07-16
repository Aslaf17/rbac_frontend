import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarCheck, Search, UserCheck, UserX, Users } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout'
import { AttendanceCard } from '../../components/attendanceComponents/AttendanceCard'
import { AttendanceStatsCard } from '../../components/attendanceComponents/AttendanceStatsCard'
import { AttendanceFilters } from '../../components/attendanceComponents/AttendanceFilters'
import { AttendanceTable } from '../../components/attendanceComponents/AttendanceTable'
import { AttendanceDetailsModal } from '../../components/attendanceComponents/AttendanceDetailsModal'
import { useAuth } from '../../context/AuthContext'
import { getAttendanceBySession, getAttendanceByStudent } from '../../api/AttendanceApi'
import { normalizeRecord, formatDateOnly } from '../../constants/AttendanceHelpers'

const Attendance = () => {
	const { user } = useAuth()
	const canMarkAttendance = user?.role === 'STUDENT' || user?.role === 'ADMIN'

	const [lookupMode, setLookupMode] = useState('session') 
	const [lookupId, setLookupId] = useState('')
	const [activeLookup, setActiveLookup] = useState(null)

	const [records, setRecords] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [search, setSearch] = useState('')
	const [sessionFilter, setSessionFilter] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [dateFilter, setDateFilter] = useState('')
	const [selectedRecord, setSelectedRecord] = useState(null)

	useEffect(() => {
		if (!activeLookup) return

		setLoading(true)
		setError('')

		const request =
			activeLookup.mode === 'session'
				? getAttendanceBySession(activeLookup.id)
				: getAttendanceByStudent(activeLookup.id)

		request
			.then((data) => setRecords((data || []).map(normalizeRecord)))
			.catch((err) => {
				setRecords([])
				setError(
					err.response?.data?.message ||
						'Could not load attendance records. Please check the ID and try again.'
				)
			})
			.finally(() => setLoading(false))
	}, [activeLookup])

	const handleLookup = (event) => {
		event.preventDefault()
		if (!lookupId.trim()) return
		setActiveLookup({ mode: lookupMode, id: lookupId.trim() })
	}

	const refreshLookup = () => {
		if (activeLookup) setActiveLookup({ ...activeLookup })
	}

	const sessionOptions = useMemo(
		() => [...new Set(records.map((record) => record.sessionName))].sort(),
		[records]
	)

	const filteredRecords = useMemo(() => {
		return records.filter((record) => {
			if (search && !record.studentName.toLowerCase().includes(search.toLowerCase())) return false
			if (sessionFilter && record.sessionName !== sessionFilter) return false
			if (statusFilter && record.status !== statusFilter) return false
			if (dateFilter && formatDateOnly(record.joinTime) !== dateFilter) return false
			return true
		})
	}, [records, search, sessionFilter, statusFilter, dateFilter])

	const stats = useMemo(() => {
		const totalStudents = new Set(records.map((record) => record.studentId || record.studentName)).size
		const present = records.filter((record) => record.status === 'PRESENT').length
		const absent = records.filter((record) => record.status === 'ABSENT').length
		const percentage = records.length ? Math.round((present / records.length) * 100) : 0
		return { totalStudents, present, absent, percentage }
	}, [records])

	const clearFilters = () => {
		setSearch('')
		setSessionFilter('')
		setStatusFilter('')
		setDateFilter('')
	}

	return (
		<AppLayout maxWidth="max-w-6xl">
				<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Virtual Classroom</p>
				<h1 className="mt-1 font-display text-2xl font-semibold text-fg">Attendance</h1>
				<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
					Look up attendance for a session or a student, then search and filter the results below.
				</p>

				{canMarkAttendance && (
					<div className="mt-6">
						<AttendanceCard onMarked={refreshLookup} />
					</div>
				)}

				<form
					onSubmit={handleLookup}
					className="mt-6 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center"
				>
					<div className="inline-flex rounded-lg border border-line p-1">
						{['session', 'student'].map((mode) => (
							<button
								key={mode}
								type="button"
								onClick={() => setLookupMode(mode)}
								className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
									lookupMode === mode ? 'bg-ink text-white' : 'text-muted hover:text-fg'
								}`}
							>
								By {mode}
							</button>
						))}
					</div>

					<input
						type="text"
						value={lookupId}
						onChange={(event) => setLookupId(event.target.value)}
						placeholder={lookupMode === 'session' ? 'Enter session ID' : 'Enter student ID'}
						className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
					/>

					<button
						type="submit"
						className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
					>
						<Search className="h-3.5 w-3.5" />
						Load Records
					</button>
				</form>

				{error && (
					<div className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<AttendanceStatsCard label="Total Students" value={stats.totalStudents} icon={Users} accent="#3652E0" />
					<AttendanceStatsCard label="Present" value={stats.present} icon={UserCheck} accent="#1E8F53" />
					<AttendanceStatsCard label="Absent" value={stats.absent} icon={UserX} accent="#D62839" />
					<AttendanceStatsCard
						label="Attendance Rate"
						value={stats.percentage}
						suffix="%"
						icon={CalendarCheck}
						accent="#D9720C"
					/>
				</div>

				<div className="mt-6">
					<AttendanceFilters
						search={search}
						onSearchChange={setSearch}
						sessionOptions={sessionOptions}
						sessionFilter={sessionFilter}
						onSessionFilterChange={setSessionFilter}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
						dateFilter={dateFilter}
						onDateFilterChange={setDateFilter}
						onClear={clearFilters}
					/>
				</div>

				<div className="mt-4">
					{activeLookup ? (
						<AttendanceTable records={filteredRecords} loading={loading} onViewDetails={setSelectedRecord} />
					) : (
						<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface py-16 text-muted">
							<Search className="h-6 w-6" />
							<p className="text-sm font-medium text-fg">Enter a session or student ID to begin</p>
							<p className="text-xs text-muted">Attendance records will appear here once loaded.</p>
						</div>
					)}
				</div>

			<AttendanceDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
		</AppLayout>
	)
}

export default Attendance;