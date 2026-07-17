import { ROLE_THEME } from '../constants/roleTheme'

export const AccessBadge = ({ role, username, size = 'full' }) => {
	const theme = ROLE_THEME[role]
	const Icon = theme.icon

	if (size === 'mini') {
		return (
			<div className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3">
				<div
					className="flex h-6 w-6 items-center justify-center rounded-full"
					style={{ backgroundColor: theme.color }}
				>
					<Icon className="h-3.5 w-3.5 text-white " strokeWidth={2.5} />
				</div>
				<span className="font-mono text-[11px] font-semibold tracking-wide text-fg">
					{theme.code}
				</span>
			</div>
		)
	}

	return (
		<div className="relative overflow-hidden rounded-2xl bg-ink text-white border-line shadow-xl shadow-black/10">
			<div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: theme.color }} />

			<div className="flex items-start justify-between p-6 pl-8">
				<div>
					<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
						Access Credential
					</p>
					<h2 className="mt-2 font-display text-xl font-semibold">{username}</h2>
					<p className="mt-1 font-mono text-xs text-white/60">{theme.clearanceLine}</p>
				</div>

				<div
					className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
					style={{ backgroundColor: theme.color }}
				>
					<Icon className="h-6 w-6 text-white" strokeWidth={2} />
				</div>
			</div>

			<div className="flex items-center justify-between border-t border-white/10 px-6 py-3 pl-8">
				<span className="font-mono text-[11px] tracking-wide text-white/40">
					ID · {theme.code}-{hashCode(username)}
				</span>
				<span className="flex items-center gap-1.5 font-mono text-[11px] text-white/50">
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
					ACTIVE
				</span>
			</div>
		</div>
	)
}

const hashCode = (str) => {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i)
		hash |= 0
	}
	return String(Math.abs(hash) % 900 + 100)
}
