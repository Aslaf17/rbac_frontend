import api from './axiosConfig'

export const sendMessage = (payload) =>
	api.post('/chat/send', payload).then((res) => res.data)

export const getSessionMessages = (sessionId) =>
	api.get(`/chat/session/${sessionId}`).then((res) => res.data)

export const deleteMessage = (messageId) =>
	api.delete(`/chat/${messageId}`).then((res) => res.data)

export const joinSession = (sessionId) =>
	api.post(`/session/${sessionId}/join`).then((res) => res.data)