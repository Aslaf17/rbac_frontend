import { useState } from 'react'
import { Search, Mic, MicOff, Video, VideoOff, UserX, MicOff as MicOffIcon, Check, X, Hand } from 'lucide-react'
import { useClassroom } from '../../context/ClassroomContext'

export const ParticipantsPanel = ({ onClose }) => {
	const {
		participants, raisedHands, waitingList, isTrainer,
		muteParticipant, removeParticipant, muteAll,
		approveHand, dismissHand, approveWaiting, rejectWaiting,
	} = useClassroom()

	const [search, setSearch] = useState('')

	const active = participants.filter(
		(p) => p.status === 'ACTIVE' && (p.userName?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()))
	)

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b border-line px-4 py-3">
				<h3 className="font-display text-sm font-semibold text-fg">Participants ({active.length})</h3>
				<button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-fg">
					<X className="h-4 w-4" />
				</button>
			</div>

			<div className="border-b border-line px-4 py-3">
				<div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
					<Search className="h-3.5 w-3.5 text-muted" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name or email"
						className="w-full bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
					/>
				</div>
			</div>

			{isTrainer && waitingList.length > 0 && (
				<div className="border-b border-line px-4 py-3">
					<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Waiting room ({waitingList.length})</p>
					<div className="flex flex-col gap-2">
						{waitingList.map((p) => (
							<div key={p.id} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
								<span className="truncate text-sm text-fg">{p.userName}</span>
								<div className="flex gap-1">
									<button onClick={() => approveWaiting(p.id)} className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700">
										<Check className="h-3.5 w-3.5" />
									</button>
									<button onClick={() => rejectWaiting(p.id)} className="rounded-md bg-red-600 p-1.5 text-white hover:bg-red-700">
										<X className="h-3.5 w-3.5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{isTrainer && raisedHands.length > 0 && (
				<div className="border-b border-line px-4 py-3">
					<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Raised hands ({raisedHands.length})</p>
					<div className="flex flex-col gap-2">
						{raisedHands.map((p) => (
							<div key={p.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
								<span className="flex items-center gap-1.5 truncate text-sm text-fg">
									<Hand className="h-3.5 w-3.5 text-amber-500" /> {p.userName}
								</span>
								<div className="flex gap-1">
									<button onClick={() => approveHand(p.id)} className="rounded-md bg-emerald-600 p-1.5 text-white hover:bg-emerald-700">
										<Check className="h-3.5 w-3.5" />
									</button>
									<button onClick={() => dismissHand(p.id)} className="rounded-md bg-line p-1.5 text-fg hover:bg-line/70">
										<X className="h-3.5 w-3.5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{isTrainer && active.length > 0 && (
				<div className="px-4 py-2">
					<button onClick={muteAll} className="text-xs font-medium text-muted hover:text-fg hover:underline">
						Mute all
					</button>
				</div>
			)}

			<div className="flex-1 overflow-y-auto px-4 py-2">
				{active.map((p) => (
					<div key={p.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-surface-2">
						<div className="flex min-w-0 items-center gap-2">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
								{(p.userName || '?').slice(0, 2).toUpperCase()}
							</div>
							<span className="truncate text-sm text-fg">{p.userName}</span>
						</div>
						<div className="flex shrink-0 items-center gap-1.5 text-muted">
							{p.micStatus === 'UNMUTED' ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5 text-red-500" />}
							{p.cameraStatus === 'ON' ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
							{isTrainer && (
								<>
									<button onClick={() => muteParticipant(p.id)} title="Mute" className="rounded p-1 hover:bg-line">
										<MicOffIcon className="h-3.5 w-3.5" />
									</button>
									<button onClick={() => removeParticipant(p.id, false)} title="Remove" className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
										<UserX className="h-3.5 w-3.5" />
									</button>
								</>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}