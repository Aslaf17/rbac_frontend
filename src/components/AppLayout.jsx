import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const AppLayout = ({ children, maxWidth = 'max-w-6xl' }) => {
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<div className="flex min-h-screen bg-paper">
			<Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

			<div className="flex min-h-screen min-w-0 flex-1 flex-col">
				<Navbar onMenuClick={() => setMobileOpen(true)} />
				<main className={`mx-auto w-full ${maxWidth} flex-1 px-6 py-10`}>{children}</main>
			</div>
		</div>
	)
}
