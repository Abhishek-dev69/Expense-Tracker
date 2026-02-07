import { Search, Plus, Minus } from "lucide-react"

const Topbar = ({ onAddIncome, onAddExpense }) => {
  return (
    <header className="bg-white border-b px-10 py-5">
      <div className="flex items-center justify-between">
        
        {/* LEFT: Title + subtitle */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your finance today.
          </p>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 w-56 rounded-lg border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Add Expense */}
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100"
          >
            <Minus className="w-4 h-4" />
            Add Expense
          </button>

          {/* Add Income */}
          <button
            onClick={onAddIncome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>

          {/* User */}
          <div className="flex items-center gap-3 ml-2">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="w-9 h-9 rounded-full"
            />
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-800">User</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
