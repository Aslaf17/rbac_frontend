export const statusBadgeClasses = (status) => {
	switch (status) {
		case 'ACTIVE':
			return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
		case 'WAITING':
			return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
		case 'REMOVED':
		case 'REJECTED':
			return 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
		default:
			return 'bg-surface-2 text-muted'
	}
}

export const formatClock = (value) => {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value)
	return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export const initials = (name) =>
	(name || '?')
		.split(' ')
		.map((part) => part[0])
		.slice(0, 2)
		.join('')
		.toUpperCase()