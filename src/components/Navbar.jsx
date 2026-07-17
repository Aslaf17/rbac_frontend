import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, ScanFace, Sun, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ROLE_THEME } from '../constants/roleTheme'
import { AccessBadge } from './AccessBadge'

export const Navbar = ({ onMenuClick }) => {
	const { user, logout } = useAuth()
	const { isDark, toggleTheme } = useTheme()
	const navigate = useNavigate()

	if (!user) return null

	const theme = ROLE_THEME[user.role]

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<nav className="glossy sticky top-0 z-20 border-b border-line  bg-surface/80 backdrop-blur-md">
			<div className="flex items-center justify-between px-4 py-4 sm:px-6">
				<div className="flex items-center gap-2">
					{onMenuClick && (
						<button
							onClick={onMenuClick}
							className="mr-1 rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
						>
							<Menu className="h-5 w-5" />
						</button>
					)}
					<Link to={theme.path} className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
							<ScanFace className="h-4 w-4 text-white" strokeWidth={2} />
						</div>
						<span className="hidden font-display text-base font-semibold text-fg sm:inline">
							Access Portal
						</span>
					</Link>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<Link
						to="/profile"
						className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
					>
						<UserCircle className="h-4 w-4" />
						<span className="hidden sm:inline ">Profile</span>
					</Link>

					<AccessBadge role={user.role} username={user.username} size="mini" />

					<button
						type="button"
						onClick={toggleTheme}
						aria-label="Toggle dark mode"
						title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
						className="glossy-surface flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-muted  border-line transition-colors hover:text-fg"
					>
						{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
					</button>

					<button
						onClick={handleLogout}
						className="glossy flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
					>
						<LogOut className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Log out</span>
					</button>
				</div>
			</div>
		</nav>
	)
}
