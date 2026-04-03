import {
  Menu,
  Plus,
  Minus,
  Flame,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Topbar = ({
  title,
  subtitle,
  isDashboardHome,
  onAddIncome,
  onAddExpense,
  onOpenSidebar,
}) => {
  const { user } = useAuth()

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
  })

  return (
    <header className="relative border-b border-white/[0.08] px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent" />

      <div className="relative flex flex-col gap-4 xl:gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <button
              onClick={onOpenSidebar}
              className="premium-chip mt-1 flex h-11 w-11 items-center justify-center rounded-2xl text-slate-200 xl:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-300">
                  <Sparkles size={12} />
                  Advanced workspace
                </span>
                <span className="premium-chip hidden items-center gap-2 rounded-full px-3 py-1 text-xs text-slate-300 sm:inline-flex">
                  <CalendarDays size={14} className="text-indigo-300" />
                  {formattedDate}
                </span>
              </div>

              <h2 className="font-['Outfit'] text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 sm:text-[15px]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="hidden min-w-[15rem] justify-end xl:flex">
            <div className="glass-panel flex min-w-[15rem] items-center gap-3 rounded-[1.7rem] px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-indigo-200">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
                  Momentum
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Welcome back, <span className="font-semibold text-white">{user?.name || "Investor"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="premium-chip flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_15px_rgba(110,231,183,0.6)]" />
              Live sync enabled
            </div>

            <div className="premium-chip flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-300">
              <Sparkles size={16} className="text-cyan-300" />
              Smarter insights available
            </div>

            {user?.streakCount > 0 && (
              <div className="premium-chip flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-rose-200">
                <Flame size={16} fill="currentColor" className="text-rose-400" />
                <span className="font-semibold">{user.streakCount} day streak</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddExpense}
              className="premium-button flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/14 px-4 py-3 text-sm font-semibold text-rose-100 hover:border-rose-300/34 hover:bg-rose-500/18"
            >
              <Minus size={16} />
              Add Expense
            </button>

            <button
              onClick={onAddIncome}
              className="premium-button flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(16,185,129,0.22)] hover:shadow-[0_22px_58px_rgba(16,185,129,0.28)]"
            >
              <Plus size={16} />
              Add Income
            </button>
          </div>
        </div>

        {isDashboardHome && (
          <div className="glass-panel surface-highlight hidden items-center justify-between rounded-[1.8rem] px-5 py-4 lg:flex">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">
                Daily Focus
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Review recurring bills, confirm budget health, and keep your savings pace above last month.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-emerald-400/18 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Actionable overview ready
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar
