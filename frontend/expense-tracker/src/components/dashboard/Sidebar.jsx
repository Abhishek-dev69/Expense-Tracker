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
    `
    relative flex items-center gap-3 px-5 py-3 rounded-2xl
    transition-all duration-300
    ${
      isActive
        ? "bg-white/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }
    `

  return (
    <aside
      className="
        relative w-64 min-h-screen p-6
        bg-white/5 backdrop-blur-xl
        border-r border-white/10
        shadow-[8px_0_32px_rgba(0,0,0,0.4)]
      "
    >
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-r-3xl" />

      <div className="relative">
        <h1 className="text-2xl font-bold text-white mb-12 tracking-wide">
          FinTrack AI
        </h1>

        <nav className="space-y-4 text-sm">
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
      </div>
    </aside>
  )
}

export default Sidebar