const StatCard = ({ title, value, subtitle, highlight = false, negative = false, icon }) => {
  const amount = value || 0

  return (
    <div
      className={`glass-panel surface-highlight relative overflow-hidden rounded-[1.9rem] p-5 transition-transform duration-300 hover:-translate-y-1 ${
        highlight ? "border-emerald-400/18" : "border-white/10"
      }`}
    >
      <div
        className={`absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full blur-3xl ${
          highlight ? "bg-emerald-400/12" : negative ? "bg-rose-400/12" : "bg-indigo-400/10"
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">{title}</p>
          <h3
            className={`mt-3 font-['Outfit'] text-3xl font-semibold tracking-tight ${
              highlight ? "text-emerald-100" : negative ? "text-rose-100" : "text-white"
            }`}
          >
            ₹{amount.toLocaleString("en-IN")}
          </h3>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[1.4rem] border ${
            highlight
              ? "border-emerald-400/20 bg-emerald-400/14"
              : negative
                ? "border-rose-400/16 bg-rose-400/12"
                : "border-white/[0.08] bg-white/[0.05]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
