// src/components/dashboard/BudgetHealthCard.jsx
import { AlertTriangle, Zap, TrendingUp } from "lucide-react"

const BudgetHealthCard = ({ totalExpense, budgetLimit, avgDailyExpense }) => {
  if (!budgetLimit || budgetLimit === 0) return null

  const today = new Date()
  const daysPassed = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  
  const projectedExpense = avgDailyExpense * daysInMonth
  const percentOfBudget = (totalExpense / budgetLimit) * 100
  const projectedPercent = (projectedExpense / budgetLimit) * 100
  
  const isHealthy = projectedExpense <= budgetLimit
  const isDanger = percentOfBudget > 90 || !isHealthy

  return (
    <div className={`relative p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
      isHealthy 
        ? "bg-emerald-500/5 border-emerald-500/10" 
        : "bg-rose-500/5 border-rose-500/10"
    }`}>
      {/* Background Pulse for Danger */}
      {!isHealthy && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 ${
            isHealthy 
              ? "bg-emerald-500 text-white shadow-emerald-500/20" 
              : "bg-rose-500 text-white shadow-rose-500/20 scale-110"
          }`}>
            {isHealthy ? <Zap size={32} /> : <AlertTriangle size={32} className="animate-bounce" />}
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Budget Health: <span className={isHealthy ? "text-emerald-400" : "text-rose-400"}>
                {isHealthy ? "Stable" : "At Risk"}
              </span>
            </h3>
            <p className="text-gray-400 font-medium">
              {isHealthy 
                ? "You're spending within your daily velocity limits. Keep it up!" 
                : "Your daily velocity suggests you'll exceed your budget by the end of the month."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Current Progress</span>
             <span className="text-white font-bold text-lg">{Math.min(100, percentOfBudget).toFixed(1)}%</span>
          </div>
          
          <div className="w-full md:w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${isHealthy ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}
              style={{ width: `${Math.min(100, percentOfBudget)}%` }}
            />
          </div>

          {!isHealthy && (
            <div className="flex items-center gap-2 mt-2 text-rose-400 text-xs font-black uppercase tracking-widest animate-pulse">
              <TrendingUp size={14} /> Projected: ₹{projectedExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className={`absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] opacity-20 ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
    </div>
  )
}

export default BudgetHealthCard
