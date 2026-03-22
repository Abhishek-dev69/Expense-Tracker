import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Topbar from "../../components/dashboard/Topbar"
import AddIncomeModal from "../../components/dashboard/AddIncomeModal"
import AddExpenseModal from "../../components/dashboard/AddExpenseModal"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

const DashboardLayout = () => {
  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)
  const { token } = useAuth()
  const location = useLocation()

  const authToken = token || localStorage.getItem("token")
  const isDashboardHome = location.pathname === "/dashboard" || location.pathname === "/dashboard/"

  // Auto-process recurring transactions on dashboard load
  useEffect(() => {
    const processRecurring = async () => {
      if (!authToken) return
      try {
        await axios.post(`${BASE_URL}/api/recurring/process`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      } catch (err) {
        console.error("Auto-process error:", err)
      }
    }
    processRecurring()
  }, [authToken])

  // Gamification: Sync streaks and badges on load
  useEffect(() => {
    const syncGamification = async () => {
      if (!authToken) return
      try {
        await axios.post(`${BASE_URL}/api/gamification/check-streak`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
        await axios.post(`${BASE_URL}/api/gamification/sync-badges`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      } catch (err) {
        console.error("Gamification sync error:", err)
      }
    }
    syncGamification()
  }, [authToken])

  if (!authToken) {
    return <Navigate to="/login" replace />
  }

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
      window.location.reload()
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
    <div className="relative flex h-screen text-white bg-[#0b1220] overflow-hidden dashboard-root">
      <style>{`
        @media print {
          /* Reset root layout for printing */
          .dashboard-root { height: auto !important; overflow: visible !important; display: block !important; background: white !important; }
          .sidebar-container, .topbar-container, .no-print { display: none !important; }
          
          /* Remove scroller containers and allow natural scroll */
          .main-content { 
            padding: 0 !important; 
            margin: 0 !important; 
            height: auto !important; 
            overflow: visible !important; 
            display: block !important; 
            background: white !important;
          }
          .main-scroller { 
            overflow: visible !important; 
            height: auto !important; 
            padding: 0 !important; 
            display: block !important; 
          }
          
          /* Global body reset */
          body, html { 
            height: auto !important; 
            overflow: visible !important; 
            background: white !important; 
            color: black !important;
          }
        }
      `}</style>

      {/* 🔥 Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] no-print" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] no-print" />

      {/* Main Layout */}
      <div className="relative flex w-full h-full">

        <div className="sidebar-container no-print">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden main-content">

          {isDashboardHome && (
            <div className="topbar-container no-print">
              <Topbar
                onAddIncome={() => setShowIncome(true)}
                onAddExpense={() => setShowExpense(true)}
              />
            </div>
          )}

          <main className={`flex-1 px-10 overflow-y-auto main-scroller ${isDashboardHome ? "py-10" : "py-12"}`}>
            <Outlet />
          </main>

        </div>

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
