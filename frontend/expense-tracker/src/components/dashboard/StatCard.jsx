const StatCard = ({ title, value, highlight = false, icon }) => {
  return (
    <div
      className={`
        relative p-6 rounded-3xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.45)]
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        ${
          highlight
            ? "ring-1 ring-emerald-400/40 shadow-emerald-500/10"
            : ""
        }
      `}
    >
      {/* Inner Glow Layer */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400 tracking-wide">
          {title}
        </p>

        <div
          className={`
            text-xl p-3 rounded-2xl
            bg-[#1f2937]/70 backdrop-blur-md
            border border-white/5
            shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
          `}
        >
          {icon}
        </div>
      </div>

      <h3
        className={`
          relative text-3xl font-bold tracking-wide
          ${
            highlight
              ? "text-emerald-400"
              : "text-white"
          }
        `}
      >
        ₹{value.toLocaleString()}
      </h3>
    </div>
  )
}

export default StatCard