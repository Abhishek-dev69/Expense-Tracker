import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import StatCard from "./StatCard"

const StatsGrid = ({ data }) => {
  if (!data) return null

  const { totalBalance = 0, totalIncome = 0, totalExpense = 0 } = data

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Balance"
        value={totalBalance}
        highlight
        subtitle="Current available position"
        icon={<Wallet className="text-emerald-200" />}
      />

      <StatCard
        title="Monthly Income"
        value={totalIncome}
        subtitle="All credited inflows"
        icon={<TrendingUp className="text-cyan-200" />}
      />

      <StatCard
        title="Monthly Expenses"
        value={totalExpense}
        subtitle="All debited outflows"
        negative
        icon={<TrendingDown className="text-rose-200" />}
      />

      <StatCard
        title="Savings"
        value={totalIncome - totalExpense}
        subtitle="Net retained this month"
        icon={<PiggyBank className="text-indigo-200" />}
      />
    </section>
  )
}

export default StatsGrid
