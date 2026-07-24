import { useClassroom } from '../../context/ClassroomContext'
import { VideoTile } from './VideoTitle'

const getGridClasses = (count) => {
	if (count <= 1) return 'grid-cols-1 grid-rows-1'
	if (count === 2) return 'grid-cols-2 grid-rows-1'
	if (count <= 4) return 'grid-cols-2 grid-rows-2'
	if (count <= 6) return 'grid-cols-3 grid-rows-2'
	if (count <= 9) return 'grid-cols-3 grid-rows-3'
	if (count <= 12) return 'grid-cols-4 grid-rows-3'
	return 'grid-cols-4 grid-rows-4'
}

export const VideoGrid = () => {
	const { participants, me, remoteTracks } = useClassroom()
	const active = participants.filter((p) => p.status === 'ACTIVE')

	if (active.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
				<p className="text-sm">Waiting for participants to join…</p>
			</div>
		)
	}

	return (
		<div className={`grid h-full w-full auto-rows-fr gap-3 ${getGridClasses(active.length)}`}>
			{active.map((p) => (
				<VideoTile
					key={p.id}
					participant={p}
					isLocal={p.userId === me?.userId}
					tracks={remoteTracks[p.userName]}
				/>
			))}
		</div>
	)
}