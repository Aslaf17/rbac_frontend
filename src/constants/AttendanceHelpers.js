
export const STATUS_STYLES = {
	PRESENT: {
		label: 'Present',
		dot: 'bg-emerald-500',
		pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
	},
	ABSENT: {
		label: 'Absent',
		dot: 'bg-red-500',
		pill: 'bg-red-50 text-red-700 ring-red-200',
	},
	LATE: {
		label: 'Late',
		dot: 'bg-orange-500',
		pill: 'bg-orange-50 text-orange-700 ring-orange-200',
	},
}

export const statusStyle = (status) => {
	return STATUS_STYLES[status?.toUpperCase()] || {
		label: status || 'Unknown',
		dot: 'bg-slate-400',
		pill: 'bg-slate-50 text-slate-600 ring-slate-200',
	}
}

// export const statusStyle = (status) => {
// 	return STATUS_STYLES[status?.toUpperCase()] || {
// 		label: status || 'Unknown',
// 		dot: 'bg-slate-400',
// 		pill: 'bg-slate-50 text-slate-600 ring-slate-200',
// 	}
// }

export const normalizeRecord = (record) => {
	return {
		id: record.id ?? record.attendanceId,

		studentId: record.studentId ?? record.userId ?? record.student?.id ?? '',
		studentName:
			record.studentName ??
			record.student?.name ??
			record.userId ??
			'Unknown student',

		sessionId: record.sessionId ?? record.session?.id ?? '',
		sessionName:
			record.sessionName ??
			record.session?.name ??
			record.sessionId ??
			'Unknown session',

		joinTime: record.joinTime ?? record.checkInTime ?? null,
		leaveTime: record.leaveTime ?? record.checkOutTime ?? null,
		status: (record.status ?? 'ABSENT').toUpperCase(),
	}
}

export const formatDateTime = (value) => {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export const formatDateOnly = (value) => {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value
	return date.toISOString().slice(0, 10)
}

export const getDurationMinutes = (record) => {
	if (record.durationMinutes != null) return record.durationMinutes
	if (!record.joinTime || !record.leaveTime) return null
	const start = new Date(record.joinTime).getTime()
	const end = new Date(record.leaveTime).getTime()
	if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null
	return Math.round((end - start) / 60000)
}

export const formatDuration = (record) => {
	const minutes = getDurationMinutes(record)
	if (minutes == null) return '—'
	const hrs = Math.floor(minutes / 60)
	const mins = minutes % 60
	if (hrs === 0) return `${mins}m`
	return `${hrs}h ${mins}m`
}
