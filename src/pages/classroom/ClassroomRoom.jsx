import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, Clock, Lock } from 'lucide-react'
import { ClassroomProvider, useClassroom } from '../../context/ClassroomContext'
import { VideoGrid } from '../../components/classroomComponents/VideoGrid'
import { MeetingControls } from '../../components/classroomComponents/MeetingControls'
import { ChatPanel } from '../../components/classroomComponents/ChatPanel'
import { ParticipantsPanel } from '../../components/classroomComponents/ParticipantsPanel'
import { WhiteboardDrawer } from '../../components/classroomComponents/WhiteboardDrawer'
import { ToastStack } from '../../components/classroomComponents/Toast'
import { getSessionWhiteboard, saveDrawing } from '../../api/WhiteboardApi'
import { normalizeWhiteboard, buildDrawingData } from '../../constants/WhiteboardHelpers'

const useMeetingDuration = (startedAt) => {
	const [elapsed, setElapsed] = useState('00:00')
	useEffect(() => {
		if (!startedAt) return
		const start = new Date(startedAt).getTime()
		const tick = () => {
			const diff = Math.max(0, Date.now() - start)
			const mins = String(Math.floor(diff / 60000)).padStart(2, '0')
			const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
			setElapsed(`${mins}:${secs}`)
		}
		tick()
		const interval = setInterval(tick, 1000)
		return () => clearInterval(interval)
	}, [startedAt])
	return elapsed
}

