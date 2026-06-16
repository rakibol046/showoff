export default function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        active
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-green-500" : "bg-red-500"}`} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
