import { useEffect, useRef } from 'react'
import { Mic, MicOff, VideoOff, MoreVertical } from 'lucide-react'

export const VideoTile = ({ participant, tracks, isLocal = false, isSpeaking = false }) => {
	const videoRef = useRef(null)
	const audioRef = useRef(null)
	const videoTrack = tracks?.screenTrack || tracks?.videoTrack
	const audioTrack = tracks?.audioTrack

	useEffect(() => {
		const videoElement = videoRef.current

		if (videoElement && videoTrack) {
			videoTrack.attach(videoElement)

			return () => {
				videoTrack.detach(videoElement)
			}
		}
	}, [videoTrack])

	useEffect(() => {
		if (isLocal) return

		const audioElement = audioRef.current

		if (audioElement && audioTrack) {
			audioTrack.attach(audioElement)

			return () => {
				audioTrack.detach(audioElement)
			}
		}
	}, [audioTrack, isLocal])

	const cameraOn = !!videoTrack
	const micOn = participant?.micStatus === 'UNMUTED'
	const initials = (participant?.userName || '?').slice(0, 2).toUpperCase()

	return (
		<div
			className={`group relative flex items-center justify-center overflow-hidden rounded-2xl border transition-all h-full w-full ${
				isSpeaking ? 'border-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]' : 'border-line'
			} bg-surface-2`}
		>
			{!isLocal && <audio ref={audioRef} autoPlay />}

			{cameraOn ? (
				<video ref={videoRef} autoPlay playsInline muted={isLocal} className="h-full w-full object-cover" />
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-surface-2 to-surface">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white">
						{initials}
					</div>
					<VideoOff className="h-4 w-4 text-muted" />
				</div>
			)}

			<div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/60 to-transparent px-3 py-2">
				<span className="truncate text-xs font-medium text-white">
					{participant?.userName} {isLocal && '(You)'}
				</span>
				<div className="flex items-center gap-1.5">
					{participant?.handStatus === 'RAISED' && <span className="text-sm">✋</span>}
					{micOn ? <Mic className="h-3.5 w-3.5 text-white" /> : <MicOff className="h-3.5 w-3.5 text-red-400" />}
				</div>
			</div>

			<button className="absolute right-2 top-2 hidden rounded-md bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 md:block">
				<MoreVertical className="h-3.5 w-3.5" />
			</button>
		</div>
	)
}