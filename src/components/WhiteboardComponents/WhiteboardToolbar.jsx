import { Circle, Eraser, Minus, MoveUpRight, Pencil, Redo2, Save, Square, Trash2, Undo2 } from 'lucide-react'

const SWATCHES = ['#14161F', '#D62839', '#1E8F53', '#3652E0', '#D9720C', '#8B5CF6']
const BRUSH_SIZES = [3, 6, 12, 22]

const TOOLS = [
	{ id: 'pen', label: 'Pen', icon: Pencil },
	{ id: 'eraser', label: 'Eraser', icon: Eraser },
	{ id: 'line', label: 'Line', icon: Minus },
	{ id: 'rectangle', label: 'Rectangle', icon: Square },
	{ id: 'circle', label: 'Circle', icon: Circle },
	{ id: 'arrow', label: 'Arrow', icon: MoveUpRight },
]

export const WhiteboardToolbar = ({
	color,
	onColorChange,
	brushSize,
	onBrushSizeChange,
	tool,
	onToolChange,
	onUndo,
	onClearLocal,
	onClearServer,
	canClearServer,
	onSave,
	saving,
	pendingCount = 0,
}) => {
	return (
		<div className="glossy-surface flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-4">
			{}
			<div className="inline-flex flex-wrap rounded-lg border border-line p-1">
				{TOOLS.map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						type="button"
						onClick={() => onToolChange(id)}
						className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
							tool === id ? 'bg-ink text-white' : 'text-muted hover:text-fg'
						}`}
					>
						<Icon className="h-3.5 w-3.5" /> {label}
					</button>
				))}
			</div>

			{}
			<div className="flex items-center gap-1.5">
				{SWATCHES.map((swatch) => (
					<button
						key={swatch}
						type="button"
						onClick={() => onColorChange(swatch)}
						aria-label={`Color ${swatch}`}
						className={`h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-110 ${
							color === swatch ? 'ring-ink' : 'ring-transparent'
						}`}
						style={{ backgroundColor: swatch }}
					/>
				))}
				<input
					type="color"
					value={color}
					onChange={(event) => onColorChange(event.target.value)}
					className="h-6 w-6 cursor-pointer rounded-full border border-line bg-transparent p-0"
					title="Custom color"
				/>
			</div>

			{}
			<div className="flex items-center gap-1.5">
				{BRUSH_SIZES.map((size) => (
					<button
						key={size}
						type="button"
						onClick={() => onBrushSizeChange(size)}
						className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
							brushSize === size ? 'border-ink bg-surface-2' : 'border-line hover:bg-surface-2'
						}`}
						aria-label={`Brush size ${size}`}
					>
						<span className="rounded-full bg-fg" style={{ width: size / 2, height: size / 2 }} />
					</button>
				))}
			</div>

			<div className="ml-auto flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={onUndo}
					className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
				>
					<Undo2 className="h-3.5 w-3.5" /> Undo
				</button>

				<button
					type="button"
					onClick={onClearLocal}
					className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
				>
					<Redo2 className="h-3.5 w-3.5 rotate-180" /> Clear
				</button>

				{canClearServer && (
					<button
						type="button"
						onClick={onClearServer}
						className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
					>
						<Trash2 className="h-3.5 w-3.5" /> Delete on server
					</button>
				)}

				<button
					type="button"
					onClick={onSave}
					disabled={saving || pendingCount === 0}
					className="glossy inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					<Save className="h-3.5 w-3.5" />
					{saving ? 'Saving...' : pendingCount > 0 ? `Save (${pendingCount})` : 'Saved'}
				</button>
			</div>
		</div>
	)
}