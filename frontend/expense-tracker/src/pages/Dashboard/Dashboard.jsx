import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"

import Sidebar from "../../components/dashboard/Sidebar"
import Topbar from "../../components/dashboard/Topbar"
import StatsGrid from "../../components/dashboard/StatsGrid"
import TransactionsTable from "../../components/dashboard/TransactionsTable"

import AddIncomeModal from "../../components/dashboard/AddIncomeModal"
import AddExpenseModal from "../../components/dashboard/AddExpenseModal"

const Dashboard = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)

  // 🔹 Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Dashboard error:", err)
      setData({
        totalBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        transactions: [],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authToken) fetchDashboard()
  }, [authToken])

  // ✅ ADD INCOME
  const handleAddIncome = async (incomeData) => {
    try {
      await fetch(`${BASE_URL}/api/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(incomeData),
      })

      setShowIncome(false)
      fetchDashboard()
    } catch (err) {
      console.error("Add income error:", err)
    }
  }

  // ✅ ADD EXPENSE
  const handleAddExpense = async (expenseData) => {
    try {
      await fetch(`${BASE_URL}/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(expenseData),
      })

      setShowExpense(false)
      fetchDashboard()
    } catch (err) {
      console.error("Add expense error:", err)
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* 🔝 TOP BAR (white like Figma) */}
        <div className="bg-white border-b">
          <Topbar
            onAddIncome={() => setShowIncome(true)}
            onAddExpense={() => setShowExpense(true)}
          />
        </div>

        {/* 📄 MAIN CONTENT */}
        <main className="flex-1 px-10 py-8 bg-gray-50">
          <StatsGrid data={data} />
          <TransactionsTable transactions={data.transactions} />
        </main>
      </div>

      {/* MODALS */}
      {showIncome && (
        <AddIncomeModal
          onClose={() => setShowIncome(false)}
          onSubmit={handleAddIncome}
        />
      )}

      {showExpense && (
        <AddExpenseModal
          onClose={() => setShowExpense(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  )
}

export default Dashboard
