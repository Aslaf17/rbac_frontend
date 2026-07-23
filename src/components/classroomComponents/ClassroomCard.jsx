import { Calendar, Clock, Users, Radio } from 'lucide-react'

const STATUS_STYLES = {
	LIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
	UPCOMING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
	ENDED: 'bg-surface-2 text-muted',
}

export const ClassroomCard = ({ classItem, onJoin }) => {
	const { title, trainerName, date, time, currentParticipants, maxParticipants, status } = classItem

	return (
		<div className="glossy-surface flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between gap-2">
				<h3 className="truncate font-display text-base font-semibold text-fg">{title}</h3>
				<span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.ENDED}`}>
					{status === 'LIVE' && <Radio className="mr-1 inline h-2.5 w-2.5 animate-pulse" />}
					{status}
				</span>
			</div>

			<p className="text-sm text-muted">Trainer: <span className="font-medium text-fg">{trainerName}</span></p>

			<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
				<span className="flex items-center gap-1.5">
					<Calendar className="h-3.5 w-3.5" /> {date}
				</span>
				<span className="flex items-center gap-1.5">
					<Clock className="h-3.5 w-3.5" /> {time}
				</span>
				<span className="flex items-center gap-1.5">
					<Users className="h-3.5 w-3.5" /> {currentParticipants}/{maxParticipants}
				</span>
			</div>

			<button
				onClick={onJoin}
				disabled={status === 'ENDED'}
				className="glossy mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{status === 'LIVE' ? 'Join now' : status === 'UPCOMING' ? 'View details' : 'Ended'}
			</button>
		</div>
	)
}