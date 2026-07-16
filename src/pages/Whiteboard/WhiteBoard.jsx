import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, PenSquare, Search } from 'lucide-react'
import { AppLayout } from '../../components/AppLayout'
import { WhiteboardCanvas } from '../../components/whiteboardComponents/WhiteboardCanvas'
import { WhiteboardToolbar } from '../../components/whiteboardComponents/WhiteboardToolbar'
import { WhiteboardHistoryPanel } from '../../components/whiteboardComponents/WhiteboardHistoryPanel'
import { useAuth } from '../../context/AuthContext'
import { clearWhiteboard, getSessionWhiteboard, saveDrawing } from '../../api/WhiteboardApi'
import { normalizeWhiteboard, buildDrawingData } from '../../constants/WhiteboardHelpers'

const Whiteboard = () => {
	const { user } = useAuth()
	const canClearServer = user?.role === 'TEACHER' || user?.role === 'ADMIN'

	const [sessionInput, setSessionInput] = useState('')
	const [sessionId, setSessionId] = useState('')
	const [savedStrokes, setSavedStrokes] = useState([])
	const [pendingStrokes, setPendingStrokes] = useState([])

	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')

	const [color, setColor] = useState('#14161F')
	const [brushSize, setBrushSize] = useState(6)
	const [tool, setTool] = useState('pen')

	useEffect(() => {
		if (!notice) return
		const timeout = setTimeout(() => setNotice(''), 3000)
		return () => clearTimeout(timeout)
	}, [notice])

	const visibleStrokes = [...savedStrokes, ...pendingStrokes]

	const loadSession = (event) => {
		event.preventDefault()
		const id = sessionInput.trim()
		if (!id) return

		setLoading(true)
		setError('')
		setNotice('')

		getSessionWhiteboard(id)
			.then((data) => {
				const normalized = (data || []).map(normalizeWhiteboard)
				setSessionId(id)
				setSavedStrokes(normalized)
				setPendingStrokes([])
			})
			.catch((err) => {
				setSavedStrokes([])
				setPendingStrokes([])
				setSessionId(id)
				setError(
					err.response?.data?.message ||
						'Could not load this session yet. It may not have any saved strokes — start drawing and hit Save.'
				)
			})
			.finally(() => setLoading(false))
	}

	const handleStrokeComplete = (stroke) => {
		setPendingStrokes((prev) => [...prev, stroke])
	}

	const handleUndo = () => {
		setPendingStrokes((prev) => prev.slice(0, -1))
	}

	const handleClearLocal = () => {
		setSavedStrokes([])
		setPendingStrokes([])
	}

	const handleSave = async () => {
		if (!sessionId) {
			setError('Enter a session ID above before saving.')
			return
		}
		if (!pendingStrokes.length) return

		setSaving(true)
		setError('')
		try {
			const responses = []
			for (const stroke of pendingStrokes) {

				const response = await saveDrawing({
					sessionId,
					drawingData: buildDrawingData(stroke),
					color: stroke.color,
					strokeWidth: stroke.strokeWidth,
					toolType: stroke.toolType,
				})
				responses.push(normalizeWhiteboard(response))
			}
			setSavedStrokes((prev) => [...prev, ...responses])
			setPendingStrokes([])
			setNotice(`Saved ${responses.length} stroke${responses.length === 1 ? '' : 's'}.`)
		} catch (err) {
			setError(err.response?.data?.message || 'Could not save the whiteboard. Please try again.')
		} finally {
			setSaving(false)
		}
	}

	const handleClearServer = async () => {
		if (!sessionId) return
		if (!window.confirm('Delete all saved whiteboard data for this session? This cannot be undone.')) return
		try {
			await clearWhiteboard(sessionId)
			setSavedStrokes([])
			setPendingStrokes([])
			setNotice('Session whiteboard cleared on the server.')
		} catch (err) {
			setError(err.response?.data?.message || 'Could not clear the whiteboard on the server.')
		}
	}

	return (
		<AppLayout maxWidth="max-w-6xl">
			<p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Virtual Classroom</p>
			<h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold text-fg">
				<PenSquare className="h-5 w-5" />
				Whiteboard
			</h1>
			<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
				Enter a session ID to load or start a shared drawing board for that class. Each stroke or
				shape is saved individually, so hit Save after drawing to sync it.
			</p>

			<form
				onSubmit={loadSession}
				className="glossy-surface mt-6 flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center"
			>
				<input
					type="text"
					value={sessionInput}
					onChange={(event) => setSessionInput(event.target.value)}
					placeholder="Enter session ID"
					className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
				/>
				<button
					type="submit"
					disabled={loading}
					className="glossy inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					<Search className="h-3.5 w-3.5" />
					{loading ? 'Loading...' : 'Load Board'}
				</button>
			</form>

			{error && (
				<div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
					<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{notice && (
				<div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-900">
					<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{notice}</span>
				</div>
			)}

			<div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
				<div className="flex flex-col gap-4">
					<WhiteboardToolbar
						color={color}
						onColorChange={setColor}
						brushSize={brushSize}
						onBrushSizeChange={setBrushSize}
						tool={tool}
						onToolChange={setTool}
						onUndo={handleUndo}
						onClearLocal={handleClearLocal}
						onClearServer={handleClearServer}
						canClearServer={canClearServer && !!sessionId}
						onSave={handleSave}
						saving={saving}
						pendingCount={pendingStrokes.length}
					/>

					<div className="glossy-surface overflow-hidden rounded-xl border border-line bg-surface p-3 shadow-sm">
						<WhiteboardCanvas
							strokes={visibleStrokes}
							color={color}
							brushSize={brushSize}
							tool={tool}
							disabled={!sessionId}
							onStrokeComplete={handleStrokeComplete}
						/>
						{!sessionId && (
							<p className="mt-2 text-center text-xs text-muted">
								Load a session above to start drawing.
							</p>
						)}
					</div>
				</div>

				<WhiteboardHistoryPanel records={savedStrokes} pendingCount={pendingStrokes.length} />
			</div>
		</AppLayout>
	)
}

export default Whiteboard;