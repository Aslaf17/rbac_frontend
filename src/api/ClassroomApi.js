import api from './axiosConfig'

// Session controls (lock/unlock live on the existing session endpoints)
export const lockSession = (sessionId) => api.put(`/session/${sessionId}/lock`).then((r) => r.data)
export const unlockSession = (sessionId) => api.put(`/session/${sessionId}/unlock`).then((r) => r.data)

// Participants
export const requestJoinClassroom = (sessionId) =>
	api.post(`/session/${sessionId}/participants/join`).then(r => r.data)

export const rejoinClassroom = (sessionId) =>
	api.post(`/session/${sessionId}/participants/rejoin`).then(r => r.data)

export const leaveClassroom = (sessionId) =>
	api.post(`/session/${sessionId}/participants/leave`).then(r => r.data)

export const getParticipants = (sessionId, search = "") =>
	api.get(`/session/${sessionId}/participants`, {
		params: { search }
	}).then(r => r.data)

export const getLiveCount = (sessionId) =>
	api.get(`/session/${sessionId}/participants/count`).then(r => r.data)

export const removeParticipant = (
	sessionId,
	participantId,
	allowRejoin = false
) =>
	api.delete(`/session/${sessionId}/participants/${participantId}`, {
		params: { allowRejoin }
	}).then(r => r.data)

// Raise hand
export const raiseHand = (sessionId) => api.post(`/session/${sessionId}/hand/raise`).then((r) => r.data)
export const lowerHand = (sessionId) => api.post(`/session/${sessionId}/hand/lower`).then((r) => r.data)
export const getRaisedHands = (sessionId) => api.get(`/session/${sessionId}/hand`).then((r) => r.data)
export const approveHand = (sessionId, participantId) =>
	api.put(`/session/${sessionId}/hand/${participantId}/approve`).then((r) => r.data)
export const dismissHand = (sessionId, participantId) =>
	api.put(`/session/${sessionId}/hand/${participantId}/dismiss`).then((r) => r.data)

// Mic / camera
export const toggleMic = (sessionId, unmute) =>
	api.put(`/session/${sessionId}/media/mic`, null, { params: { unmute } }).then((r) => r.data)
export const toggleCamera = (sessionId, on) =>
	api.put(`/session/${sessionId}/media/camera`, null, { params: { on } }).then((r) => r.data)
export const trainerMuteParticipant = (sessionId, participantId) =>
	api.put(`/session/${sessionId}/media/${participantId}/mute`).then((r) => r.data)
export const muteAllParticipants = (sessionId) => api.put(`/session/${sessionId}/media/mute-all`).then((r) => r.data)
export const requestCameraOn = (sessionId, participantId) =>
	api.post(`/session/${sessionId}/media/${participantId}/request-camera`).then((r) => r.data)

// Waiting room
export const getWaitingList = (sessionId) => api.get(`/session/${sessionId}/waiting-room`).then((r) => r.data)
export const approveWaiting = (sessionId, participantId) =>
	api.put(`/session/${sessionId}/waiting-room/${participantId}/approve`).then((r) => r.data)
export const rejectWaiting = (sessionId, participantId) =>
	api.put(`/session/${sessionId}/waiting-room/${participantId}/reject`).then((r) => r.data)

// Activity log
export const getActivityLog = (sessionId) => api.get(`/session/${sessionId}/logs`).then((r) => r.data)