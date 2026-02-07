import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import StatCard from "./StatCard"

const StatsGrid = ({ data }) => {
  if (!data) return null

  const { totalBalance, totalIncome, totalExpense } = data

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Total Balance"
        value={totalBalance}
        highlight
        icon={<Wallet className="text-emerald-500" />}
      />

      <StatCard
        title="Monthly Income"
        value={totalIncome}
        icon={<TrendingUp className="text-emerald-500" />}
      />

      <StatCard
        title="Monthly Expenses"
        value={totalExpense}
        icon={<TrendingDown className="text-red-500" />}
      />

      <StatCard
        title="Savings"
        value={totalIncome - totalExpense}
        icon={<PiggyBank className="text-indigo-500" />}
      />
    </div>
  )
}

export default StatsGrid
