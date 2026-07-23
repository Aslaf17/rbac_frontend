import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Search, Smile, Paperclip, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useClassroom } from '../../context/ClassroomContext'
import { formatTime } from '../../constants/ChatHelpers'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '👏', '🤔']

export const ChatPanel = ({ onClose, floating = false }) => {
	const { user } = useAuth()
	const { messages, sendChat} = useClassroom()

	const [draft, setDraft] = useState('')
	const [search, setSearch] = useState('')
	const [sending, setSending] = useState(false)
	const [showEmoji, setShowEmoji] = useState(false)
	const [typingUsers] = useState([]) 

	const scrollRef = useRef(null)

	const visibleMessages = useMemo(() => {
		if (!search.trim()) return messages
		const q = search.toLowerCase()
		return messages.filter((m) => m.content.toLowerCase().includes(q) || m.senderName.toLowerCase().includes(q))
	}, [messages, search])

	useEffect(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [messages])

	const handleSend = async (e) => {
		e.preventDefault()
		const content = draft.trim()
		if (!content || sending) return
		setSending(true)
		try {
			await sendChat(content)
			setDraft('')
		} catch {
			// error surfaced via toast in a real integration
		} finally {
			setSending(false)
		}
	}

	const avatarFor = (name) => (name || '?').slice(0, 2).toUpperCase()

	return (
		<div className={`flex h-full flex-col ${floating ? 'rounded-2xl border border-line bg-surface shadow-2xl' : 'border-l border-line bg-surface'}`}>
			<div className="flex items-center justify-between border-b border-line px-4 py-3">
				<h3 className="font-display text-sm font-semibold text-fg">Chat</h3>
				{onClose && (
					<button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-fg md:hidden">
						<X className="h-4 w-4" />
					</button>
				)}
			</div>

			<div className="border-b border-line px-3 py-2">
				<div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-2.5 py-1.5">
					<Search className="h-3.5 w-3.5 text-muted" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search messages"
						className="w-full bg-transparent text-xs text-fg placeholder:text-muted focus:outline-none"
					/>
				</div>
			</div>

			<div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
				{visibleMessages.length === 0 && (
					<div className="flex h-full flex-col items-center justify-center gap-1 text-center text-muted">
						<p className="text-sm">No messages yet</p>
						<p className="text-xs">Say hello to the class 👋</p>
					</div>
				)}

				{visibleMessages.map((m) => {
					const isMine = m.senderName === user?.username
					return (
						<div key={m.id ?? `${m.senderId}-${m.sentAt}`} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
								{avatarFor(m.senderName)}
							</div>
							<div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
								<div className="flex items-baseline gap-1.5">
									<span className="text-xs font-medium text-fg">{isMine ? 'You' : m.senderName}</span>
									<span className="text-[10px] text-muted">{formatTime(m.sentAt)}</span>
								</div>
								<div
									className={`mt-0.5 rounded-2xl px-3 py-2 text-sm ${
										isMine ? 'rounded-tr-sm bg-ink text-white' : 'rounded-tl-sm bg-surface-2 text-fg'
									}`}
								>
									{m.content}
								</div>
							</div>
						</div>
					)
				})}

				{typingUsers.length > 0 && (
					<p className="px-2 text-xs italic text-muted">{typingUsers.join(', ')} typing…</p>
				)}
			</div>

			<form onSubmit={handleSend} className="relative border-t border-line p-3">
				{showEmoji && (
					<div className="absolute bottom-full left-3 mb-2 flex gap-1 rounded-xl border border-line bg-surface p-2 shadow-lg">
						{QUICK_EMOJIS.map((emoji) => (
							<button
								key={emoji}
								type="button"
								onClick={() => {
									setDraft((prev) => prev + emoji)
									setShowEmoji(false)
								}}
								className="text-lg hover:scale-125 transition-transform"
							>
								{emoji}
							</button>
						))}
					</div>
				)}

				<div className="flex items-center gap-1.5 rounded-xl border border-line bg-paper px-2 py-1.5">
					<button type="button" onClick={() => setShowEmoji((v) => !v)} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg">
						<Smile className="h-4 w-4" />
					</button>
					<button type="button" title="Attach a file (UI only)" className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg">
						<Paperclip className="h-4 w-4" />
					</button>
					<input
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder="Type a message…"
						className="flex-1 bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
					/>
					<button
						type="submit"
						disabled={!draft.trim() || sending}
						className="rounded-lg bg-ink p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						<Send className="h-3.5 w-3.5" />
					</button>
				</div>
			</form>
		</div>
	)
}