const RoomShell = () => {

	const navigate = useNavigate()
	const { session, connectionStatus, joinRoom, leaveRoom, toggleMic, toggleCamera, isTrainer, lockRoom, unlockRoom, livekitRoom } = useClassroom()
	const [micOn, setMicOn] = useState(false)
	const [camOn, setCamOn] = useState(false)
	const [screenSharing, setScreenSharing] = useState(false)
	const [whiteboardOpen, setWhiteboardOpen] = useState(false)
	const [chatOpen, setChatOpen] = useState(true) 
	const [participantsOpen, setParticipantsOpen] = useState(false)
	const [recording, setRecording] = useState(false)

	const [strokes, setStrokes] = useState([])
	const [pendingStrokes, setPendingStrokes] = useState([])
	const [savingBoard, setSavingBoard] = useState(false)

	const duration = useMeetingDuration(session?.startedAt)

	const joinedRef = useRef(false)
	const mediaRecorderRef = useRef(null)
	const recordedChunksRef = useRef([])
	const recordingStreamRef = useRef(null)

	useEffect(() => {

		if (joinedRef.current) return

		joinedRef.current = true

		joinRoom().catch(() => {
			navigate('/classroom')
		})
		return () => {
			leaveRoom().catch(console.error)
		}

	}, [joinRoom, leaveRoom, navigate])

	const handleToggleMic = async () => {
		try {
			await livekitRoom?.localParticipant.setMicrophoneEnabled(!micOn)
			await toggleMic(!micOn)
			setMicOn((v) => !v)
		} catch {
			/* mic permission denied */
		}
	}

	const handleToggleCam = async () => {
		try {
			if (!camOn) {
				await livekitRoom?.localParticipant.setCameraEnabled(true)
			} else {
				await livekitRoom?.localParticipant.setCameraEnabled(false)
			}
			await toggleCamera(!camOn)
			setCamOn((v) => !v)
		} catch (err) {
			console.error('Camera toggle failed:', err)
		}
	}

	const handleToggleScreenShare = async () => {
		try {
			if (!screenSharing) {
				await livekitRoom?.localParticipant.setScreenShareEnabled(true)
				setScreenSharing(true)
			} else {
				await livekitRoom?.localParticipant.setScreenShareEnabled(false)
				setScreenSharing(false)
			}
		} catch {
			/* user cancelled the share picker */
		}
	}

	const handleToggleRecording = async () => {
		if (!recording) {
			try {
				const stream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				})
				recordingStreamRef.current = stream
				recordedChunksRef.current = []

				const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' })
				recorder.ondataavailable = (e) => {
					if (e.data.size > 0) recordedChunksRef.current.push(e.data)
				}
				recorder.onstop = () => {
					const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
					const url = URL.createObjectURL(blob)
					const a = document.createElement('a')
					a.href = url
					a.download = `${session?.title || 'classroom-recording'}-${Date.now()}.webm`
					document.body.appendChild(a)
					a.click()
					a.remove()
					URL.revokeObjectURL(url)
					recordingStreamRef.current?.getTracks().forEach((t) => t.stop())
					recordingStreamRef.current = null
				}

				stream.getVideoTracks()[0].onended = () => {
					if (mediaRecorderRef.current?.state === 'recording') {
						mediaRecorderRef.current.stop()
					}
					setRecording(false)
				}

				recorder.start()
				mediaRecorderRef.current = recorder
				setRecording(true)
			} catch (err) {
				console.error('Failed to start recording', err)
			}
		} else {
			mediaRecorderRef.current?.stop()
			setRecording(false)
		}
	}

	const openWhiteboard = async () => {
		if (session?.sessionId) {
			const data = await getSessionWhiteboard(session.sessionId).catch(() => [])
			setStrokes((data || []).map(normalizeWhiteboard))
		}
		setWhiteboardOpen(true)
	}

	const handleSaveBoard = async () => {
		if (!pendingStrokes.length) return
		setSavingBoard(true)
		try {
			for (const stroke of pendingStrokes) {
				await saveDrawing({
					sessionId: session.sessionId,
					drawingData: buildDrawingData(stroke),
					color: stroke.color,
					strokeWidth: stroke.strokeWidth,
					toolType: stroke.toolType,
				})
			}
			setStrokes((prev) => [...prev, ...pendingStrokes])
			setPendingStrokes([])
		} finally {
			setSavingBoard(false)
		}
	}

	const handleLeave = async () => {
		await leaveRoom().catch(() => {})
		navigate('/classroom')
	}

	return (
		<div className="flex h-screen w-full flex-col bg-paper">
			<ToastStack />

			<div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
				<div className="flex items-center gap-3">
					<h1 className="truncate font-display text-sm font-semibold text-fg">{session?.title || 'Live Classroom'}</h1>
					{session?.locked && (
						<span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
							<Lock className="h-3 w-3" /> Locked
						</span>
					)}
				</div>
				<div className="flex items-center gap-4 text-xs text-muted">
					<span className="flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5" /> {duration}
					</span>
					<span className={`flex items-center gap-1.5 ${connectionStatus === 'connected' ? 'text-emerald-600' : 'text-red-500'}`}>
						{connectionStatus === 'connected' ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
						{connectionStatus === 'connected' ? 'Connected' : 'Reconnecting…'}
					</span>
					{isTrainer && (
						<button
							onClick={() => (session?.locked ? unlockRoom() : lockRoom())}
							className="rounded-md border border-line px-2 py-1 text-[11px] font-medium hover:bg-surface-2"
						>
							{session?.locked ? 'Unlock room' : 'Lock room'}
						</button>
					)}
				</div>
			</div>

			<div className="flex min-h-0 flex-1">
				<div className="relative flex min-w-0 flex-3 flex-col gap-3 p-4">
					<div className="min-h-0 flex-1">
						<VideoGrid /> 
					</div>
					<div className="flex justify-center">
						<MeetingControls
							micOn={micOn}
							camOn={camOn}
							onToggleMic={handleToggleMic}
							onToggleCam={handleToggleCam}
							screenSharing={screenSharing}
							onToggleScreenShare={handleToggleScreenShare}
							whiteboardOpen={whiteboardOpen}
							onToggleWhiteboard={() => (whiteboardOpen ? setWhiteboardOpen(false) : openWhiteboard())}
							chatOpen={chatOpen}
							onToggleChat={() => setChatOpen((v) => !v)}
							participantsOpen={participantsOpen}
							onToggleParticipants={() => setParticipantsOpen((v) => !v)}
							recording={recording}
							onToggleRecording={handleToggleRecording}
							onOpenSettings={() => {}}
							onLeave={handleLeave}
						/>
					</div>

					{whiteboardOpen && (
						<WhiteboardDrawer
							onClose={() => setWhiteboardOpen(false)}
							strokes={[...strokes, ...pendingStrokes]}
							onStrokeComplete={(stroke) => setPendingStrokes((prev) => [...prev, stroke])}
							onUndo={() => setPendingStrokes((prev) => prev.slice(0, -1))}
							onSave={handleSaveBoard}
							saving={savingBoard}
							pendingCount={pendingStrokes.length}
						/>
					)}
				</div>

				{(chatOpen || participantsOpen) && (
					<div className="hidden w-[25%] min-w-75 max-w-95 flex-col border-l border-line md:flex">
						{participantsOpen ? <ParticipantsPanel onClose={() => setParticipantsOpen(false)} /> : <ChatPanel onClose={() => setChatOpen(false)} />}
					</div>
				)}

				{(chatOpen || participantsOpen) && (
					<div className="fixed inset-x-3 bottom-24 top-20 z-40 md:hidden">
						{participantsOpen ? <ParticipantsPanel onClose={() => setParticipantsOpen(false)} /> : <ChatPanel onClose={() => setChatOpen(false)} floating />}
					</div>
				)}
			</div>
		</div>
	)
}

const ClassroomRoom = () => {
	const { sessionId } = useParams()
	return (
		<ClassroomProvider sessionId={sessionId}>
			<RoomShell />
		</ClassroomProvider>
	)
}

export default ClassroomRoom