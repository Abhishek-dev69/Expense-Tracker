import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"

import Dashboard from "./pages/Dashboard/Dashboard"
import Home from "./pages/Dashboard/Home"
import Income from "./pages/Dashboard/Income"
import Expense from "./pages/Dashboard/Expense"

const App = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Dashboard layout route */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Default page when /dashboard */}
        <Route index element={<Home />} />

        {/* Nested dashboard pages */}
        <Route path="home" element={<Home />} />
        <Route path="income" element={<Income />} />
        <Route path="expense" element={<Expense />} />
      </Route>

      {/* Redirect everything else */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
