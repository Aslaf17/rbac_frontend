import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, PlayCircle } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { ClassroomCard } from '../../components/classroomComponents/ClassroomCard'
import { ClassroomCardSkeleton } from '../../components/classroomComponents/ClassroomCardSkeleton'
import { startSession } from '../../api/SessionApi'
import api from '../../api/axiosConfig'

const mapSessionToCard = (s) => ({
	id: s.sessionId,
	title: s.title,
	trainerName: s.trainerName,
	date: s.startedAt ? new Date(s.startedAt).toLocaleDateString() : '—',
	time: s.startedAt ? new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
	currentParticipants: s.liveCount ?? 0,
	maxParticipants: s.maxParticipants ?? 50,
	status: s.status === 'LIVE' ? 'LIVE' : s.status === 'ENDED' ? 'ENDED' : 'UPCOMING',
})

const ClassroomList = () => {
	const { user } = useAuth()
	const navigate = useNavigate()
	const canCreate = user?.role === 'TEACHER' || user?.role === 'ADMIN'

	const [classes, setClasses] = useState([])
	const [loading, setLoading] = useState(true)
	const [titleInput, setTitleInput] = useState('')
	const [starting, setStarting] = useState(false)

	const loadClasses = () => {
		setLoading(true)
		api
			.get('/session/all')
			.then((res) => setClasses((res.data || []).map(mapSessionToCard)))
			.catch(() => setClasses([]))
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		loadClasses()
		const interval = setInterval(loadClasses, 15000) 
		return () => clearInterval(interval)
	}, [])

	const handleStart = async (e) => {
		e.preventDefault()
		const title = titleInput.trim()
		if (!title || starting) return
		setStarting(true)
		try {
			const session = await startSession(title)
			navigate(`/classroom/${session.sessionId}`)
		} finally {
			setStarting(false)
		}
	}

	return (
		<AppLayout maxWidth="max-w-6xl">
			<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Virtual Classroom</p>
			<h1 className="mt-1 font-display text-2xl font-semibold text-fg">Classroom</h1>
			<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				Browse live and upcoming classes, or jump straight into one that's already running.
			</p>

			{canCreate && (
				<form onSubmit={handleStart} className="glossy-surface mt-6 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center">
					<input
						value={titleInput}
						onChange={(e) => setTitleInput(e.target.value)}
						placeholder="New class title"
						className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
					/>
					<button
						type="submit"
						disabled={starting}
						className="glossy inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						<PlayCircle className="h-3.5 w-3.5" /> {starting ? 'Starting…' : 'Start class'}
					</button>
				</form>
			)}

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{loading &&
					Array.from({ length: 6 }).map((_, i) => <ClassroomCardSkeleton key={i} />)}

				{!loading && classes.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-16 text-center text-muted">
						<CalendarClock className="h-6 w-6" />
						<p className="text-sm font-medium text-fg">No classes right now</p>
						<p className="text-xs">{canCreate ? 'Start one above to get things going.' : 'Check back soon, or ask your trainer.'}</p>
					</div>
				)}

				{!loading &&
					classes.map((c) => (
						<ClassroomCard key={c.id} classItem={c} onJoin={() => navigate(`/classroom/${c.id}`)} />
					))}
			</div>
		</AppLayout>
	)
}

export default ClassroomList;