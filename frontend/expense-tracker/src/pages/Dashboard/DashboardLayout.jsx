import { Outlet } from "react-router-dom"
import { useState } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Topbar from "../../components/dashboard/Topbar"
import AddIncomeModal from "../../components/dashboard/AddIncomeModal"
import AddExpenseModal from "../../components/dashboard/AddExpenseModal"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"

const DashboardLayout = () => {
  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)
  const { token } = useAuth()

  const authToken = token || localStorage.getItem("token")

  // ✅ ADD INCOME (FIXED API)
  const handleAddIncome = async (incomeData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(incomeData),
      })

      if (!res.ok) throw new Error("Failed to add income")

      setShowIncome(false)
      window.location.reload() // simple refresh for now
    } catch (err) {
      console.error("Add income error:", err)
    }
  }

  // ✅ ADD EXPENSE (FIXED API)
  const handleAddExpense = async (expenseData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(expenseData),
      })

      if (!res.ok) throw new Error("Failed to add expense")

      setShowExpense(false)
      window.location.reload()
    } catch (err) {
      console.error("Add expense error:", err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b">
          <Topbar
            onAddIncome={() => setShowIncome(true)}
            onAddExpense={() => setShowExpense(true)}
          />
        </div>

        <main className="flex-1 px-10 py-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

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

export default DashboardLayout
