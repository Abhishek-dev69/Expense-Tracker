import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"

import DashboardLayout from "./pages/Dashboard/DashboardLayout"
import Home from "./pages/Dashboard/Home"
import Analytics from "./pages/Dashboard/Analytics"
import Transactions from "./pages/Dashboard/Transactions"
import Settings from "./pages/Dashboard/Settings"

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
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
