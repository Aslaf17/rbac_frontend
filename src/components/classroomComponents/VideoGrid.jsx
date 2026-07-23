import { useClassroom } from '../../context/ClassroomContext'
import { VideoTile } from './VideoTitle'

export const VideoGrid = ({ localStream }) => {
	const { participants, me } = useClassroom()
	const active = participants.filter((p) => p.status === 'ACTIVE')

	const columns = active.length <= 1 ? 'grid-cols-1' : active.length <= 4 ? 'grid-cols-2' : active.length <= 9 ? 'grid-cols-3' : 'grid-cols-4'

	if (active.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
				<p className="text-sm">Waiting for participants to join…</p>
			</div>
		)
	}

	return (
		<div className={`grid h-full auto-rows-fr gap-3 ${columns}`}>
			{active.map((p) => (
				<VideoTile
					key={p.id}
					participant={p}
					isLocal={p.userId === me?.userId}
					stream={p.userId === me?.userId ? localStream : null}
				/>
			))}
		</div>
	)
}