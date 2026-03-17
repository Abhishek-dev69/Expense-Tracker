import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"


import DashboardLayout from "./pages/Dashboard/DashboardLayout"
import Home from "./pages/Dashboard/Home"
import Analytics from "./pages/Dashboard/Analytics"
import Transactions from "./pages/Dashboard/Transactions"
import Budget from "./pages/Dashboard/Budget"
import AIInsights from "./pages/Dashboard/AIInsights"
import Reports from "./pages/Dashboard/Reports"
import Recurring from "./pages/Dashboard/Recurring"
import Goals from "./pages/Dashboard/Goals"
import Achievements from "./pages/Dashboard/Achievements"

const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="insights" element={<AIInsights />} />
        <Route path="reports" element={<Reports />} />
        <Route path="recurring" element={<Recurring />} />
        <Route path="goals" element={<Goals />} />
        <Route path="achievements" element={<Achievements />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
