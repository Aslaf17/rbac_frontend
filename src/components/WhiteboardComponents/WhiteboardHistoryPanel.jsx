import { ArrowUpRight, Circle, Clock, Eraser, Minus, PenLine, Square, Waves } from 'lucide-react'

const TOOL_META = {
	PEN: { label: 'Pen stroke', icon: PenLine },
	ERASER: { label: 'Eraser stroke', icon: Eraser },
	LINE: { label: 'Line', icon: Minus },
	RECTANGLE: { label: 'Rectangle', icon: Square },
	CIRCLE: { label: 'Circle', icon: Circle },
	ARROW: { label: 'Arrow', icon: ArrowUpRight },
}

export const WhiteboardHistoryPanel = ({ records, pendingCount = 0 }) => {
	return (
		<div className="glossy-surface rounded-xl border border-line bg-surface p-4">
			<p className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
				<span>Strokes &middot; {records.length}</span>
				{pendingCount > 0 && (
					<span className="rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-amber-700 dark:text-amber-400">
						{pendingCount} unsaved
					</span>
				)}
			</p>

			{records.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted">
					<Waves className="h-5 w-5" />
					<p className="text-sm font-medium text-fg">No strokes saved yet</p>
					<p className="text-xs text-muted">Draw on the board, then hit Save.</p>
				</div>
			) : (
				<div className="flex max-h-130 flex-col gap-1.5 overflow-y-auto pr-1">
					{records.map((record) => {
						const meta = TOOL_META[record.toolType] || TOOL_META.PEN
						const Icon = meta.icon
						const isEraser = record.toolType === 'ERASER'
						// render
						return (
							<div
								key={record.id ?? `${record.createdAt}-${record.toolType}-${record.points?.length ?? 0}`}
								className="flex items-center gap-3 rounded-lg border border-line px-2.5 py-2"
							>
								<span
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
									style={{ backgroundColor: isEraser ? '#E4E3DE' : `${record.color}22` }}
								>
									<Icon className="h-3.5 w-3.5" style={{ color: isEraser ? undefined : record.color }} />
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-semibold text-fg">{meta.label}</p>
									<p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
										<Clock className="h-3 w-3" />
										{record.createdAt || '—'}
									</p>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}