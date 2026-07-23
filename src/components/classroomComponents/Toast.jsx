import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { useClassroom } from '../../context/ClassroomContext'

const VARIANT_STYLES = {
	success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-400' },
	error: { icon: XCircle, className: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-400' },
	warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-400' },
	info: { icon: Info, className: 'border-line bg-surface text-fg' },
}

export const ToastStack = () => {
	const { toasts } = useClassroom()

	return (
		<div className="pointer-events-none fixed right-4 top-20 z-60 flex w-80 flex-col gap-2">
			<AnimatePresence>
				{toasts.map((toast) => {
					const variant = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info
					const Icon = variant.icon
					return (
						<motion.div
							key={toast.id}
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 40 }}
							className={`glossy-surface pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${variant.className}`}
						>
							<Icon className="mt-0.5 h-4 w-4 shrink-0" />
							<span>{toast.message}</span>
						</motion.div>
					)
				})}
			</AnimatePresence>
		</div>
	)
}