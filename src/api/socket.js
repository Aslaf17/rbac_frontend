import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_BASE_URL = 'http://localhost:8080/ws'

class ClassroomSocket {
	constructor() {
		this.client = null
		this.connected = false
		this.subscriptions = new Map()
	}

	connect(onConnected, onError) {
		if (this.client?.active) {
			onConnected?.()
			return
		}

		const token = localStorage.getItem('rbac_token')

		this.client = new Client({
			webSocketFactory: () => new SockJS(`${WS_BASE_URL}?token=${encodeURIComponent(token || '')}`),
			reconnectDelay: 5000,
			heartbeatIncoming: 10000,
			heartbeatOutgoing: 10000,
			debug: (str) => console.log(str),
			onConnect: () => {
				console.log('STOMP Connected')
				this.connected = true
				this.subscriptions.forEach((entry, topic) => {
					entry.sub = this.client.subscribe(topic, (message) => {
						const body = JSON.parse(message.body)
						entry.callbacks.forEach((cb) => cb(body))
					})
				})
				onConnected?.()
			},
			onDisconnect: () => {
				this.connected = false
			},
			onWebSocketClose: () => {
				console.log('Socket Closed')
				this.connected = false
			},
			onStompError: (frame) => {
				console.error(frame)
				this.connected = false
				onError?.(frame)
			},
		})

		this.client.activate()
	}

	disconnect() {
		this.connected = false
		this.client?.deactivate()
		this.client = null
		this.subscriptions.clear()
	}

	subscribe(topic, callback) {
		let entry = this.subscriptions.get(topic)
		if (!entry) {
			entry = { sub: null, callbacks: new Set() }
			this.subscriptions.set(topic, entry)
			if (this.connected && this.client?.active) {
				entry.sub = this.client.subscribe(topic, (message) => {
					const body = JSON.parse(message.body)
					entry.callbacks.forEach((cb) => cb(body))
				})
			}
		}
		entry.callbacks.add(callback)

		return () => {
			entry.callbacks.delete(callback)
			if (entry.callbacks.size === 0) {
				entry.sub?.unsubscribe()
				this.subscriptions.delete(topic)
			}
		}
	}

	publish(destination, body) {
		if (!this.connected) {
			console.warn('Socket not connected')
			return
		}
		this.client.publish({ destination, body: JSON.stringify(body) })
	}
}

export const classroomSocket = new ClassroomSocket()

export const sessionEventsTopic = (sessionId) => `/topic/session/${sessionId}/events`
export const userQueueTopic = () => `/user/queue/notifications`