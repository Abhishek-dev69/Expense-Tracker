import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  BarChart3,
  List,
  Target,
  Brain,
  FileText,
} from "lucide-react"

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-[#1f2937] text-emerald-400"
        : "text-gray-400 hover:bg-[#1f2937] hover:text-white"
    }`

  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] border-r border-white/10 p-6">
      <h1 className="text-2xl font-bold text-white mb-12">
        FinTrack AI
      </h1>

      <nav className="space-y-3 text-sm">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/analytics" className={linkClass}>
          <BarChart3 size={18} /> Analytics
        </NavLink>

        <NavLink to="/dashboard/transactions" className={linkClass}>
          <List size={18} /> Transactions
        </NavLink>

        <NavLink to="/dashboard/budget" className={linkClass}>
          <Target size={18} /> Budget
        </NavLink>

        <NavLink to="/dashboard/insights" className={linkClass}>
          <Brain size={18} /> AI Insights
        </NavLink>

        <NavLink to="/dashboard/reports" className={linkClass}>
          <FileText size={18} /> Reports
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar