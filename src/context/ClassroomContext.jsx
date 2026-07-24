import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { classroomSocket, sessionEventsTopic, userQueueTopic } from '../api/socket'
import * as ClassroomApi from '../api/ClassroomApi'
import { getSessionMessages, sendMessage as sendChatMessage } from '../api/ChatApi'
import { getSession } from '../api/SessionApi'
import { normalizeMessage } from '../constants/ChatHelpers'
import { Room, RoomEvent, Track } from 'livekit-client'

const ClassroomContext = createContext(null)

export const ClassroomProvider = ({ sessionId, children }) => {
	const { user } = useAuth()

	const [session, setSession] = useState(null)
	const [participants, setParticipants] = useState([])
	const [messages, setMessages] = useState([])
	const [raisedHands, setRaisedHands] = useState([])
	const [waitingList, setWaitingList] = useState([])
	const [connectionStatus, setConnectionStatus] = useState('connecting') 
	const [toasts, setToasts] = useState([])
	const [livekitRoom, setLivekitRoom] = useState(null)
	const [remoteTracks, setRemoteTracks] = useState({}) // { [identity]: { videoTrack, audioTrack, screenTrack } }
	const roomRef = useRef(null)

	const me = participants.find(
        p => p.userName === user?.username
    )
	const isTrainer = user?.role === 'TEACHER' || user?.role === 'ADMIN'

	const unsubRef = useRef([])

	const pushToast = useCallback((message, variant = 'info') => {
		const id = crypto.randomUUID()
		setToasts((prev) => [...prev, { id, message, variant }])
		setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
	}, [])

	const refreshParticipants = useCallback(() => {
		if (!sessionId) return
		ClassroomApi.getParticipants(sessionId).then(setParticipants).catch(() => {})
	}, [sessionId])

	const refreshHands = useCallback(() => {
		if (!sessionId || !isTrainer) return
		ClassroomApi.getRaisedHands(sessionId).then(setRaisedHands).catch(() => {})
	}, [sessionId, isTrainer])

	const refreshWaitingList = useCallback(() => {
		if (!sessionId || !isTrainer) return
		ClassroomApi.getWaitingList(sessionId).then(setWaitingList).catch(() => {})
	}, [sessionId, isTrainer])

	useEffect(() => {
		if (!sessionId) return
		getSession(sessionId).then(setSession).catch(() => {})
		refreshParticipants()
		refreshHands()
		refreshWaitingList()
		getSessionMessages(sessionId)
			.then((data) => setMessages((data || []).map(normalizeMessage)))
			.catch(() => {})
	}, [sessionId, refreshParticipants, refreshHands, refreshWaitingList])

	useEffect(() => {
		if (!sessionId) return

		classroomSocket.connect(
			() => setConnectionStatus('connected'),
			() => setConnectionStatus('disconnected')
		)

		const handleEvent = (evt) => {
			switch (evt.type) {
				case 'PARTICIPANT_JOINED':
				case 'PARTICIPANT_REJOINED':
				case 'PARTICIPANT_DISCONNECTED':
				case 'PARTICIPANT_LEFT':
				case 'PARTICIPANT_REMOVED':
				case 'MIC_STATUS_CHANGED':
				case 'CAMERA_STATUS_CHANGED':
				case 'PERMISSIONS_CHANGED':
				case 'SELF_UNMUTE_PERMISSION_CHANGED':
					refreshParticipants()
					break
				case 'MUTE_ALL':
					refreshParticipants()
					pushToast('The trainer muted everyone', 'info')
					break
				case 'WAITING_ROOM_REQUEST':
					refreshWaitingList()
					pushToast('A student is waiting to join', 'info')
					break
				case 'WAITING_ROOM_APPROVED':
				case 'WAITING_ROOM_REJECTED':
					refreshWaitingList()
					refreshParticipants()
					break
				case 'HAND_RAISED':
				case 'HAND_LOWERED':
				case 'HAND_APPROVED':
				case 'HAND_DISMISSED':
					refreshHands()
					refreshParticipants()
					break
				case 'CHAT_MESSAGE':
					setMessages((prev) => [...prev, normalizeMessage(evt.data)])
					break
				case 'SESSION_LOCKED':
					setSession((prev) => (prev ? { ...prev, locked: true } : prev))
					pushToast('Session locked — no new participants can join', 'warning')
					break
				case 'SESSION_UNLOCKED':
					setSession((prev) => (prev ? { ...prev, locked: false } : prev))
					break
				case 'SESSION_ENDED':
					setSession((prev) => (prev ? { ...prev, status: 'ENDED' } : prev))
					pushToast('The trainer ended the session', 'warning')
					break
				default:
					break
			}
		}

		const handlePrivate = (evt) => {
			switch (evt.type) {
				case 'YOU_WERE_REMOVED':
					pushToast('You were removed from the session', 'error')
					break
				case 'YOU_WERE_MUTED':
					pushToast('The trainer muted your microphone', 'warning')
					refreshParticipants()
					break
				case 'HAND_APPROVED':
					pushToast("You're approved to speak", 'success')
					break
				case 'HAND_DISMISSED':
					pushToast('Your raised hand was dismissed', 'info')
					break
				case 'JOIN_APPROVED':
					pushToast('You were admitted to the session', 'success')
					break
				case 'JOIN_REJECTED':
					pushToast('Your join request was declined', 'error')
					break
				case 'CAMERA_ON_REQUESTED':
					pushToast('The trainer asked you to turn on your camera', 'info')
					break
				default:
					break
			}
		}

		const unsubEvents = classroomSocket.subscribe(sessionEventsTopic(sessionId), handleEvent)
		const unsubPrivate = classroomSocket.subscribe(userQueueTopic(), handlePrivate)
		unsubRef.current = [unsubEvents, unsubPrivate]

        return () => {

            unsubRef.current.forEach(fn => fn())

            classroomSocket.disconnect()

        }
	}, [sessionId, refreshParticipants, refreshHands, refreshWaitingList, pushToast])

	const joinRoom = useCallback(async () => {
		try {
			await ClassroomApi.requestJoinClassroom(sessionId)
			await refreshParticipants()
		} catch (e) {
			console.error(e)
			const msg = e?.response?.data?.message || 'Unable to join the classroom. Please try again.'
			pushToast(msg, 'error')
			throw e
		}
	}, [sessionId, refreshParticipants, pushToast])

	useEffect(() => {
		if (!sessionId || !user) return

		let cancelled = false
		const room = new Room()
		roomRef.current = room

		const attachTrack = (identity, kind, track) => {
			setRemoteTracks((prev) => ({
				...prev,
				[identity]: { ...prev[identity], [kind]: track },
			}))
		}

		const detachTrack = (identity, kind) => {
			setRemoteTracks((prev) => {
				const next = { ...prev }
				if (next[identity]) {
					next[identity] = { ...next[identity], [kind]: null }
				}
				return next
			})
		}

		room
			.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
				const kind =
					track.source === Track.Source.ScreenShare
						? 'screenTrack'
						: track.kind === 'video'
						? 'videoTrack'
						: 'audioTrack'
				attachTrack(participant.identity, kind, track)
			})
			.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
				const kind =
					track.source === Track.Source.ScreenShare
						? 'screenTrack'
						: track.kind === 'video'
						? 'videoTrack'
						: 'audioTrack'
				detachTrack(participant.identity, kind)
			})
			.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
				const track = publication.track
				if (!track) return
				const kind =
					track.source === Track.Source.ScreenShare
						? 'screenTrack'
						: track.kind === 'video'
						? 'videoTrack'
						: 'audioTrack'
				attachTrack(participant.identity, kind, track)
			})
			.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
				const track = publication.track
				if (!track) return
				const kind =
					track.source === Track.Source.ScreenShare
						? 'screenTrack'
						: track.kind === 'video'
						? 'videoTrack'
						: 'audioTrack'
				detachTrack(participant.identity, kind)
			})
			.on(RoomEvent.ParticipantDisconnected, (participant) => {
				setRemoteTracks((prev) => {
					const next = { ...prev }
					delete next[participant.identity]
					return next
				})
			})

		ClassroomApi.getLiveKitToken(sessionId)
			.then(({ token }) => room.connect(import.meta.env.VITE_LIVEKIT_URL, token))
			.then(() => {
				if (!cancelled) setLivekitRoom(room)
			})
			.catch((e) => console.error('LiveKit connect failed', e))

		return () => {
			cancelled = true
			room.disconnect()
			roomRef.current = null
			setLivekitRoom(null)
			setRemoteTracks({})
		}
	}, [sessionId, user])

	const leaveRoom = useCallback(async () => {
        
        try {
            await ClassroomApi.leaveClassroom(sessionId)
        } catch (e) {
            console.error(e)
        }
        classroomSocket.disconnect()

    }, [sessionId])

	const toggleMic = useCallback(
		(unmute) => ClassroomApi.toggleMic(sessionId, unmute).then(refreshParticipants),
		[sessionId, refreshParticipants]
	)
	const toggleCamera = useCallback(
		(on) => ClassroomApi.toggleCamera(sessionId, on).then(refreshParticipants),
		[sessionId, refreshParticipants]
	)
	const muteAll = useCallback(() => ClassroomApi.muteAllParticipants(sessionId).then(refreshParticipants), [sessionId, refreshParticipants])
	const muteParticipant = useCallback(
		(participantId) => ClassroomApi.trainerMuteParticipant(sessionId, participantId).then(refreshParticipants),
		[sessionId, refreshParticipants]
	)
	const removeParticipant = useCallback(
		(participantId, allowRejoin) => ClassroomApi.removeParticipant(sessionId, participantId, allowRejoin).then(refreshParticipants),
		[sessionId, refreshParticipants]
	)

	const toggleHand = useCallback(
		(raised) => (raised ? ClassroomApi.raiseHand(sessionId) : ClassroomApi.lowerHand(sessionId)).then(refreshParticipants),
		[sessionId, refreshParticipants]
	)
	const approveHand = useCallback((participantId) => ClassroomApi.approveHand(sessionId, participantId).then(refreshHands), [sessionId, refreshHands])
	const dismissHand = useCallback((participantId) => ClassroomApi.dismissHand(sessionId, participantId).then(refreshHands), [sessionId, refreshHands])

	const approveWaiting = useCallback((participantId) => ClassroomApi.approveWaiting(sessionId, participantId).then(refreshWaitingList), [sessionId, refreshWaitingList])
	const rejectWaiting = useCallback((participantId) => ClassroomApi.rejectWaiting(sessionId, participantId).then(refreshWaitingList), [sessionId, refreshWaitingList])

	const lockRoom = useCallback(() => ClassroomApi.lockSession(sessionId), [sessionId])
	const unlockRoom = useCallback(() => ClassroomApi.unlockSession(sessionId), [sessionId])

	const sendChat = useCallback(
		(content) =>
			sendChatMessage({ sessionId, message: content, messageType: 'TEXT' }).then((res) => {
				setMessages((prev) => (prev.some((m) => m.id === res.messageId) ? prev : [...prev, normalizeMessage(res)]))
				return res
			}),
		[sessionId]
	)

	const value = {
		sessionId,
		session,
		me,
		isTrainer,
		participants,
		messages,
		raisedHands,
		waitingList,
		connectionStatus,
		toasts,
		joinRoom,
		leaveRoom,
		toggleMic,
		toggleCamera,
		muteAll,
		muteParticipant,
		removeParticipant,
		toggleHand,
		approveHand,
		dismissHand,
		approveWaiting,
		rejectWaiting,
		lockRoom,
		unlockRoom,
		sendChat,
		pushToast,
		livekitRoom,
		remoteTracks,
	}

	return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>
}

export const useClassroom = () => {
	const ctx = useContext(ClassroomContext)
	if (!ctx) throw new Error('useClassroom must be used within a ClassroomProvider')
	return ctx
}