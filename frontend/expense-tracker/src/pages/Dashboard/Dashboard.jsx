import { Outlet } from "react-router-dom"
import Sidebar from "../../components/dashboard/Sidebar"
import Topbar from "../../components/dashboard/Topbar"

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar stays same for all pages */}
        <div className="bg-white border-b">
          <Topbar />
        </div>

        {/* Page changes here */}
        <main className="flex-1 px-10 py-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
