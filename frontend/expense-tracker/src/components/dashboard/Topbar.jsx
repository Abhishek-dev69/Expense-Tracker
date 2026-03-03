import { Search, Plus, Minus } from "lucide-react"

const Topbar = ({ onAddIncome, onAddExpense }) => {
  return (
    <header className="px-10 py-6 border-b border-white/10 bg-[#0f172a]">
      
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Here's what's happening with your finance today.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 w-60 rounded-xl bg-[#1f2937] text-white text-sm border border-white/10 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Add Expense */}
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            <Minus className="w-4 h-4" />
            Add Expense
          </button>

          {/* Add Income */}
          <button
            onClick={onAddIncome}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>

          {/* User */}
          <div className="flex items-center gap-3 ml-4 px-4 py-2 rounded-xl bg-[#1f2937] border border-white/10">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-white">
                User
              </p>
              <p className="text-xs text-gray-400">
                Premium Plan
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Topbar