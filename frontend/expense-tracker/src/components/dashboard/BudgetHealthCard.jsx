import { AlertTriangle, Zap, TrendingUp } from "lucide-react"

const BudgetHealthCard = ({ totalExpense = 0, budgetLimit = 0, avgDailyExpense = 0 }) => {
  if (!budgetLimit) return null

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  const projectedExpense = avgDailyExpense * daysInMonth
  const percentOfBudget = (totalExpense / budgetLimit) * 100
  const isHealthy = projectedExpense <= budgetLimit

  return (
    <section
      className={`glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-6 sm:p-8 ${
        isHealthy ? "border-emerald-400/16" : "border-rose-400/14"
      }`}
    >
      <div
        className={`absolute right-[-3rem] top-[-2rem] h-40 w-40 rounded-full blur-[90px] ${
          isHealthy ? "bg-emerald-400/12" : "bg-rose-400/12"
        }`}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] ${
              isHealthy ? "bg-emerald-400/14 text-emerald-200" : "bg-rose-400/14 text-rose-200"
            }`}
          >
            {isHealthy ? <Zap size={28} /> : <AlertTriangle size={28} />}
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
              Budget Health
            </p>
            <h3 className="mt-2 font-['Outfit'] text-2xl font-semibold text-white">
              {isHealthy ? "Stable spending pace" : "Budget pressure detected"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {isHealthy
                ? "Your projected monthly spend is landing within budget based on current daily behavior."
                : "Current daily behavior suggests you may cross the monthly budget limit unless spending slows down."}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-[1.7rem] border border-white/[0.08] bg-slate-950/30 p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">Budget used</span>
            <span className="font-semibold text-white">{Math.min(100, percentOfBudget).toFixed(1)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isHealthy
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                  : "bg-gradient-to-r from-rose-400 to-amber-300"
              }`}
              style={{ width: `${Math.min(100, Math.max(percentOfBudget, 4))}%` }}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Spent so far</p>
              <p className="mt-2 font-semibold text-white">₹{totalExpense.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.045] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Projected</p>
              <p className={`mt-2 flex items-center gap-2 font-semibold ${isHealthy ? "text-emerald-200" : "text-rose-200"}`}>
                {!isHealthy && <TrendingUp size={15} />}
                ₹{projectedExpense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BudgetHealthCard
