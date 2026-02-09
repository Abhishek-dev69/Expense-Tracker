import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { BASE_URL } from "../../utils/apiPaths"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const COLORS = ["#6EE7B7", "#1E3A8A", "#34D399", "#CBD5E1"]

const Analytics = () => {
  const { token } = useAuth()
  const authToken = token || localStorage.getItem("token")
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then(setData)
  }, [])

  if (!data) return null

  /* =====================
     1️⃣ Monthly Bar Data
  ====================== */
  const monthly = {}

  data.transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("en-US", {
      month: "short",
    })

    if (!monthly[month]) {
      monthly[month] = { month, income: 0, expense: 0 }
    }

    if (t.amount > 0) monthly[month].income += t.amount
    else monthly[month].expense += Math.abs(t.amount)
  })

  const barData = Object.values(monthly)

  /* =====================
     2️⃣ Category Pie Data
  ====================== */
  const categoryMap = {}

  data.transactions.forEach((t) => {
    if (t.amount < 0) {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Math.abs(t.amount)
    }
  })

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }))

  /* =====================
     3️⃣ Daily Spending
  ====================== */
  const dailyData = {}

  data.transactions.forEach((t) => {
    if (t.amount < 0) {
      const day = new Date(t.date).toLocaleDateString("en-US", {
        weekday: "short",
      })
      dailyData[day] = (dailyData[day] || 0) + Math.abs(t.amount)
    }
  })

  const areaData = Object.entries(dailyData).map(([day, value]) => ({
    day,
    value,
  }))

  return (
    <div className="px-10 py-8 space-y-8 bg-gray-50 min-h-screen">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["Total Balance", data.totalBalance],
          ["Total Income", data.totalIncome],
          ["Total Expenses", data.totalExpense],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white p-6 rounded-2xl border shadow-sm"
          >
            <p className="text-gray-500">{label}</p>
            <h3 className="text-3xl font-bold">₹{value}</h3>
          </div>
        ))}
      </div>

      {/* BAR + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-2">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Income vs Expenses</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-500">● Income</span>
              <span className="text-blue-800">● Expense</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#6EE7B7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-4">Spending Breakdown</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DAILY SPENDING */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-semibold mb-2">Daily Spending Trend</h3>
        <p className="text-gray-500 text-sm mb-4">
          Spending trajectory over time
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={areaData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#34D399"
              fill="#D1FAE5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics
