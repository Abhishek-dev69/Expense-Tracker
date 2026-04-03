import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Topbar from "../../components/dashboard/Topbar"
import AddIncomeModal from "../../components/dashboard/AddIncomeModal"
import AddExpenseModal from "../../components/dashboard/AddExpenseModal"
import { BASE_URL } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

const pageCopy = {
  "/dashboard": {
    title: "Financial Command Center",
    subtitle: "Track momentum, protect your runway, and move money with confidence.",
  },
  "/dashboard/transactions": {
    title: "Transaction Activity",
    subtitle: "Search, manage, and export every money movement across your account.",
  },
  "/dashboard/analytics": {
    title: "Analytics Intelligence",
    subtitle: "Read the patterns behind income, spend velocity, and savings performance.",
  },
  "/dashboard/budget": {
    title: "Budget Control",
    subtitle: "Monitor limits, reduce leakages, and stay ahead of monthly risk.",
  },
  "/dashboard/insights": {
    title: "AI Finance Insights",
    subtitle: "Convert your data into personalized guidance and next-best actions.",
  },
  "/dashboard/reports": {
    title: "Reports Studio",
    subtitle: "Generate polished summaries for audits, reviews, and planning sessions.",
  },
  "/dashboard/recurring": {
    title: "Recurring Payments",
    subtitle: "Automate subscriptions, bills, and repeat income without the manual work.",
  },
  "/dashboard/goals": {
    title: "Goals Progress",
    subtitle: "Turn long-term savings plans into trackable milestones and weekly wins.",
  },
  "/dashboard/achievements": {
    title: "Achievements",
    subtitle: "Celebrate streaks, habits, and financial discipline that compound over time.",
  },
  "/dashboard/debts": {
    title: "Shared Expenses",
    subtitle: "Coordinate balances, split costs, and keep everyone aligned.",
  },
}

const getPageMeta = (pathname) => {
  if (pageCopy[pathname]) return pageCopy[pathname]
  return {
    title: "Expense Tracker",
    subtitle: "A refined workspace for managing money across every part of your month.",
  }
}

const DashboardLayout = () => {
  const [showIncome, setShowIncome] = useState(false)
  const [showExpense, setShowExpense] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { token } = useAuth()
  const location = useLocation()

  const authToken = token || localStorage.getItem("token")
  const isDashboardHome =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/"
  const { title, subtitle } = getPageMeta(location.pathname)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const processRecurring = async () => {
      if (!authToken) return
      try {
        await axios.post(
          `${BASE_URL}/api/recurring/process`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
      } catch (err) {
        console.error("Auto-process error:", err)
      }
    }

    processRecurring()
  }, [authToken])

  useEffect(() => {
    const syncGamification = async () => {
      if (!authToken) return
      try {
        await axios.post(
          `${BASE_URL}/api/gamification/check-streak`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
        await axios.post(
          `${BASE_URL}/api/gamification/sync-badges`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
      } catch (err) {
        console.error("Gamification sync error:", err)
      }
    }

    syncGamification()
  }, [authToken])

  if (!authToken) {
    return <Navigate to="/login" replace />
  }

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
    <div className="dashboard-root app-shell-grid relative min-h-screen overflow-hidden bg-[var(--bg)] text-white">
      <style>{`
        @media print {
          .dashboard-root {
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            background: white !important;
          }

          .sidebar-container, .topbar-container, .no-print {
            display: none !important;
          }

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

          .grid, [class*="grid-cols-"], [class*="lg:col-span-"] {
            display: block !important;
            width: 100% !important;
            grid-template-columns: none !important;
            gap: 20px !important;
          }

          body, html {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="float-orbit absolute -left-28 top-0 h-80 w-80 rounded-full bg-emerald-500/14 blur-[120px]" />
        <div className="float-orbit-delayed absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-indigo-500/16 blur-[140px]" />
        <div className="float-orbit absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen">
        <div className="sidebar-container no-print hidden xl:block xl:px-5 xl:py-5">
          <Sidebar />
        </div>

        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            className="no-print fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`sidebar-container no-print fixed inset-y-0 left-0 z-40 w-[19rem] max-w-[86vw] px-4 py-4 transition-transform duration-300 xl:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="main-content relative flex min-h-screen flex-1 flex-col overflow-hidden px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 xl:pl-0">
          <div className="glass-panel-strong surface-highlight relative flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 sm:rounded-[2.25rem]">
            <div className="topbar-container no-print">
              <Topbar
                title={title}
                subtitle={subtitle}
                isDashboardHome={isDashboardHome}
                onAddIncome={() => setShowIncome(true)}
                onAddExpense={() => setShowExpense(true)}
                onOpenSidebar={() => setSidebarOpen(true)}
              />
            </div>

            <main className="main-scroller dashboard-scroll flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6 sm:pb-8 lg:px-8 lg:pt-5 xl:px-10 xl:pb-10">
              <div key={location.pathname} className="page-enter">
                <Outlet />
              </div>
            </main>
          </div>
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
