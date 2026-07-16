export const normalizeWhiteboard = (record) => {
	const drawingData = record.drawingData ?? {}
	const points = Array.isArray(drawingData.points) ? drawingData.points : Array.isArray(drawingData) ? drawingData : []
	const toolType = (record.toolType ?? 'PEN').toString().toUpperCase()

	return {
		id: record.id ?? record.whiteboardId ?? record.drawingId,
		sessionId: record.sessionId ?? record.session?.id ?? '',
		toolType,
		color: record.color ?? '#14161F',
		strokeWidth: record.strokeWidth ?? 4,


		points,


		startX: drawingData.startX,
		startY: drawingData.startY,
		endX: drawingData.endX,
		endY: drawingData.endY,


		x: drawingData.x,
		y: drawingData.y,
		width: drawingData.width,
		height: drawingData.height,


		centerX: drawingData.centerX,
		centerY: drawingData.centerY,
		radius: drawingData.radius,

		createdBy:
			record.createdBy?.username ??
			record.createdByUsername ??
			record.username ??
			record.user?.username ??
			null,
		createdAt: formatTimestamp(record.createdAt ?? record.timestamp),
		updatedAt: formatTimestamp(record.updatedAt ?? record.modifiedAt),
	}
}

export const buildDrawingData = (stroke) => {
	switch (stroke.toolType) {
		case 'LINE':
		case 'ARROW':
			return { startX: stroke.startX, startY: stroke.startY, endX: stroke.endX, endY: stroke.endY }
		case 'RECTANGLE':
			return { x: stroke.x, y: stroke.y, width: stroke.width, height: stroke.height }
		case 'CIRCLE':
			return { centerX: stroke.centerX, centerY: stroke.centerY, radius: stroke.radius }
		default:
			return { points: stroke.points }
	}
}

export const formatTimestamp = (value) => {
	if (!value) return null
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value)
	return date.toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}