
export const AttendanceStatsCard = ({ label, value, icon: Icon, accent = '#14161F', suffix = '' }) => {
	
	return (
		<div className="rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
			<div className="flex items-start justify-between">
				<div
					className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
					style={{ backgroundColor: `${accent}1A` }}
				>
					<Icon className="h-4.5 w-4.5" style={{ color: accent }} strokeWidth={2} />
				</div>
			</div>
			<p className="mt-4 font-display text-2xl font-semibold text-fg">
				{value}
				{suffix && <span className="ml-0.5 text-lg font-medium text-muted">{suffix}</span>}
			</p>
			<p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{label}</p>
		</div>
	)
}
