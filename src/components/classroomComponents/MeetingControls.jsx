import {
	Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff, Hand,
	PenSquare, MessageCircle, Users, Circle, Settings, PhoneOff,
} from 'lucide-react'
import { useClassroom } from '../../context/ClassroomContext'

const ControlButton = ({ icon: Icon, label, active, danger, onClick, badge }) => (
	<div className="group relative">
		<button
			onClick={onClick}
			className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all ${
				danger
					? 'bg-red-600 text-white hover:bg-red-700'
					: active
					? 'bg-ink text-white'
					: 'bg-surface-2 text-fg hover:bg-line'
			}`}
		>
			<Icon className="h-5 w-5" strokeWidth={2} />
			{badge ? (
				<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
					{badge}
				</span>
			) : null}
		</button>
		<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
			{label}
		</span>
	</div>
)

export const MeetingControls = ({
	micOn,
	camOn,
	onToggleMic,
	onToggleCam,
	screenSharing,
	onToggleScreenShare,
	whiteboardOpen,
	onToggleWhiteboard,
	chatOpen,
	onToggleChat,
	participantsOpen,
	onToggleParticipants,
	recording,
	onToggleRecording,
	onOpenSettings,
	onLeave,
	unreadChatCount = 0,
}) => {
	const { me, isTrainer, toggleHand, raisedHands, waitingList } = useClassroom()
	const handRaised = me?.handStatus === 'RAISED'

	return (
		<div className="glossy-surface flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface/90 px-4 py-2.5 shadow-lg backdrop-blur-md sm:gap-3">
			<ControlButton icon={micOn ? Mic : MicOff} label={micOn ? 'Mute' : 'Unmute'} active={micOn} onClick={onToggleMic} />
			<ControlButton icon={camOn ? Video : VideoOff} label={camOn ? 'Stop camera' : 'Start camera'} active={camOn} onClick={onToggleCam} />
			<ControlButton
				icon={screenSharing ? ScreenShareOff : ScreenShare}
				label={screenSharing ? 'Stop sharing' : 'Share screen'}
				active={screenSharing}
				onClick={onToggleScreenShare}
			/>
			<ControlButton icon={Hand} label={handRaised ? 'Lower hand' : 'Raise hand'} active={handRaised} onClick={() => toggleHand(!handRaised)} />
			<ControlButton icon={PenSquare} label="Whiteboard" active={whiteboardOpen} onClick={onToggleWhiteboard} />
			<ControlButton icon={MessageCircle} label="Chat" active={chatOpen} onClick={onToggleChat} badge={unreadChatCount > 0 ? unreadChatCount : null} />
			<ControlButton
				icon={Users}
				label="Participants"
				active={participantsOpen}
				onClick={onToggleParticipants}
				badge={isTrainer && (raisedHands.length + waitingList.length) > 0 ? raisedHands.length + waitingList.length : null}
			/>
			{isTrainer && <ControlButton icon={Circle} label={recording ? 'Stop recording' : 'Record'} active={recording} onClick={onToggleRecording} />}
			<ControlButton icon={Settings} label="Settings" onClick={onOpenSettings} />

			<div className="mx-1 h-8 w-px bg-line" />

			<ControlButton icon={PhoneOff} label="Leave" danger onClick={onLeave} />
		</div>
	)
}