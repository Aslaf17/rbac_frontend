import { X } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { formatDateTime, formatDuration } from '../../constants/AttendanceHelpers'

const  DetailRow = ({ label, value }) =>{
	return (
		<div className="flex items-center justify-between border-b border-line py-3 last:border-0">
			<span className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
			<span className="text-sm font-medium text-fg">{value}</span>
		</div>
	)
}

export const AttendanceDetailsModal = ({ record, onClose }) => {
	if (!record) return null

	return (
		<div
			className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-xl shadow-black/10"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between border-b border-line px-6 py-5">
					<div>
						<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
							Attendance Record
						</p>
						<h2 className="mt-1 font-display text-lg font-semibold text-fg">{record.studentName}</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-muted transition-colors hover:bg-paper hover:text-fg"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="px-6 py-2">
					<DetailRow label="Student ID" value={record.studentId || '—'} />
					<DetailRow label="Session" value={record.sessionName} />
					<DetailRow label="Join Time" value={formatDateTime(record.joinTime)} />
					<DetailRow label="Leave Time" value={formatDateTime(record.leaveTime)} />
					<DetailRow label="Total Duration" value={formatDuration(record)} />
					<div className="flex items-center justify-between py-3">
						<span className="font-mono text-[11px] uppercase tracking-widest text-muted">Status</span>
						<StatusBadge status={record.status} />
					</div>
				</div>

				<div className="border-t border-line bg-paper/60 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	)
}
