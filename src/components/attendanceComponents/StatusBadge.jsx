export const  StatusBadge = ({ status }) => {

	const statusStyle = (status) => {
		switch (status) {
			case "PRESENT":
				return {
					pill: "bg-green-100 text-green-700 ring-green-200",
					dot: "bg-green-500",
					label: "Present",
				};

			case "ABSENT":
				return {
					pill: "bg-red-100 text-red-700 dark:text-red-400 ring-red-200 dark:ring-red-900",
					dot: "bg-red-50 dark:bg-red-950/400",
					label: "Absent",
				};

			case "LATE":
				return {
					pill: "bg-yellow-100 text-yellow-700 ring-yellow-200",
					dot: "bg-yellow-500",
					label: "Late",
				};

			default:
				return {
					pill: "bg-gray-100 text-gray-700 ring-gray-200",
					dot: "bg-gray-500",
					label: status ?? "Unknown",
				};
		}
	};

	const style = statusStyle(status);

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${style.pill}`}
		>
			<span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
			{style.label}
		</span>
	);
}