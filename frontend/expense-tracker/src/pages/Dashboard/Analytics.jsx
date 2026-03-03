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

const COLORS = ["#10B981", "#3B82F6", "#6366F1", "#F59E0B"]

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
    <div className="px-10 py-10 space-y-10">

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          ["Total Balance", data.totalBalance],
          ["Total Income", data.totalIncome],
          ["Total Expenses", data.totalExpense],
        ].map(([label, value]) => (
          <div
            key={label}
            className="
              p-6 rounded-2xl
              bg-[#111827]
              border border-white/10
              shadow-lg
              hover:-translate-y-1 transition
            "
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <h3 className="text-3xl font-bold text-white mt-2">
              ₹{value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      {/* ================= BAR + PIE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111827] border border-white/10 shadow-lg">
          <div className="flex justify-between mb-6">
            <h3 className="font-semibold text-white">
              Income vs Expenses
            </h3>
            <div className="flex gap-4 text-sm">
              <span className="text-emerald-400">● Income</span>
              <span className="text-blue-400">● Expense</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 shadow-lg">
          <h3 className="font-semibold text-white mb-6">
            Spending Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= DAILY TREND ================= */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-white/10 shadow-lg">
        <h3 className="font-semibold text-white mb-2">
          Daily Spending Trend
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Spending trajectory over time
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={areaData}>
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "12px",
                color: "white",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              fill="rgba(16,185,129,0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics