const StatCard = ({ title, value, highlight = false, icon }) => {
  return (
    <div
      className={`
        p-6 rounded-2xl
        bg-[#111827]
        border border-white/10
        shadow-lg
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        ${highlight ? "ring-1 ring-emerald-500/40" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {title}
        </p>
        <div className="text-xl">
          {icon}
        </div>
      </div>

      <h3 className="text-3xl font-bold text-white">
        ₹{value.toLocaleString()}
      </h3>
    </div>
  )
}

export default StatCard