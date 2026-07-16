
export const normalizeMessage = (raw) => {
	return {
		id: raw.messageId,
		sessionId: raw.sessionId,
		senderId: raw.senderId,
		senderName: raw.senderName ?? 'Unknown',
		content: raw.message ?? '',
		messageType: raw.messageType,
		sentAt: raw.timestamp ?? raw.dateCreated ?? null,
	}
}

export const formatTime = (value) => {
	if (!value) return ''
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return ''
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
