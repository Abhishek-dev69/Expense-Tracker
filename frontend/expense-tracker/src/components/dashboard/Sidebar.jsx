// src/components/dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  LayoutDashboard,
  BarChart3,
  List,
  Target,
  Brain,
  FileText,
  RotateCcw,
  Flag,
  Medal,
  LogOut,
  User as UserIcon,
  Users
} from "lucide-react"

const NavGroup = ({ title }) => (
  <p className="px-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 mt-6 first:mt-0">
    {title}
  </p>
)

const Sidebar = () => {
  const { user, logout } = useAuth()
  
  const linkClass = ({ isActive }) =>
    `
    relative flex items-center gap-3 px-5 py-3 rounded-2xl
    transition-all duration-300 mb-1
    ${
      isActive
        ? "bg-white/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }
    `

  return (
    <aside
      className="
        relative w-64 h-screen p-6 flex flex-col justify-between
        bg-white/5 backdrop-blur-xl
        border-r border-white/10
        shadow-[8px_0_32px_rgba(0,0,0,0.4)]
        rounded-none
      "
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="relative overflow-y-auto pr-2 custom-scrollbar">
        <h1 className="text-2xl font-black text-white mb-10 tracking-tighter flex items-center gap-2">
          FinTrack <span className="text-emerald-400">AI</span>
        </h1>

        <nav className="text-sm">
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/dashboard/transactions" className={linkClass}>
            <List size={18} /> Transactions
          </NavLink>

          <NavLink to="/dashboard/analytics" className={linkClass}>
            <BarChart3 size={18} /> Analytics
          </NavLink>
          <NavLink to="/dashboard/insights" className={linkClass}>
            <Brain size={18} /> AI Insights
          </NavLink>
          <NavLink to="/dashboard/reports" className={linkClass}>
            <FileText size={18} /> Reports
          </NavLink>

          <NavLink to="/dashboard/budget" className={linkClass}>
            <Target size={18} /> Budgeting
          </NavLink>
          <NavLink to="/dashboard/goals" className={linkClass}>
            <Flag size={18} /> Savings Goals
          </NavLink>
          <NavLink to="/dashboard/recurring" className={linkClass}>
            <RotateCcw size={18} /> Subscriptions
          </NavLink>
          <NavLink to="/dashboard/debts" className={linkClass}>
            <Users size={18} /> Friends & Debts
          </NavLink>

          <NavLink to="/dashboard/achievements" className={linkClass}>
            <Medal size={18} /> Achievements
          </NavLink>
        </nav>
      </div>

      <div className="relative mt-auto pt-6 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "Member"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-bold uppercase tracking-wider shadow-lg active:scale-95"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar