import api from './axiosConfig'

export const saveDrawing = (payload) =>
	api.post('/whiteboard/save', payload).then((res) => res.data)

export const getSessionWhiteboard = (sessionId) =>
	api.get(`/whiteboard/${sessionId}`).then((res) => res.data)

export const updateDrawing = (sessionId, payload) =>
	api.put(`/whiteboard/${sessionId}`, payload).then((res) => res.data)

export const clearWhiteboard = (sessionId) => api.delete(`/whiteboard/${sessionId}`).then((res) => res.data)
