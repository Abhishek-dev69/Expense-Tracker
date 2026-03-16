import { Search, Plus, Minus, LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const Topbar = ({ onAddIncome, onAddExpense }) => {
  const { user, logout } = useAuth()

  return (
    <header
      className="
        relative px-10 py-6
        bg-white/5 backdrop-blur-md
shadow-md
        border-b border-white/10
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
      "
    >
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between">

        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back, <span className="text-emerald-400 font-medium">{user?.name || "User"}</span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <div
            className="
              relative
              bg-white/5 backdrop-blur-md
              border border-white/10
              rounded-2xl
              shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
            "
          >
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="
                pl-9 pr-4 py-2 w-60 rounded-2xl
                bg-transparent text-white text-sm
                focus:outline-none
              "
            />
          </div>

          {/* Add Expense */}
          <button
            onClick={onAddExpense}
            className="
              flex items-center gap-2 px-5 py-2 rounded-2xl
              bg-red-500/90 backdrop-blur-md
              shadow-[6px_6px_16px_rgba(0,0,0,0.6)]
              hover:scale-105 hover:bg-red-600
              transition-all duration-300
              text-white font-medium
            "
          >
            <Minus className="w-4 h-4" />
            Add Expense
          </button>

          {/* Add Income */}
          <button
            onClick={onAddIncome}
            className="
              flex items-center gap-2 px-5 py-2 rounded-2xl
              bg-emerald-500/90 backdrop-blur-md
              shadow-[6px_6px_16px_rgba(0,0,0,0.6)]
              hover:scale-105 hover:bg-emerald-600
              transition-all duration-300
              text-white font-medium
            "
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>

          {/* User Card */}
          <div
            className="
              flex items-center gap-4 px-4 py-2 rounded-2xl
              bg-white/5 backdrop-blur-md
              border border-white/10
              shadow-[6px_6px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)]
            "
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserIcon size={18} />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-medium text-white max-w-[150px] truncate">
                {user?.email || "loading..."}
              </p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                {user?.name || "Member"}
              </p>
            </div>
            
            <div className="w-[1px] h-8 bg-white/10 mx-1" />

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-rose-400 transition-all active:scale-90"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Topbar