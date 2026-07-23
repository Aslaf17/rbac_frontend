import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Maximize2, Minimize2, X, PenSquare } from 'lucide-react'
import { WhiteboardCanvas } from '../whiteboardComponents/WhiteboardCanvas'
import { WhiteboardToolbar } from '../whiteboardComponents/WhiteboardToolbar'
import { useAuth } from '../../context/AuthContext'
import { useClassroom } from '../../context/ClassroomContext'

export const WhiteboardDrawer = ({ onClose, strokes, onStrokeComplete, onUndo, onSave, saving, pendingCount }) => {
	const { user } = useAuth()
	useClassroom()
	const canManage = user?.role === 'TEACHER' || user?.role === 'ADMIN'

	const [minimized, setMinimized] = useState(false)
	const [maximized, setMaximized] = useState(false)
	const [color, setColor] = useState('#14161F')
	const [brushSize, setBrushSize] = useState(6)
	const [tool, setTool] = useState('pen')

	const constraintsRef = useRef(null)

	if (minimized) {
		return (
			<button
				onClick={() => setMinimized(false)}
				className="glossy fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl"
			>
				<PenSquare className="h-4 w-4" /> Whiteboard
			</button>
		)
	}

	return (
		<div ref={constraintsRef} className="pointer-events-none fixed inset-0 z-50">
			<motion.div
				drag={!maximized}
				dragMomentum={false}
				dragConstraints={constraintsRef}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className={`glossy-surface pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl ${
					maximized ? 'inset-6' : 'left-1/2 top-1/2 h-140 w-180 -translate-x-1/2 -translate-y-1/2'
				}`}
			>
				<div className="flex cursor-move items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
					<span className="flex items-center gap-2 text-sm font-semibold text-fg">
						<PenSquare className="h-4 w-4" /> Whiteboard
					</span>
					<div className="flex items-center gap-1">
						<button onClick={() => setMinimized(true)} className="rounded-md p-1.5 text-muted hover:bg-line hover:text-fg">
							<Minus className="h-3.5 w-3.5" />
						</button>
						<button onClick={() => setMaximized((v) => !v)} className="rounded-md p-1.5 text-muted hover:bg-line hover:text-fg">
							{maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
						</button>
						<button onClick={onClose} className="rounded-md p-1.5 text-muted hover:bg-line hover:text-fg">
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
					<WhiteboardToolbar
						color={color}
						onColorChange={setColor}
						brushSize={brushSize}
						onBrushSizeChange={setBrushSize}
						tool={tool}
						onToolChange={setTool}
						onUndo={onUndo}
						onClearLocal={() => {}}
						onClearServer={() => {}}
						canClearServer={false}
						onSave={onSave}
						saving={saving}
						pendingCount={pendingCount}
					/>
					<div className="flex-1 overflow-hidden rounded-xl border border-line">
						<WhiteboardCanvas
							strokes={strokes}
							color={color}
							brushSize={brushSize}
							tool={tool}
							disabled={!canManage && false }
							onStrokeComplete={onStrokeComplete}
						/>
					</div>
				</div>
			</motion.div>
		</div>
	)
}