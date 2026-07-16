import { Eye } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { formatDateTime, formatDuration } from '../../constants/AttendanceHelpers'

export const AttendanceRow = ({ record, onViewDetails }) => {

	return (
		<tr className="border-b border-line last:border-0 transition-colors hover:bg-paper">
			<td className="whitespace-nowrap px-4 py-3">
				<p className="text-sm font-medium text-fg">{record.studentName}</p>
				{record.studentId && (
					<p className="font-mono text-[11px] text-muted">ID · {record.studentId}</p>
				)}
			</td>
			<td className="whitespace-nowrap px-4 py-3 text-sm text-fg">{record.sessionName}</td>
			<td className="whitespace-nowrap px-4 py-3 text-sm text-muted">{formatDateTime(record.joinTime)}</td>
			<td className="whitespace-nowrap px-4 py-3 text-sm text-muted">{formatDateTime(record.leaveTime)}</td>
			<td className="whitespace-nowrap px-4 py-3 text-sm text-fg">{formatDuration(record)}</td>
			<td className="whitespace-nowrap px-4 py-3">
				<StatusBadge status={record.status} />
			</td>
			<td className="whitespace-nowrap px-4 py-3 text-right">
				<button
					type="button"
					onClick={() => onViewDetails(record)}
					className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
				>
					<Eye className="h-3.5 w-3.5" />
					View Details
				</button>
			</td>
		</tr>
	)
}
