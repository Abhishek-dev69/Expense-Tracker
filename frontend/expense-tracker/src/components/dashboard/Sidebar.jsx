import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart3,
  List,
  Settings,
} from "lucide-react"

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-emerald-50 text-emerald-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`

  return (
    <aside className="w-64 bg-white border-r p-6">
      {/* Logo */}
      <h1 className="text-xl font-bold mb-10">FinTrack</h1>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/analytics" className={linkClass}>
          <BarChart3 size={18} />
          Analytics
        </NavLink>

        <NavLink to="/dashboard/transactions" className={linkClass}>
          <List size={18} />
          Transactions
        </NavLink>

        <NavLink to="/dashboard/settings" className={linkClass}>
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
