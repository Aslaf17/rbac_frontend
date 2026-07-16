import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Loader2, MessageCircle, Send, Trash2, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { deleteMessage, getSessionMessages, sendMessage } from '../../api/ChatApi'
import { joinSession } from '../../api/ChatApi'
import { formatTime, normalizeMessage } from '../../constants/ChatHelpers'

const POLL_INTERVAL_MS = 4000

export default function ChatWidget() {
	const { user, isAuthenticated } = useAuth()
	const [open, setOpen] = useState(false)

	const [sessionId, setSessionId] = useState(() => sessionStorage.getItem('chat_session_id') || '')
	const [sessionInput, setSessionInput] = useState(sessionId)

	const [messages, setMessages] = useState([])
	const [draft, setDraft] = useState('')
	const [loading, setLoading] = useState(false)
	const [sending, setSending] = useState(false)
	const [joining, setJoining] = useState(false)
	const [joinError, setJoinError] = useState('')
	const [error, setError] = useState('')

	const scrollRef = useRef(null)
	const pollRef = useRef(null)

	const canModerate = user?.role === 'TEACHER' || user?.role === 'ADMIN'

	const toggleOpen = () => setOpen((prev) => !prev)
	const closeChat = () => setOpen(false)

	const loadMessages = (id, { silent } = {}) => {
		if (!id) return
		if (!silent) setLoading(true)
		getSessionMessages(id)
			.then((data) => {
				setMessages((data || []).map(normalizeMessage))
				setError('')
			})
			.catch((err) => {
				setError(err.response?.data?.message || 'Could not load messages for this session.')
			})
			.finally(() => {
				if (!silent) setLoading(false)
			})
	}

	useEffect(() => {
		if (open && sessionId) {
			loadMessages(sessionId)
			pollRef.current = setInterval(() => loadMessages(sessionId, { silent: true }), POLL_INTERVAL_MS)
		}
		return () => {
			if (pollRef.current) clearInterval(pollRef.current)
		}

	}, [open, sessionId])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [messages, open])

	const handleJoinSession = (event) => {
		event.preventDefault()
		const id = sessionInput.trim()
		if (!id || joining) return

		setJoining(true)
		setJoinError('')
		joinSession(id)
			.then(() => {
				sessionStorage.setItem('chat_session_id', id)
				setSessionId(id)
				setMessages([])
			})
			.catch((err) => {
				setJoinError(err.response?.data?.message || 'Could not join that session.')
			})
			.finally(() => setJoining(false))
	}

	const handleLeaveSession = () => {
		sessionStorage.removeItem('chat_session_id')
		setSessionId('')
		setSessionInput('')
		setMessages([])
		setJoinError('')
		if (pollRef.current) clearInterval(pollRef.current)
	}

	const handleSend = (event) => {
		event.preventDefault()
		const content = draft.trim()
		if (!content || !sessionId || sending) return

		setSending(true)
		sendMessage({ sessionId, message: content, messageType: 'TEXT' })
			.then((data) => {
				setMessages((prev) => [...prev, normalizeMessage(data)])
				setDraft('')
			})
			.catch((err) => {
				setError(err.response?.data?.message || 'Message failed to send.')
			})
			.finally(() => setSending(false))
	}

	const handleDelete = (messageId) => {
		if (!messageId) return
		deleteMessage(messageId)
			.then(() => setMessages((prev) => prev.filter((m) => m.id !== messageId)))
			.catch((err) => {
				setError(err.response?.data?.message || 'Could not delete message.')
			})
	}

	if (!isAuthenticated) return null

	return (
		<>
			{}
			{open && (
				<div className="fixed bottom-24 right-6 z-50 flex h-130 w-95 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
					{}
					<div className="flex items-center justify-between border-b border-line bg-ink px-4 py-3">
						<div className="flex items-center gap-2">
							<MessageCircle className="h-4 w-4 text-white" />
							<div>
								<p className="font-display text-sm font-semibold text-white">Session Chat</p>
								{sessionId && (
									<p className="font-mono text-[10px] text-white/60">Session: {sessionId}</p>
								)}
							</div>
						</div>
						<button
							onClick={closeChat}
							aria-label="Close chat"
							className="rounded-md p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					{}
					{!sessionId ? (
						<form onSubmit={handleJoinSession} className="flex flex-col gap-2 p-4">
							<p className="text-xs text-muted">Enter a session ID to join its chat.</p>
							<input
								type="text"
								value={sessionInput}
								onChange={(e) => setSessionInput(e.target.value)}
								placeholder="Session ID"
								className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
							/>
							{joinError && (
								<div className="flex items-start gap-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
									<AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
									<span>{joinError}</span>
								</div>
							)}
							<button
								type="submit"
								disabled={joining || !sessionInput.trim()}
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
							>
								{joining && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
								{joining ? 'Joining...' : 'Join Session'}
							</button>
						</form>
					) : (
						<>
							{}
							<div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
								{loading && (
									<div className="flex items-center justify-center gap-2 py-6 text-xs text-muted">
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
										Loading messages...
									</div>
								)}

								{!loading && messages.length === 0 && (
									<div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-muted">
										<MessageCircle className="h-5 w-5" />
										<p className="text-xs">No messages yet. Say hello.</p>
									</div>
								)}

								{messages.map((message) => {
									const isMine = message.senderName === user?.username
									// render
									return (
										<div
											key={message.id ?? `${message.senderName}-${message.sentAt}`}
											className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
										>
											<div
												className={`group relative max-w-[75%] rounded-lg px-3 py-2 text-sm ${
													isMine ? 'bg-ink text-white' : 'bg-paper text-fg ring-1 ring-inset ring-line'
												}`}
											>
												{!isMine && (
													<p className="mb-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
														{message.senderName}
													</p>
												)}
												<p className="whitespace-pre-wrap wrap-break-word leading-relaxed">{message.content}</p>
												<div className="mt-1 flex items-center justify-between gap-2">
													<span className={`text-[10px] ${isMine ? 'text-white/60' : 'text-muted'}`}>
														{formatTime(message.sentAt)}
													</span>
													{canModerate && (
														<button
															onClick={() => handleDelete(message.id)}
															aria-label="Delete message"
															className={`opacity-0 transition-opacity group-hover:opacity-100 ${
																isMine ? 'text-white/70 hover:text-white' : 'text-muted hover:text-red-600'
															}`}
														>
															<Trash2 className="h-3 w-3" />
														</button>
													)}
												</div>
											</div>
										</div>
									)
								})}
							</div>

							{error && (
								<div className="mx-4 mb-2 flex items-start gap-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-900">
									<AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
									<span>{error}</span>
								</div>
							)}

							{}
							<form onSubmit={handleSend} className="flex items-center gap-2 border-t border-line p-3">
								<input
									type="text"
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									placeholder="Type a message..."
									className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
								/>
								<button
									type="submit"
									disabled={sending || !draft.trim()}
									className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition-opacity hover:opacity-90 disabled:opacity-40"
								>
									{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
								</button>
							</form>
							<button
								onClick={handleLeaveSession}
								className="border-t border-line px-4 py-2 text-left text-[11px] text-muted transition-colors hover:text-fg"
							>
								Leave session &amp; switch
							</button>
						</>
					)}
				</div>
			)}

			{}
			<button
				onClick={toggleOpen}
				aria-label={open ? 'Close chat' : 'Open chat'}
				className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
			>
				{open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
			</button>
		</>
	)
}