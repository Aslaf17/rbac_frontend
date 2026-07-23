import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, PenSquare, Radio, ScanFace, X, Presentation } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_THEME } from '../constants/roleTheme'

export const Sidebar = ({ mobileOpen = false, onClose = () => {} }) => {
	const { user } = useAuth()
	const location = useLocation()

	if (!user) return null

	const theme = ROLE_THEME[user.role]

	const items = [
		{ label: 'Dashboard', to: theme.path, icon: LayoutDashboard, match: theme.path },
		{ label: 'Classroom', to: '/classroom', icon: Presentation, match: '/classroom' },
		{ label: 'Attendance', to: '/attendance', icon: CalendarCheck, match: '/attendance' },
		{ label: 'Whiteboard', to: '/whiteboard', icon: PenSquare, match: '/whiteboard' },
		{ label: 'Session', to: '/session', icon: Radio, match: '/session' },
	]

	const isActive = (match) =>
		location.pathname === match || location.pathname.startsWith(`${match}/`)

	const content = (
		<div className="glossy relative flex h-full w-64 flex-col overflow-hidden border-r border-line bg-surface text-fg">
			<div className="glossy-sheen" />

			<div className="relative flex items-center gap-2 border-b border-line px-5 py-5">
				<div
					className="flex h-8 w-8 items-center justify-center rounded-lg"
					style={{ backgroundColor: theme.color }}
				>
					<ScanFace className="h-4 w-4 text-white" strokeWidth={2} />
				</div>

				<span className="font-display text-base font-semibold text-fg">
					Access Portal
				</span>

				<button
					onClick={onClose}
					className="ml-auto rounded-md p-1 text-muted transition-colors hover:bg-paper hover:text-fg md:hidden"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			<div className="relative px-4 pt-5">
				<p className="px-2 text-[10px] uppercase tracking-[0.2em] text-muted">
					Menu
				</p>
			</div>

			<nav className="relative mt-2 flex-1 space-y-1 px-3">
				{items.map((item) => {
					const Icon = item.icon
					const active = isActive(item.match)

					return (
						<Link
							key={item.label}
							to={item.to}
							onClick={onClose}
							className={`group relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
								active ? 'text-fg shadow-inner' : 'text-muted hover:bg-paper hover:text-fg'
							}`}
							style={{
								backgroundColor: active ? `${theme.color}22` : 'transparent',
							}}
						>
							{active && (
								<span
									className="absolute inset-y-1 left-0 w-1 rounded-full"
									style={{ backgroundColor: theme.color }}
								/>
							)}

							<Icon className="h-4 w-4 shrink-0" strokeWidth={2} />

							{item.label}
						</Link>
					)
				})}
			</nav>

			<div className="relative border-t border-line px-5 py-4">
				<p className="text-[10px] uppercase tracking-[0.2em] text-muted">
					{theme.clearanceLine}
				</p>
			</div>
		</div>
	)

	return (
		<>
			<aside className="sticky top-0 hidden h-screen shrink-0 md:block">
				{content}
			</aside>

			{mobileOpen && (
				<div className="fixed inset-0 z-40 md:hidden">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={onClose}
					/>

					<div className="absolute inset-y-0 left-0">
						{content}
					</div>
				</div>
			)}
		</>
	)
}