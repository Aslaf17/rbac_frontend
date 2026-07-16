import { Search, X } from 'lucide-react'

export const AttendanceFilters = ({ search, onSearchChange, sessionOptions, sessionFilter, onSessionFilterChange, statusFilter, onStatusFilterChange, dateFilter, onDateFilterChange, onClear,}) => {
	
	const hasActiveFilters = search || sessionFilter || statusFilter || dateFilter

	return (
		<div className="rounded-xl border border-line bg-surface p-4">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
					<input
						type="text"
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Search by student name"
						className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
					/>
				</div>

				<select
					value={sessionFilter}
					onChange={(event) => onSessionFilterChange(event.target.value)}
					className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
				>
					<option value="">All sessions</option>
					{sessionOptions.map((session) => (
						<option key={session} value={session}>
							{session}
						</option>
					))}
				</select>

				<select
					value={statusFilter}
					onChange={(event) => onStatusFilterChange(event.target.value)}
					className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
				>
					<option value="">All statuses</option>
					<option value="PRESENT">Present</option>
					<option value="ABSENT">Absent</option>
					<option value="LATE">Late</option>
				</select>

				<input
					type="date"
					value={dateFilter}
					onChange={(event) => onDateFilterChange(event.target.value)}
					className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
				/>

				<button
					type="button"
					onClick={onClear}
					disabled={!hasActiveFilters}
					className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
				>
					<X className="h-3.5 w-3.5" />
					Clear
				</button>
			</div>
		</div>
	)
}
