import api from './axiosConfig'

export const startSession = (title) => 
    api.post('/session/start', { title }).then((res) => res.data)

export const endSession = (sessionId) => 
    api.put(`/session/${sessionId}/end`).then((res) => res.data)

export const getSession = (sessionId) => 
    api.get(`/session/${sessionId}`).then((res) => res.data)

export const joinSession = (sessionId) => 
    api.post(`/session/${sessionId}/join`).then((res) => res.data)