import React from 'react'
import StatCard from './StatCard'


const StatsGrid = ({ data }) => {
  if (!data) return null

  const totalBalance = data.totalBalance ?? 0
  const totalIncome = data.totalIncome ?? 0
  const totalExpense = data.totalExpense ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard
        title="Total Balance"
        value={totalBalance}
      />

      <StatCard
        title="Monthly Income"
        value={totalIncome}
      />

      <StatCard
        title="Monthly Expenses"
        value={totalExpense}
      />

      <StatCard
        title="Savings"
        value={totalIncome - totalExpense}
      />
    </div>
  )
}

export default StatsGrid
