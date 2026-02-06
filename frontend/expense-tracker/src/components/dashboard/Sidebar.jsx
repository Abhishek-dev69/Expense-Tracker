import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h1 className="text-xl font-bold mb-8">FinTrack</h1>

      <nav className="space-y-4">
        <NavLink to="/dashboard" className="block text-emerald-600 font-medium">
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/income" className="block text-gray-600">
          Income
        </NavLink>
        <NavLink to="/dashboard/expense" className="block text-gray-600">
          Expenses
        </NavLink>
        <NavLink to="/dashboard/settings" className="block text-gray-600">
          Settings
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
