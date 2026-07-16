import { GraduationCap, BookOpen, Briefcase, IdCard, ShieldCheck } from 'lucide-react'

export const ROLES = ['STUDENT', 'TEACHER', 'EMPLOYER', 'EMPLOYEE', 'ADMIN']

export const ROLE_THEME = {
	STUDENT: {
		label: 'Student',
		code: 'STU',
		clearanceLine: 'Level 1 · Campus Access',
		path: '/student',
		icon: GraduationCap,
		color: '#3652E0',
		soft: 'bg-[#3652E0]/10 text-[#3652E0]',
		ring: 'focus:ring-[#3652E0]/30 focus:border-[#3652E0]',
	},
	TEACHER: {
		label: 'Teacher',
		code: 'TCH',
		clearanceLine: 'Level 2 · Faculty Access',
		path: '/teacher',
		icon: BookOpen,
		color: '#1E8F53',
		soft: 'bg-[#1E8F53]/10 text-[#1E8F53]',
		ring: 'focus:ring-[#1E8F53]/30 focus:border-[#1E8F53]',
	},
	EMPLOYER: {
		label: 'Employer',
		code: 'EMR',
		clearanceLine: 'Level 2 · Hiring Access',
		path: '/employer',
		icon: Briefcase,
		color: '#D9720C',
		soft: 'bg-[#D9720C]/10 text-[#D9720C]',
		ring: 'focus:ring-[#D9720C]/30 focus:border-[#D9720C]',
	},
	EMPLOYEE: {
		label: 'Employee',
		code: 'EMP',
		clearanceLine: 'Level 1 · Staff Access',
		path: '/employee',
		icon: IdCard,
		color: '#0E8C9E',
		soft: 'bg-[#0E8C9E]/10 text-[#0E8C9E]',
		ring: 'focus:ring-[#0E8C9E]/30 focus:border-[#0E8C9E]',
	},
	ADMIN: {
		label: 'Admin',
		code: 'ADM',
		clearanceLine: 'Level 5 · Full Access',
		path: '/admin',
		icon: ShieldCheck,
		color: '#D62839',
		soft: 'bg-[#D62839]/10 text-[#D62839]',
		ring: 'focus:ring-[#D62839]/30 focus:border-[#D62839]',
	},
}
