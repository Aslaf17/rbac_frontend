import { ClipboardX, Loader2 } from 'lucide-react'
import { AttendanceRow } from './AttendanceRow'

const COLUMNS = [
	'Student Name',
	'Session Name',
	'Join Time',
	'Leave Time',
	'Duration',
	'Attendance Status',
	'',
]

export const AttendanceTable = ({ records, loading, onViewDetails }) => {
	return (
		<div className="overflow-hidden rounded-xl border border-line bg-surface">
			<div className="overflow-x-auto">
				<table className="w-full min-w-215 border-collapse">
					<thead>
						<tr className="border-b border-line bg-paper/60">
							{COLUMNS.map((column) => (
								<th
									key={column}
									className="whitespace-nowrap px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-muted"
								>
									{column}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{!loading &&
							records.map((record) => (
								<AttendanceRow key={record.id} record={record} onViewDetails={onViewDetails} />
							))}
					</tbody>
				</table>
			</div>

			{loading && (
				<div className="flex flex-col items-center justify-center gap-2 py-16 text-muted">
					<Loader2 className="h-5 w-5 animate-spin" />
					<p className="text-sm">Loading attendance records...</p>
				</div>
			)}

			{!loading && records.length === 0 && (
				<div className="flex flex-col items-center justify-center gap-2 py-16 text-muted">
					<ClipboardX className="h-6 w-6" />
					<p className="text-sm font-medium text-fg">No attendance records found</p>
					<p className="text-xs text-muted">Try adjusting your search or filters.</p>
				</div>
			)}
		</div>
	)
}
