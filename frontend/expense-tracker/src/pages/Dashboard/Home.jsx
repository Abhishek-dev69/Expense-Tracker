import { useEffect, useState } from "react"
import { ArrowUpRight, Sparkles, ShieldCheck, Wallet2 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"

import StatsGrid from "../../components/dashboard/StatsGrid"
import TransactionsTable from "../../components/dashboard/TransactionsTable"
import UpcomingBills from "../../components/dashboard/UpcomingBills"
import SalarySetupBanner from "../../components/dashboard/SalarySetupBanner"
import BudgetHealthCard from "../../components/dashboard/BudgetHealthCard"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)

const Home = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchDashboard = async (pageNo) => {
    try {
      setLoading(true)

      const res = await fetch(`${BASE_URL}/api/dashboard?page=${pageNo}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (!res.ok) throw new Error("Dashboard fetch failed")

      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Dashboard error:", err)
      setData({
        transactions: [],
        totalPages: 1,
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        averageDailyExpense: 0,
        monthlyBudgetLimit: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const processRecurring = async () => {
    try {
      await fetch(`${BASE_URL}/api/recurring/process`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      })
    } catch (err) {
      console.error("Auto-process error:", err)
    }
  }

  useEffect(() => {
    const init = async () => {
      await processRecurring()
      fetchDashboard(page)
    }

    init()
  }, [page])

  if (!data || loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel h-72 animate-pulse rounded-[2rem]" />
        <div className="glass-panel h-72 animate-pulse rounded-[2rem]" />
        <div className="glass-panel h-32 animate-pulse rounded-[2rem] lg:col-span-2" />
        <div className="glass-panel h-80 animate-pulse rounded-[2rem] lg:col-span-2" />
      </div>
    )
  }

  const savings = (data.totalIncome || 0) - (data.totalExpense || 0)
  const spendingRatio =
    data.totalIncome > 0
      ? Math.min(100, (data.totalExpense / data.totalIncome) * 100)
      : 0

  const heroMetrics = [
    {
      label: "Cash runway",
      value: formatCurrency(data.totalBalance),
      icon: Wallet2,
      tone: "text-emerald-200",
      glow: "bg-emerald-400/12",
    },
    {
      label: "Savings pace",
      value: formatCurrency(savings),
      icon: ShieldCheck,
      tone: "text-cyan-200",
      glow: "bg-cyan-400/12",
    },
    {
      label: "Spend intensity",
      value: `${spendingRatio.toFixed(0)}%`,
      icon: ArrowUpRight,
      tone: "text-indigo-200",
      glow: "bg-indigo-400/12",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-[100px]" />
          <div className="absolute bottom-[-3rem] right-12 h-36 w-36 rounded-full bg-indigo-400/12 blur-[80px]" />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300">
                <Sparkles size={12} />
                Smart overview
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="max-w-2xl font-['Outfit'] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              See every rupee with more clarity, motion, and control.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Your dashboard now surfaces the strongest signals first: balance health, savings momentum,
              upcoming payment pressure, and transaction activity in one cleaner operating view.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroMetrics.map(({ label, value, icon: Icon, tone, glow }) => (
                <div
                  key={label}
                  className="rounded-[1.6rem] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_20px_40px_rgba(2,6,23,0.18)]"
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${glow} ${tone}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute left-[-2rem] top-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-[70px]" />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
              Performance Lens
            </p>
            <h2 className="mt-3 font-['Outfit'] text-2xl font-semibold text-white">
              Monthly spending posture
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A quick read on how much of your income is already committed to expenses this month.
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-white/[0.08] bg-slate-950/30 p-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Expense share</span>
                <span className="font-semibold text-white">{spendingRatio.toFixed(0)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 transition-all duration-1000"
                  style={{ width: `${Math.max(spendingRatio, 6)}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.045] p-4">
                  <p className="text-slate-500">Income</p>
                  <p className="mt-2 font-semibold text-emerald-200">{formatCurrency(data.totalIncome)}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.045] p-4">
                  <p className="text-slate-500">Expense</p>
                  <p className="mt-2 font-semibold text-rose-200">{formatCurrency(data.totalExpense)}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-emerald-400/14 bg-emerald-400/8 p-4 text-sm text-emerald-100">
              {savings >= 0
                ? `You are retaining ${formatCurrency(savings)} this month after expenses.`
                : `Expenses are ahead by ${formatCurrency(Math.abs(savings))}; worth tightening categories this week.`}
            </div>
          </div>
        </div>
      </section>

      <SalarySetupBanner />

      <BudgetHealthCard
        totalExpense={data.totalExpense}
        budgetLimit={data.monthlyBudgetLimit}
        avgDailyExpense={data.averageDailyExpense}
      />

      <UpcomingBills />

      <StatsGrid data={data} />

      <TransactionsTable
        transactions={data.transactions || []}
        page={page}
        totalPages={data.totalPages || 1}
        onNext={() => setPage((currentPage) => Math.min(currentPage + 1, data.totalPages || 1))}
        onPrev={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
      />
    </div>
  )
}

export default Home
